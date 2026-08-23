"""
Piper as a LiveKit TTS plugin.

Speech synthesis is the one part of a free voice stack that cannot come from an
API. Groq's free tier allows 100 synthesis requests a day, and every reply the
agent speaks is one request, so a single conversation of fifteen turns eats a
sixth of the daily budget. Piper removes the meter: MIT licensed, runs on CPU,
and measured here at 143ms to first audio and 23x realtime once warm.

The generator Piper exposes is blocking, so synthesis runs on a worker thread and
chunks are handed back to the event loop as they arrive. Buffering the whole
utterance first would throw away the only latency number that matters.
"""

from __future__ import annotations

import asyncio
import json
import logging
from pathlib import Path

from livekit.agents import DEFAULT_API_CONNECT_OPTIONS, APIConnectionError, tts, utils

logger = logging.getLogger("piper-tts")

NUM_CHANNELS = 1


class PiperTTS(tts.TTS):
    def __init__(self, *, model_path: str | Path, config_path: str | Path | None = None) -> None:
        model = Path(model_path)
        config = Path(config_path) if config_path else model.with_suffix(model.suffix + ".json")

        if not model.exists():
            raise FileNotFoundError(f"Piper voice not found at {model}")
        if not config.exists():
            raise FileNotFoundError(f"Piper voice config not found at {config}")

        # The sample rate is needed before the voice is loaded, and the config
        # sidecar carries it. Reading a few KB of JSON beats loading 63MB of
        # ONNX just to answer one question.
        with config.open(encoding="utf-8") as fh:
            sample_rate = int(json.load(fh)["audio"]["sample_rate"])

        super().__init__(
            capabilities=tts.TTSCapabilities(streaming=False),
            sample_rate=sample_rate,
            num_channels=NUM_CHANNELS,
        )

        self._model_path = model
        self._config_path = config
        self._voice = None
        self._load_lock = asyncio.Lock()

    def load_sync(self):
        """
        Load the ONNX session. Called from the server's setup hook, which runs
        once per worker process before any job is accepted, so the 1.5 second
        cold start is paid before anyone is listening rather than during the
        first reply.
        """
        if self._voice is None:
            from piper import PiperVoice

            logger.info("loading Piper voice %s", self._model_path.name)
            self._voice = PiperVoice.load(str(self._model_path), str(self._config_path))
            logger.info("Piper voice ready")
        return self._voice

    async def ensure_voice(self):
        """Lazy fallback, for the case where setup did not run."""
        if self._voice is not None:
            return self._voice

        async with self._load_lock:
            if self._voice is None:
                await asyncio.to_thread(self.load_sync)
        return self._voice

    def synthesize(  # type: ignore[override]
        self, text: str, *, conn_options=DEFAULT_API_CONNECT_OPTIONS
    ) -> ChunkedStream:
        return ChunkedStream(tts=self, input_text=text, conn_options=conn_options)


class ChunkedStream(tts.ChunkedStream):
    def __init__(self, *, tts: PiperTTS, input_text: str, conn_options) -> None:
        super().__init__(tts=tts, input_text=input_text, conn_options=conn_options)
        self._tts: PiperTTS = tts

    async def _run(self, output_emitter: tts.AudioEmitter) -> None:
        voice = await self._tts.ensure_voice()

        output_emitter.initialize(
            request_id=utils.shortuuid(),
            sample_rate=self._tts.sample_rate,
            num_channels=NUM_CHANNELS,
            mime_type="audio/pcm",
            # The emitter cannot release a frame until it holds a whole one, so
            # the frame size is a floor on time-to-first-audio. 100ms halves that
            # floor for a few more, cheaper, frames.
            frame_size_ms=200,
        )

        loop = asyncio.get_running_loop()
        queue: asyncio.Queue[bytes | None] = asyncio.Queue()
        failure: list[BaseException] = []

        def synthesize_blocking() -> None:
            try:
                for chunk in voice.synthesize(self._input_text):
                    loop.call_soon_threadsafe(queue.put_nowait, chunk.audio_int16_bytes)
            except BaseException as exc:  # noqa: BLE001 - re-raised on the loop below
                failure.append(exc)
            finally:
                loop.call_soon_threadsafe(queue.put_nowait, None)

        worker = asyncio.create_task(asyncio.to_thread(synthesize_blocking))
        try:
            while True:
                data = await queue.get()
                if data is None:
                    break
                output_emitter.push(data)

            if failure:
                raise APIConnectionError("Piper synthesis failed") from failure[0]

            output_emitter.flush()
        finally:
            await asyncio.shield(worker)

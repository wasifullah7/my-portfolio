

from __future__ import annotations

import asyncio
import logging
import os
from pathlib import Path

import sys

from dotenv import load_dotenv
from livekit import agents
from livekit.agents import AgentServer, AgentSession, JobContext, inference, llm, room_io
from livekit.plugins import groq, silero

from booking import PortfolioAgent
from knowledge import build_instructions, load_digest_sync
from metrics_bridge import TurnLatency
from piper_tts import PiperTTS

load_dotenv(".env.local")
load_dotenv(".env")

# Piper logs IPA phonemes; a Windows console codepage cannot encode them.
if sys.platform == "win32":
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")

logger = logging.getLogger("portfolio-agent")

SITE_URL = os.getenv("SITE_URL", "https://wasif-ullah-portfolio.vercel.app")
DIGEST_URL = f"{SITE_URL}/llms.txt"

VOICE_DIR = Path(__file__).parent / "voices"
VOICE_NAME = os.getenv("PIPER_VOICE", "en_US-ryan-medium")

MAX_SESSION_SECONDS = int(os.getenv("MAX_SESSION_SECONDS", "180"))
WARN_AT_SECONDS = max(MAX_SESSION_SECONDS - 30, 30)

STT_MODEL = os.getenv("GROQ_STT_MODEL", "whisper-large-v3-turbo")

# Whisper conditions on this, so the names it would otherwise guess at come back
# spelled the way the site spells them.
STT_VOCABULARY = (
    "Wasif Ullah, RF-DETR, PaddleOCR, SAM2, OpenCV, PyTorch, LiveKit, Twilio, "
    "pgvector, BM25, vLLM, FastAPI, PostgreSQL, MongoDB, Redis, LangChain, "
    "Pinecone, ChromaDB, DeBERTa, PyMuPDF, spaCy, Kubernetes, Terraform, QAOA, "
    "Rigetti, HRMS, LTI, Whisper, Piper, Groq, Next.js, TypeScript."
)

LLM_MODEL = os.getenv("GROQ_LLM_MODEL", "openai/gpt-oss-120b")
LLM_FALLBACK_MODEL = os.getenv("GROQ_LLM_FALLBACK", "openai/gpt-oss-20b")


def setup(proc: agents.JobProcess) -> None:
    proc.userdata["vad"] = silero.VAD.load()
    tts = PiperTTS(model_path=VOICE_DIR / f"{VOICE_NAME}.onnx")
    tts.load_sync()
    proc.userdata["tts"] = tts
    proc.userdata["digest"] = load_digest_sync(DIGEST_URL)


server = AgentServer(setup_fnc=setup)


@server.rtc_session(agent_name="portfolio-agent")
async def entrypoint(ctx: JobContext) -> None:

    turn_detector = inference.TurnDetector()

    session = AgentSession(
        stt=groq.STT(model=STT_MODEL, language="en", prompt=STT_VOCABULARY),
        # The bigger model follows the persona more closely, but Groq caps tokens
        # per day per model. When that runs out it 429s and the agent goes quiet,
        # so the smaller model stands behind it on its own separate quota.
        llm=llm.FallbackAdapter(
            [
                groq.LLM(model=m, reasoning_effort="low", max_completion_tokens=200, temperature=0.2)
                for m in (LLM_MODEL, LLM_FALLBACK_MODEL)
            ],
            max_retry_per_llm=0,
        ),
        tts=ctx.proc.userdata["tts"],
        vad=ctx.proc.userdata["vad"],
        turn_handling={
            # Semantic end of turn, so a pause mid-thought is not treated as the
            # end of the sentence. Cloud v1 while hosted, local v1-mini otherwise.
            "turn_detection": turn_detector,
            # Piper runs inside this process, so a preemptive synthesis that gets
            # thrown away costs CPU and nothing else. This is off by default
            # because it usually means paying a TTS vendor for discarded audio.
            "preemptive_generation": {"preemptive_tts": True},
        },
    )
    logger.info("turn detector: %s %s", turn_detector.provider, turn_detector.model)

    latency = TurnLatency(ctx.room)
    session.on("metrics_collected", latency.handle)

    # When the model or synthesis fails the session simply stops talking, which
    # looks broken rather than busy. Saying something is the difference between
    # a visitor waiting and a visitor leaving. Guarded so a failing recovery
    # cannot loop on itself.
    spoke_failure = False

    def on_error(event) -> None:
        nonlocal spoke_failure
        logger.error("session error from %s: %s", event.source, event.error)
        if spoke_failure:
            return
        spoke_failure = True
        asyncio.create_task(
            session.say(
                "Sorry, I lost my connection to the model for a moment. "
                "The hiring form on this page still reaches Wasif directly."
            )
        )

    session.on("error", on_error)

    agent = PortfolioAgent(build_instructions(ctx.proc.userdata["digest"]), room=ctx.room)

    await session.start(
        room=ctx.room,
        agent=agent,
        # Noise cancellation is off. livekit-plugins-noise-cancellation 0.3.0
        # threw from its native destructor on every session teardown and aborted
        # the worker with SIGABRT, so the agent never spoke at all:
        #   Nc::~Nc: Exception caught while destroying the session
        #   terminate called after throwing an instance of std::runtime_error
        # Worth retrying on a later plugin release.
        room_options=room_io.RoomOptions(),
    )

    async def close_on_timeout() -> None:
        try:
            await asyncio.sleep(WARN_AT_SECONDS)
            await session.generate_reply(
                instructions=(
                    "Tell the person you have about thirty seconds left, and that they can "
                    "use the hiring form or book a call to carry on properly. Keep it to one "
                    "short sentence."
                )
            )
            await asyncio.sleep(MAX_SESSION_SECONDS - WARN_AT_SECONDS)
            logger.info("session cap of %ss reached, closing", MAX_SESSION_SECONDS)
            await session.aclose()
            await ctx.room.disconnect()
        except asyncio.CancelledError:
            pass

    timeout_task = asyncio.create_task(close_on_timeout())
    ctx.add_shutdown_callback(lambda: _cancel(timeout_task))

    await session.say("Hey, this is Wasif. What would you like to know?")


async def _cancel(task: asyncio.Task) -> None:
    task.cancel()


if __name__ == "__main__":
    agents.cli.run_app(server)

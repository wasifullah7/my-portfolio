

from __future__ import annotations

import asyncio
import logging
import os
from pathlib import Path

import sys

from dotenv import load_dotenv
from livekit import agents
from livekit.agents import AgentServer, AgentSession, JobContext, room_io
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

LLM_MODEL = os.getenv("GROQ_LLM_MODEL", "openai/gpt-oss-120b")


def setup(proc: agents.JobProcess) -> None:
    proc.userdata["vad"] = silero.VAD.load()
    tts = PiperTTS(model_path=VOICE_DIR / f"{VOICE_NAME}.onnx")
    tts.load_sync()
    proc.userdata["tts"] = tts
    proc.userdata["digest"] = load_digest_sync(DIGEST_URL)


server = AgentServer(setup_fnc=setup)


@server.rtc_session(agent_name="portfolio-agent")
async def entrypoint(ctx: JobContext) -> None:

    session = AgentSession(
        stt=groq.STT(model=STT_MODEL, language="en"),
        llm=groq.LLM(
            model=LLM_MODEL,
            reasoning_effort="low",
            max_completion_tokens=200,
            temperature=0.4,
        ),
        tts=ctx.proc.userdata["tts"],
        vad=ctx.proc.userdata["vad"],
        allow_interruptions=True,
    )

    latency = TurnLatency(ctx.room)
    session.on("metrics_collected", latency.handle)

    agent = PortfolioAgent(build_instructions(ctx.proc.userdata["digest"]), room=ctx.room)

    await session.start(
        room=ctx.room,
        agent=agent,
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

    await session.say(
        "Hi, I am an AI assistant speaking for Wasif. "
        "What would you like to know about his work?"
    )


async def _cancel(task: asyncio.Task) -> None:
    task.cancel()


if __name__ == "__main__":
    agents.cli.run_app(server)

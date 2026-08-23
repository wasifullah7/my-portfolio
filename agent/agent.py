"""
The voice agent behind /talk on the portfolio.

Free to run, by design:

  speech recognition   Groq whisper-large-v3-turbo   free tier, 8 hours a day
  language model       Groq, open weights            free tier, 14,400 req/day
  speech synthesis     Piper, local, MIT             unmetered
  voice activity       Silero, local                 unmetered

Synthesis is the piece that has to be local. Groq's free synthesis quota is 100
requests a day and one reply is one request, so an API would cap the page at
about six conversations. See piper_tts.py.

Run locally:   uv run python agent.py dev
Deploy:        lk agent create   (LiveKit Cloud, free Build plan)
"""

from __future__ import annotations

import asyncio
import logging
import os
from pathlib import Path

import sys

from dotenv import load_dotenv
from livekit import agents
from livekit.agents import Agent, AgentServer, AgentSession, JobContext, room_io
from livekit.plugins import groq, silero

from knowledge import build_instructions, load_digest
from piper_tts import PiperTTS

load_dotenv(".env.local")
load_dotenv(".env")

# Piper logs the phonemes it produces, which are IPA, and a Windows console
# defaults to a codepage that cannot encode them. The synthesis is unaffected but
# every utterance raises a logging error, which buries anything real. Harmless
# and unnecessary elsewhere, since Linux containers are already UTF-8.
if sys.platform == "win32":
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")

logger = logging.getLogger("portfolio-agent")

SITE_URL = os.getenv("SITE_URL", "https://wasif-ullah-portfolio.vercel.app")
DIGEST_URL = f"{SITE_URL}/llms.txt"

VOICE_DIR = Path(__file__).parent / "voices"
VOICE_NAME = os.getenv("PIPER_VOICE", "en_US-ryan-medium")

# The cap is enforced here rather than in the browser. A timer in the client is a
# suggestion; anyone can hold the socket open with the page closed. This is a
# public microphone wired to a metered API, so the limit lives where it cannot
# be edited by the person it applies to.
MAX_SESSION_SECONDS = int(os.getenv("MAX_SESSION_SECONDS", "180"))
WARN_AT_SECONDS = max(MAX_SESSION_SECONDS - 30, 30)

STT_MODEL = os.getenv("GROQ_STT_MODEL", "whisper-large-v3-turbo")

# The plugin defaults to llama-3.3-70b-versatile, which this account cannot see.
# Of what it can, the gpt-oss pair measured the same time-to-first-byte within
# noise, so the larger one wins on following the persona rules, which is what
# actually matters when someone asks about salary.
#
# These are reasoning models. Their thinking arrives in a separate "reasoning"
# field and is never spoken, but it does consume the completion budget, so the
# effort is pinned low and the reply is capped. Qwen was rejected outright: it
# puts its <think> block inside the content, and the agent would read it aloud.
LLM_MODEL = os.getenv("GROQ_LLM_MODEL", "openai/gpt-oss-120b")


def setup(proc: agents.JobProcess) -> None:
    """
    Load everything slow before a caller is waiting on it. This runs once per
    worker process, before any job is accepted. The Piper session costs about
    1.5 seconds cold and 143ms warm, and that gap is the whole first impression.
    """
    proc.userdata["vad"] = silero.VAD.load()
    tts = PiperTTS(model_path=VOICE_DIR / f"{VOICE_NAME}.onnx")
    tts.load_sync()
    proc.userdata["tts"] = tts


server = AgentServer(setup_fnc=setup)


@server.rtc_session(agent_name="portfolio-agent")
async def entrypoint(ctx: JobContext) -> None:
    digest = await load_digest(DIGEST_URL)

    session = AgentSession(
        stt=groq.STT(model=STT_MODEL, language="en"),
        llm=groq.LLM(
            model=LLM_MODEL,
            reasoning_effort="low",
            # Spoken answers, not written ones. Two or three sentences is the
            # brief, and a hard ceiling stops a rambling turn holding the floor.
            max_completion_tokens=200,
            temperature=0.4,
        ),
        tts=ctx.proc.userdata["tts"],
        vad=ctx.proc.userdata["vad"],
        # People interrupt a voice agent constantly, and one that talks over the
        # interruption reads as broken rather than busy.
        allow_interruptions=True,
    )

    agent = Agent(
        instructions=build_instructions(digest),
    )

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

    await session.generate_reply(
        instructions=(
            "Greet them in one short sentence. Say you are an AI assistant speaking for "
            "Wasif, and ask what they would like to know about his work."
        )
    )


async def _cancel(task: asyncio.Task) -> None:
    task.cancel()


if __name__ == "__main__":
    agents.cli.run_app(server)

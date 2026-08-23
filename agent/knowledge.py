

from __future__ import annotations

import logging

import httpx

logger = logging.getLogger("knowledge")

DROP_SECTIONS = {"Writing"}
MAX_BULLETS = {"Selected work": 6, "Key results": 5}
MAX_BULLET_CHARS = 300

FALLBACK = """Wasif Ullah is a Voice AI and Full-Stack AI Engineer in Lahore.
He builds real-time voice agents, computer vision pipelines and the production
backends around them, for clients in the UK, EU and US."""


def _trim_sentences(line: str, limit: int) -> str:
    """Cut at the last full stop that fits, so nothing ends mid-thought."""
    if len(line) <= limit:
        return line
    cut = line.rfind(". ", 0, limit)
    return line[: cut + 1] if cut > limit // 2 else line[:limit].rstrip() + "."


def compact(digest: str) -> str:
    out: list[str] = []
    section = ""
    bullets = 0

    for line in digest.splitlines():
        if line.startswith("## "):
            section = line[3:].strip()
            bullets = 0
            if section in DROP_SECTIONS:
                continue
            out.append(line)
            continue

        if section in DROP_SECTIONS:
            continue

        if line.startswith("- "):
            limit = MAX_BULLETS.get(section)
            if limit is not None and bullets >= limit:
                continue
            bullets += 1
            line = _trim_sentences(line, MAX_BULLET_CHARS)

        out.append(line)

    text = "\n".join(out)
    while "\n\n\n" in text:
        text = text.replace("\n\n\n", "\n\n")
    return text.strip()


def load_digest_sync(url: str, timeout: float = 10.0) -> str:
    try:
        response = httpx.get(url, timeout=timeout)
        response.raise_for_status()
        digest = compact(response.text)
        logger.info("loaded digest from %s (~%d tokens)", url, len(digest) // 4)
        return digest
    except Exception as exc:  # noqa: BLE001
        logger.warning("could not load %s (%s), using the fallback", url, exc)
        return FALLBACK


async def load_digest(url: str, timeout: float = 10.0) -> str:

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.get(url)
            response.raise_for_status()
            digest = compact(response.text)
            logger.info(
                "loaded digest from %s (%d chars, ~%d tokens)",
                url,
                len(digest),
                len(digest) // 4,
            )
            return digest
    except Exception as exc:  # noqa: BLE001 - startup must not depend on the site
        logger.warning("could not load %s (%s), using the fallback summary", url, exc)
        return FALLBACK


def build_instructions(digest: str) -> str:
    """Persona plus the site digest. No URL goes in: models read them aloud."""
    return f"""You are the voice agent on Wasif Ullah's portfolio. Someone has just
clicked to talk to you, and they are almost certainly a recruiter, a hiring
manager or an engineer sizing him up.

IDENTITY
Say once, in your first sentence, that you are an AI speaking for Wasif. After
that, stop mentioning it unless you are asked. Never claim to be him. If someone
asks whether you are a real person, tell them plainly that you are not.

HOW YOU TALK
Wasif writes in short declarative sentences and leads with the number. Talk the
same way. "He took it from one point eight seconds to under three hundred
milliseconds. The model was never the bottleneck." Not: "Certainly! Wasif has
extensive experience in optimising latency."

Rules that keep it sounding human:
- Answer the question and stop. Do not summarise what you just said.
- Never open with "Great question", "Certainly", "Absolutely" or "Sure".
- Do not restate their question back at them.
- Vary your length. A yes or no question gets a short answer. "Tell me about the
  vision work" gets three or four sentences.
- Say numbers as words a person would speak: "zero point eight three mAP",
  "under three hundred milliseconds".
- No lists, no markdown, no bullet points. This is speech.
- Never say a web address out loud. Say "the hiring form on this page" instead.
- Contractions are fine. You are talking, not writing a cover letter.

WHAT YOU KNOW
Everything after the line below comes from Wasif's own site. Answer from it and
nothing else. When something is not in there, say so in your own words and move
the conversation on. Vary how you say it, and do not use the same sentence twice
in one call. Never guess, never estimate, never fill a gap with something that
sounds plausible. Getting caught inventing a detail costs him the interview.

ABOUT YOURSELF
This section describes YOU, this demo. It is not part of Wasif's work history.
Only use it when someone asks about you specifically: what you run on, how you
were built, why you are on the page. Never mix it into an answer about his
production systems. Those are different systems and confusing the two makes him
look like he cannot tell them apart.

When asked: LiveKit and WebRTC for transport, Groq's whisper large v3 turbo for
recognition, an open-weights model for the answers, Piper synthesising speech on
the worker itself rather than through an API, and Silero deciding when a turn has
ended. Wasif built and deployed you. The latency panel beside this conversation
is measured each turn, not estimated. What you know is generated from the site
itself, so you cannot contradict the pages they are reading.

WHAT YOU DO NOT ANSWER
Salary, notice period, visa status, and anything personal. Those are his to
answer, not yours. Say so warmly, without sounding evasive, and offer the hiring
form or a call. It is one sentence, not an apology.

BOOKING
If they want to speak to Wasif directly, offer to book it. Use check_availability
to read his real calendar before you promise anything, and read back two or three
options rather than the whole list. Take their name and email, repeat the email
back to confirm it before you book, then call book_intro_call. Never invent a
slot, and never book without confirming the email out loud first.

---

{digest}
"""

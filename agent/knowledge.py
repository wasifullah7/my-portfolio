

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
    """First person, as Wasif, with the disclosure kept to the opening line."""
    return f"""ROLE
You are Wasif Ullah answering questions on his portfolio, in his own voice and
first person. Say "I built", "I cut the latency", never "Wasif built". You are
his AI, and you say so once at the start, but you are not a narrator describing
him from outside. The person listening is almost certainly a recruiter, a hiring
manager or an engineer, and this is effectively the first five minutes of an
interview.

PERSONALITY
Direct, warm, a little understated. Confident about numbers because they are
measured, never boastful. Wasif writes in short declarative sentences and leads
with the figure: "I took it from one point eight seconds to under three hundred
milliseconds. The model was never the bottleneck." Match that.

Honest about what was hard. When something was messy, say so. "The models were
the easy part. Working out which arrow connects which box when the shapes overlap
and OCR drops half the characters, that took the time." That candour is the point.

HOW YOU SPEAK
This is a conversation, not a written answer.
- Answer, then stop. Never summarise what you just said.
- Never open with "Great question", "Certainly", "Absolutely" or "Sure".
- Vary the length. A yes or no question gets a short answer. An open one gets
  three or four sentences.
- Contractions are natural. Use them.
- Speak numbers as a person would: "zero point eight three mAP", "under three
  hundred milliseconds".
- No lists, no markdown, no bullet points.
- Never say a web address out loud. Say "the hiring form on this page".

WHAT YOU KNOW
Everything after the line below is from my own site. Answer only from it. When
something is not there, say so plainly and offer to pass it on. Vary the wording
and never repeat the same phrase twice in one call. Never guess, never estimate,
never fill a gap with something that merely sounds right. One invented detail
costs the interview.

IDENTITY
If asked whether you are really me, or whether you are a human, say plainly that
you are an AI answering on my behalf. Do not pretend otherwise, ever. Outside
that one question, do not keep flagging it, and do not add disclaimers to answers.

WHAT I DO NOT ANSWER HERE
Salary, notice period, visa status, and anything personal. Say that I prefer to
handle those myself, and point them at the hiring form on this page or offer to
book a call. One sentence, warm, then move on.

BOOKING
If they want to talk to me directly, offer to set it up. Call check_availability
before promising any time, read back two or three options rather than the whole
list, take their name and email, repeat the email back to confirm it, then call
book_intro_call. Never invent a slot.

---

{digest}
"""

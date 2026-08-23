"""
What the agent knows, taken from the site itself.

The portfolio already publishes /llms.txt: a plain-text digest of the projects,
roles and results, regenerated from src/content on every deploy. Pointing the
agent at that file rather than a hand-written prompt means the two can never
disagree. Correct a metric on the site and the agent is corrected with it.

The digest is trimmed before use. The full file is around 2,300 tokens, and
Groq's free tier allows 12,000 tokens a minute across a request that resends the
system prompt and the whole history every turn. Untrimmed, that caps a
conversation at roughly four turns a minute, which is slower than people talk.
"""

from __future__ import annotations

import logging

import httpx

logger = logging.getLogger("knowledge")

# Article titles read as a list to a reader and as noise to a listener. Nobody
# asks a voice agent to recite ten headlines, so the section earns none of the
# budget it costs.
DROP_SECTIONS = {"Writing"}

# Long sections get their tail cut rather than being dropped whole, so the agent
# still knows the shape of the work without carrying every entry.
MAX_BULLETS = {"Selected work": 8, "Key results": 6}

FALLBACK = """Wasif Ullah is a Voice AI and Full-Stack AI Engineer in Lahore.
He builds real-time voice agents, computer vision pipelines and the production
backends around them, for clients in the UK, EU and US."""


def compact(digest: str) -> str:
    """Trim the published digest down to what is worth saying out loud."""
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

        out.append(line)

    # Collapse the runs of blank lines that dropping a section leaves behind.
    text = "\n".join(out)
    while "\n\n\n" in text:
        text = text.replace("\n\n\n", "\n\n")
    return text.strip()


async def load_digest(url: str, timeout: float = 10.0) -> str:
    """
    Fetch the site's digest. Falls back to a short hard-coded summary rather than
    failing to start: an agent that knows a little is better than a room nobody
    can join, and the fallback says nothing the site does not.
    """
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


def build_instructions(digest: str, booking_url: str, hire_url: str) -> str:
    """
    The persona. Two rules carry most of the weight: say what it is, and refuse
    to invent. A voice agent that guesses about someone's salary history or
    notice period does real damage, and it does it in his voice.
    """
    return f"""You are a voice assistant speaking on behalf of Wasif Ullah on his
portfolio website. You are talking to someone who is probably a recruiter or a
hiring manager.

WHO YOU ARE
Say in your first sentence that you are an AI assistant speaking for Wasif, not
Wasif himself. Never claim to be him. If asked directly whether you are a human,
say plainly that you are not.

HOW YOU SPEAK
This is speech, not writing. Short sentences. No lists, no markdown, no bullet
points, no emoji, no asterisks. Two or three sentences per turn is usually
right. Give the number first when there is a number, because that is what people
remember. Never read out a URL character by character.

WHAT YOU KNOW
Everything below comes from Wasif's own site. Answer only from it. If you are
asked something it does not cover, say you do not have that detail and offer to
pass the question on. Do not estimate, do not infer, and do not fill a gap with
something plausible.

WHAT YOU MUST NOT ANSWER
Salary expectations, notice period, visa status, and anything about his personal
life. For those, say that Wasif answers those himself and point the person at
the hiring form at {hire_url} or a call at {booking_url}. That is not evasion,
it is the honest answer, so say it warmly and move on.

WHEN SOMEONE WANTS TO TAKE IT FURTHER
Point them at the hiring form or offer to book a call. Do not ask for their
email address or any other personal detail. This conversation is not recorded
and you cannot follow anything up.

---

{digest}
"""

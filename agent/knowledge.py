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

# The published file carries the full approach for every project, because a
# crawler reading it has no budget to speak of. A voice turn does. Bullets are
# cut at the last sentence that fits, never mid-clause, so what survives is
# something the agent can actually say rather than a fragment it has to finish.
MAX_BULLET_CHARS = 420

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
            line = _trim_sentences(line, MAX_BULLET_CHARS)

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


def build_instructions(digest: str) -> str:
    """
    The persona. Two rules carry most of the weight: say what it is, and refuse
    to invent. A voice agent that guesses about someone's salary history or
    notice period does real damage, and it does it in his voice.

    No URL appears anywhere in here, deliberately. An earlier version passed the
    hiring and booking links in so the agent could offer them, and it read one
    out: "wasif hyphen ullah hyphen portfolio dot vercel dot app slash hire".
    A model told not to spell out a URL will still spell out the URL you give it.
    The only reliable fix is not to give it one. Both links are on the page the
    visitor is already looking at, so pointing at them is enough.
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
remember. Never say a web address out loud, ever. Refer to things by where they
are: "the hiring form on this page", "the booking link below".

WHAT YOU KNOW
Everything below comes from Wasif's own site. Answer only from it. If you are
asked something it does not cover, say you do not have that detail and offer to
pass the question on. Do not estimate, do not infer, and do not fill a gap with
something plausible.

WHAT YOU MUST NOT ANSWER
Salary expectations, notice period, visa status, and anything about his personal
life. For those, say that Wasif answers those himself and send them to the hiring
form on this page or to book a call. That is not evasion, it is the honest
answer, so say it warmly and move on.

WHEN SOMEONE WANTS TO TAKE IT FURTHER
Point them at the hiring form on this page, or at the booking link. Do not ask
for their email address or any other personal detail. This conversation is not
recorded and you cannot follow anything up.

---

{digest}
"""

from __future__ import annotations

import logging
import os
import re
from datetime import datetime, timedelta, timezone

import httpx
from livekit.agents import Agent, RunContext, function_tool

logger = logging.getLogger("booking")

API = "https://api.cal.com/v2"
SLOTS_VERSION = "2024-09-04"
BOOKINGS_VERSION = "2024-08-13"

CAL_API_KEY = os.getenv("CAL_API_KEY", "")
CAL_USERNAME = os.getenv("CAL_USERNAME", "wasif-ullah-dev")
CAL_EVENT_SLUG = os.getenv("CAL_EVENT_SLUG", "30min")
CAL_EVENT_TYPE_ID = os.getenv("CAL_EVENT_TYPE_ID", "")

EMAIL = re.compile(r"^[^@\s]+@[^@\s]+\.[a-z]{2,}$", re.I)

# A stranger on a public page is booking into a real calendar. One per call.
MAX_BOOKINGS_PER_SESSION = 1


class PortfolioAgent(Agent):
    def __init__(self, instructions: str) -> None:
        super().__init__(instructions=instructions)
        self._offered: list[str] = []
        self._booked = 0

    @function_tool()
    async def check_availability(
        self,
        context: RunContext,
        days_ahead: int = 7,
    ) -> str:
        """Read Wasif's real calendar and return open slots for an intro call.

        Call this before offering any time. Never invent availability.

        Args:
            days_ahead: How many days from now to search. Use 7 unless they ask for later.
        """
        if not CAL_API_KEY:
            return "no calendar access; offer the booking link on the page instead"

        start = datetime.now(timezone.utc)
        end = start + timedelta(days=max(1, min(days_ahead, 30)))

        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(
                    f"{API}/slots",
                    headers={
                        "Authorization": f"Bearer {CAL_API_KEY}",
                        "cal-api-version": SLOTS_VERSION,
                    },
                    params={
                        "username": CAL_USERNAME,
                        "eventTypeSlug": CAL_EVENT_SLUG,
                        "start": start.strftime("%Y-%m-%d"),
                        "end": end.strftime("%Y-%m-%d"),
                        "timeZone": "UTC",
                    },
                )
                response.raise_for_status()
                payload = response.json()
        except Exception as exc:  # noqa: BLE001
            logger.warning("slots lookup failed (%s)", exc)
            return "calendar is unreachable; offer the booking link on the page instead"

        slots = _flatten_slots(payload)
        if not slots:
            return "nothing open in that window; suggest looking further ahead"

        self._offered = slots[:12]
        spoken = ", ".join(_spoken(s) for s in self._offered[:3])
        return f"open slots (UTC): {spoken}. More if they want another day."

    @function_tool()
    async def book_intro_call(
        self,
        context: RunContext,
        name: str,
        email: str,
        slot_iso: str,
    ) -> str:
        """Book one of the slots returned by check_availability.

        Only call this after reading the email back to them and hearing them confirm it.

        Args:
            name: Their full name.
            email: Their work email, confirmed out loud.
            slot_iso: The exact slot string from check_availability.
        """
        if self._booked >= MAX_BOOKINGS_PER_SESSION:
            return "already booked once in this call; point them at the booking link"
        if not CAL_API_KEY:
            return "no calendar access; offer the booking link on the page instead"
        if not EMAIL.match(email.strip()):
            return "that email did not parse; ask them to say it again slowly"
        if self._offered and slot_iso not in self._offered:
            return "that slot was not one of the offered times; check availability again"

        body: dict[str, object] = {
            "start": slot_iso,
            "attendee": {
                "name": name.strip(),
                "email": email.strip(),
                "timeZone": "UTC",
                "language": "en",
            },
            "metadata": {"source": "portfolio voice agent"},
        }
        if CAL_EVENT_TYPE_ID:
            body["eventTypeId"] = int(CAL_EVENT_TYPE_ID)
        else:
            body["eventTypeSlug"] = CAL_EVENT_SLUG
            body["username"] = CAL_USERNAME

        try:
            async with httpx.AsyncClient(timeout=15) as client:
                response = await client.post(
                    f"{API}/bookings",
                    headers={
                        "Authorization": f"Bearer {CAL_API_KEY}",
                        "cal-api-version": BOOKINGS_VERSION,
                        "Content-Type": "application/json",
                    },
                    json=body,
                )
                if response.status_code >= 400:
                    logger.warning("booking rejected %s: %s", response.status_code, response.text[:300])
                    return "the calendar refused that booking; offer the booking link on the page"
        except Exception as exc:  # noqa: BLE001
            logger.warning("booking failed (%s)", exc)
            return "could not reach the calendar; offer the booking link on the page"

        self._booked += 1
        logger.info("booked %s for %s", slot_iso, email.strip())
        return f"booked for {_spoken(slot_iso)} UTC. Confirmation is on its way to their inbox."


def _flatten_slots(payload: object) -> list[str]:
    data = payload.get("data", payload) if isinstance(payload, dict) else payload
    found: list[str] = []

    def walk(node: object) -> None:
        if isinstance(node, str):
            if "T" in node:
                found.append(node)
        elif isinstance(node, dict):
            if "start" in node and isinstance(node["start"], str):
                found.append(node["start"])
            else:
                for value in node.values():
                    walk(value)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(data)
    return sorted(dict.fromkeys(found))


def _spoken(iso: str) -> str:
    try:
        when = datetime.fromisoformat(iso.replace("Z", "+00:00"))
    except ValueError:
        return iso
    return when.strftime("%A the %d at %H:%M").replace(" 0", " ")

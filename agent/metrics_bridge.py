"""
Forwards the framework's own latency metrics to the browser.

Nothing here measures anything. The agents framework already emits STTMetrics,
EOUMetrics, LLMMetrics and TTSMetrics for every turn, with the fields that
matter already named: ttft on the model, ttfb on synthesis, end_of_utterance_delay
on turn detection. This collects one turn's worth and publishes it on the room's
data channel, which is the transport LiveKit provides for exactly this.

The point is honesty. The site claims sub-300ms latency in production, on
dedicated infrastructure. This demo runs a free tier with a round trip to Groq in
the middle, so it will read higher. Showing the real number, broken down by
stage, is worth more to someone evaluating the work than a claim they cannot
check.
"""

from __future__ import annotations

import json
import logging

from livekit import rtc
from livekit.agents import MetricsCollectedEvent, metrics

logger = logging.getLogger("metrics-bridge")

TOPIC = "agent-metrics"


class TurnLatency:
    """
    Accumulates one turn, then publishes when synthesis starts.

    Speech synthesis beginning is the moment the caller actually hears something,
    so it is both the last measurement of the turn and the right trigger.
    """

    def __init__(self, room: rtc.Room) -> None:
        self._room = room
        self._turn: dict[str, float] = {}

    def handle(self, event: MetricsCollectedEvent) -> None:
        m = event.metrics

        # Also send it to the worker log, using the framework's own formatter.
        metrics.log_metrics(m)

        if isinstance(m, metrics.EOUMetrics):
            self._turn["transcription"] = m.transcription_delay
            self._turn["endOfTurn"] = m.end_of_utterance_delay
        elif isinstance(m, metrics.LLMMetrics):
            if not m.cancelled:
                self._turn["model"] = m.ttft
        elif isinstance(m, metrics.TTSMetrics):
            if not m.cancelled:
                self._turn["synthesis"] = m.ttfb
                self._publish()

    def _publish(self) -> None:
        turn = self._turn
        # These three are the caller's wait: silence recognised, answer decided,
        # first audio produced. Anything else double counts.
        turn["total"] = (
            turn.get("endOfTurn", 0.0) + turn.get("model", 0.0) + turn.get("synthesis", 0.0)
        )

        payload = json.dumps({k: round(v * 1000) for k, v in turn.items()})
        self._turn = {}

        try:
            # reliable, because a dropped measurement shows as a stale number
            # rather than a missing one, which is worse than a late one.
            self._room.local_participant.publish_data(
                payload, topic=TOPIC, reliable=True
            )
        except Exception as exc:  # noqa: BLE001 - telemetry must never break a call
            logger.debug("could not publish metrics (%s)", exc)

from __future__ import annotations

import json
import logging

from livekit import rtc
from livekit.agents import MetricsCollectedEvent, metrics

logger = logging.getLogger("metrics-bridge")

TOPIC = "agent-metrics"


class TurnLatency:
    """Forwards the framework's own per-turn metrics to the browser."""

    def __init__(self, room: rtc.Room) -> None:
        self._room = room
        self._turn: dict[str, float] = {}

    def handle(self, event: MetricsCollectedEvent) -> None:
        m = event.metrics
        metrics.log_metrics(m)

        if isinstance(m, metrics.EOUMetrics):
            self._turn["transcription"] = m.transcription_delay
            self._turn["endOfTurn"] = m.end_of_utterance_delay
        elif isinstance(m, metrics.LLMMetrics) and not m.cancelled:
            self._turn["model"] = m.ttft
        elif isinstance(m, metrics.TTSMetrics) and not m.cancelled:
            self._turn["synthesis"] = m.ttfb
            # First audio is the end of the caller's wait, so it is the trigger.
            self._publish()

    def _publish(self) -> None:
        turn = self._turn
        turn["total"] = (
            turn.get("endOfTurn", 0.0) + turn.get("model", 0.0) + turn.get("synthesis", 0.0)
        )
        payload = json.dumps({k: round(v * 1000) for k, v in turn.items()})
        self._turn = {}

        try:
            self._room.local_participant.publish_data(payload, topic=TOPIC, reliable=True)
        except Exception as exc:  # noqa: BLE001 - telemetry must not break a call
            logger.debug("could not publish metrics (%s)", exc)

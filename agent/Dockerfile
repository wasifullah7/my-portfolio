# The image LiveKit Cloud builds and runs. `lk agent create` picks this up.
FROM python:3.12-slim

# onnxruntime, which Piper runs on, links against libgomp. It is not in slim.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libgomp1 \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Dependencies first, so editing the agent does not reinstall the world.
COPY pyproject.toml uv.lock ./
RUN pip install uv && uv export --frozen --no-dev --format requirements-txt > requirements.txt \
    && pip install -r requirements.txt

COPY agent.py knowledge.py piper_tts.py ./

# The voice is 63MB and is fetched at build time rather than committed. Keeping
# it out of git keeps the portfolio repo clonable in seconds; baking it into the
# image keeps the container from reaching the network to say its first word.
ARG PIPER_VOICE=en_US-ryan-medium
ENV PIPER_VOICE=${PIPER_VOICE}
RUN python -m piper.download_voices ${PIPER_VOICE} --download-dir voices

# Silero ships weights that are otherwise downloaded on first use, so a cold
# worker would also be a slow one. Invoked through the module rather than the
# app script, which has been deprecated since 1.5.10.
RUN python -m livekit.agents download-files

CMD ["python", "agent.py", "start"]

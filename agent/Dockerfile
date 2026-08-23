FROM python:3.12-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends libgomp1 \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN pip install uv && uv export --frozen --no-dev --format requirements-txt > requirements.txt \
    && pip install -r requirements.txt

COPY *.py ./

ARG PIPER_VOICE=en_US-ryan-medium
ENV PIPER_VOICE=${PIPER_VOICE}
RUN python -m piper.download_voices ${PIPER_VOICE} --download-dir voices
RUN python -m livekit.agents download-files

CMD ["python", "agent.py", "start"]

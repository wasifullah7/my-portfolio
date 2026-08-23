# Portfolio voice agent

The agent behind [/talk](https://wasif-ullah-portfolio.vercel.app/talk). Someone
asks it about my work out loud and it answers from what this site publishes.

## The stack, and why

| | | |
|---|---|---|
| Speech recognition | Groq `whisper-large-v3-turbo` | Free tier covers 8 hours of audio a day |
| Language model | Groq, open weights | Free tier covers 14,400 requests a day |
| Speech synthesis | Piper, on the worker | Unmetered |
| Turn taking | Silero VAD | Unmetered |

Synthesis is the one piece that cannot come from an API on a free plan. Groq
allows 100 synthesis requests a day and **every spoken reply is one request**, so
a single fifteen-turn conversation eats a sixth of the daily budget. Piper is MIT
licensed, runs on CPU, and measured here at **143ms to first audio and 23x
realtime** once the model is warm. Through LiveKit's own interface, with the
emitter's framing, first audio lands at **220-260ms**.

## What it knows

`knowledge.py` fetches `SITE_URL/llms.txt` at startup. That file is generated
from `src/content` on every deploy, so the agent and the site cannot drift apart:
correct a number on the site and the agent is corrected with it.

The digest is trimmed before use. The published file is about 2,300 tokens and
Groq's free tier allows 12,000 tokens a minute on a request that resends the
system prompt every turn. Untrimmed, that caps a conversation at roughly four
turns a minute, which is slower than people talk. Trimmed, the whole prompt is
about 1,700 tokens.

## Guards

The session cap lives here, in `agent.py`, not in the browser. A timer in the
client is a suggestion; anyone can hold the socket open with the page closed.
Per-IP rate limiting and the daily minute budget live in the site's
`/api/livekit-token` route, which is the front door to metered infrastructure.

## Running it

You need two accounts, both free:

- **LiveKit Cloud** — <https://cloud.livekit.io>. Project, then Settings → Keys.
  The free Build plan includes agent hosting, 1,000 agent minutes a month and
  5 concurrent sessions.
- **Groq** — <https://console.groq.com>. One API key.

```sh
cp .env.example .env.local          # fill in the four keys
uv sync
uv run python -m piper.download_voices en_US-ryan-medium --download-dir voices
uv run python agent.py console      # talk to it in the terminal, no browser
uv run python agent.py dev          # connect it to a LiveKit room
```

`console` is the fastest way to check the pipeline: it uses your microphone and
speakers directly and needs no LiveKit room.

The site needs the same LiveKit credentials, plus nothing else:

```sh
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
VOICE_DAILY_MINUTES=120
```

## Deploying

```sh
lk agent create        # first time, from this directory
lk agent deploy        # subsequently
```

LiveKit Cloud builds the `Dockerfile` and runs it. The voice is downloaded at
build time rather than committed, because 63MB of ONNX has no business in a
website repository.

## Swapping pieces

Every component is a constructor argument, so replacing one is a line.

- **A different voice.** `PIPER_VOICE`, plus the matching `download_voices` call.
  `python -m piper.download_voices --help` lists them.
- **Better recognition.** NVIDIA Parakeet TDT scores 6.05% WER against
  Whisper-large-v3's 7.44%, is CC-BY-4.0, and runs on CPU through ONNX in about
  2GB of RAM. It removes the last metered component. The cost is a much larger
  image and a slower cold start, which is why it is not the default.
- **A cloned voice.** Piper ships stock voices and does not clone from samples.
  Sounding like me specifically means a paid service, and means this stops being
  free.

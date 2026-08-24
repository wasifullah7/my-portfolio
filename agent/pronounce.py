from __future__ import annotations

import re

TERMS = {
    "FastAPI": "Fast A P I",
    "PostgreSQL": "Postgres Q L",
    "PaddleOCR": "Paddle O C R",
    "PyMuPDF": "Py Mu P D F",
    "PyQuil": "Py Quil",
    "ChromaDB": "Chroma D B",
    "MongoDB": "Mongo D B",
    "LangChain": "Lang Chain",
    "LiveKit": "Live Kit",
    "SageMaker": "Sage Maker",
    "WebSockets": "Web Sockets",
    "WebSocket": "Web Socket",
    "DeBERTa": "Dee Berta",
    "RF-DETR": "R F Detter",
    "SAM2": "Sam two",
    "BM25": "B M twenty five",
    "EC2": "E C two",
    "S3": "S three",
    "HRMS": "H R M S",
    "JWT": "J W T",
    "PPTX": "P P T X",
    "LTI": "L T I",
    "QAOA": "Q A O A",
    "mAP": "m A P",
}

UNITS = {
    "ms": "milliseconds",
    "s": "seconds",
    "fps": "frames per second",
    "GB": "gigabytes",
    "MB": "megabytes",
}

_TERMS = re.compile(r"(?<![A-Za-z0-9])(" + "|".join(re.escape(t) for t in sorted(TERMS, key=len, reverse=True)) + r")(?![A-Za-z0-9])")
_UNIT = re.compile(r"\b(\d+(?:\.\d+)?)\s?(" + "|".join(UNITS) + r")\b")
_PERCENT = re.compile(r"(\d)\s?%")
_URL = re.compile(r"\bhttps?://\S+|\bwww\.\S+")


PUNCTUATION = str.maketrans(
    {
        "‘": "'",
        "’": "'",
        "“": '"',
        "”": '"',
        "‑": "-",
        "–": "-",
        "—": ", ",
        "…": "...",
    }
)


def for_speech(text: str) -> str:
    text = text.translate(PUNCTUATION)
    text = _URL.sub("the link on this page", text)
    text = _TERMS.sub(lambda m: TERMS[m.group(1)], text)
    text = _UNIT.sub(lambda m: f"{m.group(1)} {UNITS[m.group(2)]}", text)
    text = _PERCENT.sub(r"\1 percent", text)
    return text

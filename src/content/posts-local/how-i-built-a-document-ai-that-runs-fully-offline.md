---
title: "How I Built a Document AI That Runs Fully Offline in 287 MB"
metaTitle: "How I Built a Fully Offline Document AI"
slug: "how-i-built-a-document-ai-that-runs-fully-offline"
date: "2026-08-16"
excerpt: "A document pipeline that classifies PDFs, extracts fields, and runs semantic search without a single cloud API call. Five problems broke it along the way, and none of them were the model."
tags: ["offline-rag", "document-ai", "fastapi", "chromadb", "python"]
---

Some documents are not allowed to leave the building.

Legal files, medical records, payroll, anything with a national ID number in it. If you work with those, the standard answer to "let's use AI for this" is no. Not because the tech does not work, but because sending the document to an API is the part nobody will sign off on.

So I built a document pipeline that never makes a network call. It ingests PDFs, works out what each one is, pulls out the fields that matter, and lets you search across everything by meaning instead of keywords. All of it on CPU, in about 287 MB of models.

The code is on [GitHub](https://github.com/wasifullah7/document-intelligence-pipeline).

The interesting part was not the models. The models were the easy bit. Five other things broke, and I want to walk through those, because they are the parts nobody writes about.

## What the pipeline actually does

<svg viewBox="0 0 720 300" role="img" aria-label="Pipeline diagram: PDF and TXT files flow through ingestor, classifier and extractor to structured JSON, with a retriever branch feeding semantic search" style="width:100%;height:auto;font-family:var(--font-jetbrains),monospace">
  <g fill="none" stroke="currentColor" stroke-width="1" opacity="0.5">
    <rect x="8" y="16" width="120" height="44"/>
    <rect x="192" y="16" width="130" height="44"/>
    <rect x="386" y="16" width="130" height="44"/>
    <rect x="580" y="16" width="130" height="44"/>
    <rect x="192" y="150" width="130" height="44"/>
    <rect x="386" y="150" width="130" height="44"/>
    <rect x="580" y="150" width="130" height="44"/>
  </g>
  <g fill="currentColor" font-size="12">
    <text x="24" y="36">PDF / TXT</text>
    <text x="24" y="52" opacity="0.6">documents/</text>
    <text x="208" y="36">ingestor.py</text>
    <text x="208" y="52" opacity="0.6">PyMuPDF + OCR</text>
    <text x="402" y="36">classifier.py</text>
    <text x="402" y="52" opacity="0.6">rules, then NLI</text>
    <text x="596" y="36">extractor.py</text>
    <text x="596" y="52" opacity="0.6">regex + spaCy</text>
    <text x="208" y="170">retriever.py</text>
    <text x="208" y="186" opacity="0.6">bge-small-en</text>
    <text x="402" y="170">ChromaDB</text>
    <text x="402" y="186" opacity="0.6">cosine index</text>
    <text x="596" y="170">api.py</text>
    <text x="596" y="186" opacity="0.6">FastAPI</text>
  </g>
  <g stroke="currentColor" stroke-width="1.2" fill="none">
    <path d="M128 38 L186 38 M178 33 L186 38 L178 43"/>
    <path d="M322 38 L380 38 M372 33 L380 38 L372 43"/>
    <path d="M516 38 L574 38 M508 33 L516 38 L508 43" transform="translate(8,0)"/>
    <path d="M645 60 L645 100 L257 100 L257 146 M252 138 L257 146 L262 138"/>
    <path d="M322 172 L380 172 M372 167 L380 172 L372 177"/>
    <path d="M516 172 L574 172 M566 167 L574 172 L566 177"/>
  </g>
  <g fill="currentColor" font-size="11" opacity="0.75">
    <text x="270" y="94">structured fields</text>
    <text x="8" y="238">output.json</text>
    <text x="8" y="256" opacity="0.7">every field, every document, no network calls</text>
  </g>
  <line x1="8" y1="212" x2="710" y2="212" stroke="currentColor" stroke-width="1" opacity="0.35"/>
</svg>

Four stages. PyMuPDF pulls the text out. A classifier decides if it is an invoice, a resume, or a utility bill. An extractor pulls the fields for that type. Then everything gets embedded and indexed so you can search it.

Nothing in that list needs the internet. That was the whole point.

## Problem 1: half my PDFs returned nothing

The first version worked beautifully on the test files. Then I pointed it at real documents and got empty strings back.

The reason is obvious once you hit it. A PDF is not one format. Some PDFs contain actual text you can select. Others are just a photograph of a page wrapped in a PDF container. Scanned invoices are almost always the second kind, and `page.get_text()` returns nothing at all for those.

So the ingestor needed a fallback chain:

```python
text = page.get_text()
if not text.strip():
    # Tesseract fallback first, then easyocr
    try:
        text = page.get_textpage_ocr(language="eng").extractText()
    except Exception:
        text = ""
    if not text.strip():
        text = _ocr_page_image(page)
```

Try the fast path. If nothing comes back, try PyMuPDF's built-in OCR. If that fails too, render the page to an image at 200 DPI and run easyocr over it.

Three attempts per page sounds wasteful. It is not, because the first one succeeds most of the time and costs almost nothing. You only pay for OCR on the pages that actually need it.

The lesson I took from this: **do not trust a single extraction method on documents you did not create.**

## Problem 2: the classifier was confidently wrong

I started with zero-shot classification, using a small NLI model. You give it your labels, it tells you which one fits. No training data needed. It felt like magic.

Then it started calling resumes "invoices" with high confidence.

Zero-shot models are good at general meaning, but they do not know your domain. A resume that mentions a salary figure and a date looks a lot like a bill if you squint. And the model does not squint, it just returns a number.

So I put a rules layer in front of it:

```python
KEYWORD_RULES = {
    "Invoice": [
        r"invoice\s*(?:#|number|no\.?|:)",
        r"bill\s+to",
        r"amount\s+due",
        r"\binv[-\s]?\d+",
        ...
    ],
}
```

If a document matches **two or more** patterns for a class, I take that answer and skip the model entirely. Real invoices say "bill to" and "amount due". Real resumes say "work experience". These phrases are not ambiguous, and matching them costs microseconds.

The model only runs when the rules are not confident. And even then, results below a 0.45 confidence threshold get labelled "Other" rather than guessed at.

This is the part that surprised me. **Adding a dumb layer in front of a smart one made the whole system smarter.** Regex is not glamorous, but on documents with fixed vocabulary it beats a neural model, and it never hallucinates.

## Problem 3: the date extractor picked the wrong date

Invoices have several dates on them. Issue date, due date, service period, sometimes a printed footer date. I wanted the issue date.

My first attempt used a fuzzy date parser on the whole document. That was a mistake. Fuzzy parsers are designed to find a date in a short string, and when you hand them a full page of text they will find something. Usually the wrong thing. An account number with the right number of digits is enough to fool one.

The fix was to stop being clever:

```python
_DATE_SCAN_PATTERNS = [
    r"\b(?:Jan(?:uary)?|Feb(?:ruary)?|...)\.?\s+\d{1,2},?\s+\d{4}\b",   # January 15, 2024
    r"\b\d{1,2}\s+(?:Jan(?:uary)?|...)\.?\s+\d{4}\b",                    # 15 January 2024
    r"\b\d{4}[-/]\d{2}[-/]\d{2}\b",                                      # 2024-01-15
    r"\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b",                                # 01/15/2024
]
```

Explicit patterns only, scanned in order. Fuzzy parsing is still used, but only on a short snippet next to a label like "Invoice Date:", never on the whole page.

The comment I left in that file still sums it up: *never fuzzy-parses the whole text.*

## Problem 4: semantic search returned nonsense until I added one string

This one cost me the most time, and the fix is a single line.

I embedded every document with `bge-small-en-v1.5`, embedded the query the same way, and compared them with cosine similarity. Standard setup. The results were bad. Not broken, just consistently unhelpful, which is much harder to debug than a crash.

BGE models are trained asymmetrically. Documents get embedded as they are, but queries are supposed to be prefixed:

```python
BGE_QUERY_PREFIX = "Represent this sentence for searching relevant passages: "
```

That is not a suggestion. The model was trained with that instruction attached to queries, so leaving it off puts your query in a slightly different place in vector space than the documents you are comparing it to. Everything still runs. The numbers still look like similarity scores. They are just worse than they should be.

Two other details in the same file that matter:

```python
embeddings = model.encode(texts, normalize_embeddings=True, ...)
collection = client.get_or_create_collection(
    name=COLLECTION_NAME,
    metadata={"hnsw:space": "cosine"},
)
```

Normalise the embeddings, and tell ChromaDB you want cosine distance. The default is L2, and if your vectors are normalised but your index is measuring L2, you get another quiet degradation instead of an error.

**Retrieval bugs do not crash. They just make your system slightly stupid.** That is what makes them dangerous.

## Problem 5: it was not actually offline

I tested with the network on, because of course I did. Everything worked. Then I pulled the network to prove the point, and the whole thing hung on startup.

HuggingFace libraries check for model updates when they load. Even with a fully populated local cache, they try to phone home first. There are environment variables to stop that:

```python
os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")
```

But here is the catch that cost me an afternoon: **these must be set before any HuggingFace import.** Not before you load the model. Before the `import` statement. The libraries read those variables at import time, so if your imports sit at the top of the file, as every Python file's imports do, setting the variables in `main()` is already too late.

That is why the first lines of `main.py` in this project are environment variables, with a comment explaining why, before a single import.

The other half of this is model caching. Models download on first run and cache locally, so "offline" really means "offline after one setup run on a connected machine." Worth being honest about when you tell someone the system needs no internet.

## What it costs

| Component | Model | Size |
|---|---|---|
| Classification | deberta-v3-xsmall zero-shot | ~142 MB |
| Embeddings | bge-small-en-v1.5 | ~133 MB |
| NER | spaCy en_core_web_sm | ~12 MB |
| **Total** | | **~287 MB, CPU only** |

No GPU. No API keys. No per-document cost. It runs on a laptop, and it runs the same way inside a network that has no route to the internet at all.

Models get loaded once and cached with `lru_cache(maxsize=1)`, so the API does not reload 287 MB of weights on every request. That sounds obvious written down. It is also the kind of thing you only notice when your first request takes eight seconds and every one after it takes forty milliseconds.

## What I would tell someone starting this

The models are not the hard part. Pretrained models are good now, and swapping one for another is a config change.

The hard part is everything around them. Documents that are images pretending to be text. Classifiers that are confidently wrong. Parsers that find an answer whether or not one exists. Libraries that reach for the network when you promised they would not.

None of that appears in a tutorial, because tutorials use clean inputs.

If you are building something similar, my honest advice is to put boring, deterministic logic in front of every model you use. Rules before classification. Explicit patterns before fuzzy parsing. Then let the model handle only the cases your rules cannot.

It is less exciting to write about. It is also the reason the thing works.

The full source is on [GitHub](https://github.com/wasifullah7/document-intelligence-pipeline) if you want to read it or take pieces of it.

# Publishing workflow

Two kinds of post live on this site, and the only real difference is **which
domain Google gives credit to**.

## New posts: write here first

```bash
npm run new:post "How I cut cold starts by 60%"
```

This creates `src/content/posts-local/<slug>.md` with the frontmatter filled in.
Write the article in markdown, commit, push. It appears at `/blog/<slug>` on the
next deploy.

These posts are **self-canonical**: the canonical tag points at this site, so
this domain earns the ranking.

### Syndicating to Medium afterwards

Once it is live here, put it on Medium with **Import Story**, not the editor:

1. Medium, then your avatar, then **Stories**
2. **Import a story**
3. Paste the URL from this site
4. Publish

Medium then writes a canonical tag pointing back here, so both copies exist and
this site keeps the credit.

> Pasting the text into Medium's editor by hand **strips the canonical**. Medium
> then looks like the original, and because it has far more domain authority
> than a personal site, it will outrank you for your own writing. Always import.

### Frontmatter

```yaml
---
title: "How I cut cold starts by 60%"
slug: "how-i-cut-cold-starts-by-60"
date: "2026-08-16"
excerpt: "Lead with the answer. This is what search results and AI summaries pull from."
tags: ["fastapi", "performance", "aws-lambda"]
---
```

`canonicalUrl` is optional and normally omitted. Only set it if the piece was
genuinely published somewhere else first.

### Writing for search and AI extraction

- Put the answer in the **first 40 to 80 words**. That is the passage search
  snippets and AI summaries lift.
- Name things exactly: "Next.js App Router", not "the framework". Entity-rich
  writing is what gets cited.
- Include the numbers. A measurement a reader can verify is what makes a post
  worth linking to.
- Use real `##` headings in order. They become the document outline.

## Older posts: imported from Medium

```bash
npm run import:medium
```

Pulls full article HTML from the Medium RSS feed into
`src/content/posts/*.json`. These keep `canonicalUrl` pointing at Medium,
because Medium genuinely published them first.

Two limits worth knowing:

- The feed only exposes the **ten most recent** posts. Anything older has to be
  added by hand.
- Re-running the import overwrites the JSON files, so do not hand-edit them.

## Precedence

A post in `posts-local/` **overrides** an imported post with the same slug. So if
you later want an old Medium article to count for this site, republish it here
with the same slug and delete the Medium original (or re-import it there via
Import Story). No code change needed.

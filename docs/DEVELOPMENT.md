# Running this site

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion, Lenis.
No 3D library: the hero backdrop is CSS, which replaced a three.js scene and
removed the whole 3D stack from the bundle.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment

Copy `.env.example` to `.env.local`. Everything works without these; the contact
form simply reports that it is not connected and points at the email address
rather than silently dropping messages.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Enables contact-form delivery |
| `CONTACT_TO` | Destination inbox (defaults to the address in `src/content/site.ts`) |
| `CONTACT_FROM` | Verified Resend sender |

## Where the content lives

All copy sits in `src/content/`. Edit these rather than the components:

- `site.ts` — identity, links, stats, hire page, education
- `experience.ts` — roles
- `projects.ts` — case studies and earlier work
- `skills.ts` — grouped stack
- `posts/` — articles imported from Medium (JSON, generated)
- `posts-local/` — articles written here first (Markdown)

A project renders its **Source** and **Live demo** buttons only when `repoUrl`
and `demoUrl` are set, so a missing link can never become a dead button. A
project gets a `/work/[slug]` page only when it has a `problem` written, so
half-finished entries never generate a thin page.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run new:post "Title"` | Scaffold an article written here first |
| `npm run import:medium` | Pull articles from the Medium RSS feed |
| `npm run refresh:card` | Regenerate the GitHub profile card from the API |

Publishing workflow for articles: [WRITING.md](WRITING.md)

## Assets

- `public/resume.pdf` — the CV served by the download buttons
- `public/projects/*.webp` — project screenshots. Filenames are declared in
  `projects.ts`; until a file exists, each card renders a drafting-hatch plate,
  so a missing screenshot never looks broken
- `public/wasif-ullah.webp` — portrait, background removed by
  `scripts/remove-background.mjs`
- `src/content/github-card.svg` — the profile card, inlined on the homepage. Its
  colours are CSS custom properties, so it follows the site's light and dark
  themes

## Notes worth knowing

- The hero headline animates the **variable weight axis** of Archivo toward the
  cursor. It is disabled for coarse pointers and reduced motion.
- The hero backdrop is a grid revealed only under the cursor, using a CSS mask
  driven by a custom property. Nothing is painted at rest.
- Project titles carry a shared `ViewTransition` name, so a title morphs into
  the case-study headline on navigation.
- Imported Medium articles have their images pulled local at import time,
  because Medium's CDN is blocked by common ad blockers.

# Wasif Ullah, Portfolio

Personal portfolio for **Wasif Ullah**, Full-Stack AI Engineer (computer vision, LLM engineering, cloud infrastructure).

Live: https://v0-professional-portfolio-website-one-kappa.vercel.app

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS custom-property theming |
| Type | Archivo (display) + JetBrains Mono (data) |
| 3D | three.js via `@react-three/fiber` |
| Motion | `motion` (Framer Motion) + Lenis smooth scroll |
| Email | Resend, behind a validated API route |

## Design notes

The visual system follows the **International Typographic Style**: pure white, pure
black, two neutral greys, and one signal red used only on numerals, active state and
callouts. Hairline rules replace card borders, headings sit under a heavy black bar,
and every measurement is set in tabular figures.

It deliberately avoids two separate defaults. Blue-to-violet gradients with Inter and
rounded icon cards are the generic machine output. Warm cream with a terracotta accent
is Anthropic's brand palette. This is neither, and the project ships **no icon library
at all**: the theme control is a text toggle.

Motion is built from four primitives rather than one fade-up helper:

| Primitive | Used for |
| --- | --- |
| `CharReveal` | Per-character hero mask reveal, no opacity change |
| `ClipReveal` | `clip-path` wipes for project media |
| `Counter` | Metrics that count up on entry, tabular so digits do not jitter |
| `Parallax` | Scroll-scrubbed depth |

Everything is gated on `prefers-reduced-motion`.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment

Copy `.env.example` to `.env.local`. Everything works without these: the contact
form reports that it is not connected and points to the email address rather than
silently dropping messages.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Enables contact-form delivery |
| `CONTACT_TO` | Destination inbox (defaults to the address in `src/content/site.ts`) |
| `CONTACT_FROM` | Verified Resend sender |

## Content

All copy lives in `src/content/`, sourced from the CV (`WASIF_ULLAH.pdf`):

- `site.ts` identity, links, stats, education
- `experience.ts` roles
- `projects.ts` featured work and earlier work
- `skills.ts` grouped stack

A project renders its **Source** and **Live demo** buttons only when `repoUrl` or
`demoUrl` are set, so a missing link can never become a dead button.

## Assets

- `public/resume.pdf` is the real CV.
- `public/projects/*.webp` screenshots named in `projects.ts`. Until a file exists,
  each entry renders a drafting-hatch plate, so nothing looks broken.

## Performance notes

- The WebGL hero is `dynamic(..., { ssr: false })` and gated behind viewport,
  `prefers-reduced-motion`, and WebGL-capability checks, so phones never download three.js.
- The node-graph scene reuses preallocated buffers; nothing allocates per frame.

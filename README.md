# Wasif Ullah, Portfolio

Personal portfolio for **Wasif Ullah**, Full-Stack AI Engineer (computer vision, LLM engineering, cloud infrastructure).

Live: https://v0-professional-portfolio-website-one-kappa.vercel.app

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS custom-property theming |
| Type | Bricolage Grotesque (display) + JetBrains Mono (data) |
| 3D | three.js via `@react-three/fiber` |
| Motion | `motion` (Framer Motion) + Lenis smooth scroll |
| Email | Resend, behind a validated API route |

## Design notes

The visual system is deliberately **not** the default: no blue-to-violet gradient,
no Inter, no rounded feature cards with line icons, no icon library at all. It uses
warm ink on warm paper with a single oxide signal colour, hairline rules instead of
card borders, tabular figures for every measurement, and an SVG paper grain.

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

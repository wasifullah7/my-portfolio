# Wasif Ullah — Portfolio

Personal portfolio for **Wasif Ullah**, Full-Stack AI Engineer (computer vision, LLM engineering, cloud infrastructure).

Live: https://v0-professional-portfolio-website-one-kappa.vercel.app

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS custom-property theming |
| 3D | three.js via `@react-three/fiber` |
| Motion | `motion` (Framer Motion) + Lenis smooth scroll |
| Email | Resend, behind a validated API route |

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment

Copy `.env.example` to `.env.local`. Everything works without these — the
contact form simply reports that it isn't connected and points to the email
address instead of silently dropping messages.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Enables contact-form delivery |
| `CONTACT_TO` | Destination inbox (defaults to the address in `src/content/site.ts`) |
| `CONTACT_FROM` | Verified Resend sender |

## Content

All copy lives in `src/content/` — edit these rather than the components:

- `site.ts` — identity, links, stats, education
- `experience.ts` — roles
- `projects.ts` — featured work and earlier work
- `skills.ts` — grouped stack

A project renders its **Source** and **Live demo** buttons only when
`repoUrl` / `demoUrl` are set, so a missing link can never become a dead button.

## Assets to drop in

- `public/resume.pdf` — a generated résumé is committed; replace with a designed one anytime.
- `public/projects/*.webp` — screenshots named in `projects.ts`. Until a file exists,
  each card renders a designed fallback panel, so nothing looks broken.

## Performance notes

- The WebGL hero is `dynamic(..., { ssr: false })` and gated behind a viewport,
  `prefers-reduced-motion`, and WebGL-capability check — phones and reduced-motion
  visitors never download three.js.
- The node-graph scene reuses preallocated buffers; nothing allocates per frame.

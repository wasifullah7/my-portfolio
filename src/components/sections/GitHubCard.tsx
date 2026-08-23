import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The profile card: portrait beside a live readout.
 *
 * The readout is the same artefact that renders on the GitHub profile,
 * regenerated in this site's palette. Every colour in it is a CSS custom
 * property, so it follows the light and dark themes here rather than carrying
 * its own, which is also why it is inlined: a file in <img> cannot read the
 * page's variables.
 *
 * The GitHub version pairs the readout with an ASCII portrait, which is the
 * convention there. Here it sits next to the actual photograph instead, since
 * an ASCII likeness at 52 columns cannot survive the comparison.
 *
 * Refresh with `npm run refresh:card`.
 */
export function GitHubCard() {
  let svg = "";
  try {
    svg = readFileSync(
      join(process.cwd(), "src", "content", "github-card.svg"),
      "utf8",
    );
  } catch {
    return null;
  }

  return (
    <section className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-20 sm:px-10">
      <Reveal y={0}>
        <div className="rule-heavy pt-4">
          <div className="index-rule">
            <span className="tabular text-xs text-accent">/</span>
            <span className="label order-3">Profile</span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        {/* A panel rather than bare page, so the readout reads as one object.
            Both surfaces are theme tokens: near-white in light, near-black in dark. */}
        <div className="profile-panel mt-12 grid gap-10 rounded-xl border border-rule bg-paper-2 p-8 sm:p-10 lg:grid-cols-[240px_1fr] lg:gap-14">
          {site.portrait ? (
            <figure className="max-w-[240px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.portrait.src}
                alt={site.portrait.alt}
                width={site.portrait.width}
                height={site.portrait.height}
                loading="lazy"
                className="w-full select-none"
              />
              <figcaption className="label mt-2">{site.name}</figcaption>
            </figure>
          ) : null}

          <div className="github-card overflow-x-auto">
            <div
              className="min-w-[560px]"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>

        <a
          href={site.links.github}
          target="_blank"
          rel="noreferrer"
          className="link-underline mono mt-10 inline-block text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
        >
          Full activity on GitHub
        </a>
      </Reveal>
    </section>
  );
}

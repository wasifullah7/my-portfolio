import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The GitHub profile card, inlined.
 *
 * It is the same artefact that renders on the GitHub profile, regenerated in
 * this site's palette: every colour in it is a CSS custom property, so it
 * follows the light and dark themes here instead of carrying its own.
 *
 * Inlined rather than served as an image for two reasons. A file in <img>
 * cannot read the page's CSS variables, and inlining costs no extra request.
 *
 * Refresh with `npm run refresh:card` after the numbers move.
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
        <div className="github-card mt-10 overflow-x-auto">
          <div
            className="min-w-[860px]"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>

        <a
          href={site.links.github}
          target="_blank"
          rel="noreferrer"
          className="link-underline mono mt-8 inline-block text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
        >
          Full activity on GitHub
        </a>
      </Reveal>
    </section>
  );
}

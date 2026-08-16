import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

type Props = {
  index: string;
  eyebrow: string;
  title: string;
  lead?: string;
};

/**
 * Swiss section head: a heavy black bar, then the index, a hairline, and the
 * label. The index column stays pinned while the section scrolls, so you can
 * always see which part of the document you are in.
 */
export function SectionHeading({ index, eyebrow, title, lead }: Props) {
  return (
    <div>
      <Reveal y={0}>
        <div className="rule-heavy pt-4">
          <div className="index-rule">
            <span className="tabular sticky top-20 text-xs text-accent">{index}</span>
            <span className="label order-3">{eyebrow}</span>
          </div>
        </div>
      </Reveal>

      <h2 className="display mt-8 text-[clamp(2.1rem,6vw,4.5rem)]">
        <LineReveal text={title} />
      </h2>

      {lead ? (
        <Reveal delay={0.12}>
          <p className="measure mt-6 text-base leading-relaxed text-muted">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

import { Reveal } from "@/components/motion/Reveal";

type Props = {
  index: string;
  eyebrow: string;
  title: string;
  lead?: string;
};

/**
 * Swiss section head: a heavy black bar, then the index, a hairline, and the
 * label. Reads like a document index rather than a decorated heading.
 */
export function SectionHeading({ index, eyebrow, title, lead }: Props) {
  return (
    <Reveal>
      <div>
        <div className="rule-heavy pt-4">
          <div className="index-rule">
            <span className="tabular text-xs text-accent">{index}</span>
            <span className="label order-3">{eyebrow}</span>
          </div>
        </div>

        <h2 className="display mt-8 text-[clamp(2.1rem,6vw,4.5rem)]">{title}</h2>

        {lead ? (
          <p className="measure mt-6 text-base leading-relaxed text-muted">{lead}</p>
        ) : null}
      </div>
    </Reveal>
  );
}

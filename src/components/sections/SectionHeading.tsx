import { Reveal } from "@/components/motion/Reveal";

type Props = {
  index: string;
  eyebrow: string;
  title: string;
  lead?: string;
};

/** Reads like a document index: 01 ///// ABOUT */
export function SectionHeading({ index, eyebrow, title, lead }: Props) {
  return (
    <Reveal>
      <div>
        <div className="index-rule">
          <span className="tabular text-xs text-accent">{index}</span>
          <span className="label order-3">{eyebrow}</span>
        </div>

        <h2 className="display mt-8 text-[clamp(2rem,5.5vw,4rem)]">{title}</h2>

        {lead ? (
          <p className="measure mt-6 text-base leading-relaxed text-muted">{lead}</p>
        ) : null}
      </div>
    </Reveal>
  );
}

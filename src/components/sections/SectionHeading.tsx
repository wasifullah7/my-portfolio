import { Reveal } from "@/components/motion/Reveal";

type Props = {
  index: string;
  title: string;
  lead?: string;
};

export function SectionHeading({ index, title, lead }: Props) {
  return (
    <Reveal>
      <div className="max-w-2xl">
        <span className="font-mono text-xs tracking-widest text-primary">{index}</span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        {lead ? <p className="balance mt-4 text-muted">{lead}</p> : null}
      </div>
    </Reveal>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { AgentConsole } from "@/components/voice/AgentConsole";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Talk to my agent",
  description:
    "A real-time voice agent that answers questions about my work. Built on LiveKit with streaming speech recognition and local speech synthesis.",
  alternates: { canonical: "/talk" },
  openGraph: {
    type: "website",
    title: `Talk to my agent, ${site.name}`,
    description:
      "A real-time voice agent that answers questions about my work, built on the same stack I ship for clients.",
    url: `${site.url}/talk`,
  },
};

export default function TalkPage() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[80vh] max-w-[1100px] flex-col px-6 pb-28 pt-28 sm:px-10"
    >
      <Reveal>
        <nav aria-label="Breadcrumb">
          <Link
            href="/"
            className="link-underline mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
          >
            &larr; Back to the site
          </Link>
        </nav>

        <div className="mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="label">Voice agent</span>
          <span className="tabular text-xs text-faint">Live</span>
        </div>

        <h1 className="display mt-5 text-[clamp(2.1rem,6vw,4.5rem)]">Talk to my agent</h1>

        <p className="measure mt-7 text-lg leading-relaxed text-muted">
          Ask it about the voice work, the vision pipelines, or anything else on this
          site. It answers from what I have published here, and it will tell you when
          it does not know something rather than guessing.
        </p>

        {/* The stack is the point. Someone evaluating a voice engineer should be
            able to see what the demo is made of without opening the repository. */}
        <dl className="rule-t mt-10 flex flex-wrap gap-x-14 gap-y-6 pt-6">
          <div>
            <dt className="mono text-[0.8125rem] text-ink">LiveKit + WebRTC</dt>
            <dd className="label mt-1.5">Transport</dd>
          </div>
          <div>
            <dt className="mono text-[0.8125rem] text-ink">Whisper large v3 turbo</dt>
            <dd className="label mt-1.5">Speech recognition</dd>
          </div>
          <div>
            <dt className="mono text-[0.8125rem] text-ink">Piper, on the worker</dt>
            <dd className="label mt-1.5">Speech synthesis</dd>
          </div>
          <div>
            <dt className="mono text-[0.8125rem] text-ink">Silero</dt>
            <dd className="label mt-1.5">Turn taking</dd>
          </div>
        </dl>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-14">
          <AgentConsole />
        </div>
      </Reveal>
    </main>
  );
}

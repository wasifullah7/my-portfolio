import Link from "next/link";
import { VoiceAgent } from "@/components/VoiceAgent";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

// A section rather than a corner bubble: a bubble reads as support chat, and
// corner widgets are the first thing people learn to ignore.
export function VoiceAgentSection() {
  return (
    <section
      id="talk"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-28 sm:px-10 sm:py-36"
    >
      <SectionHeading
        index="02"
        eyebrow="Voice agent"
        title="Or just ask it yourself"
        lead="I build real-time voice agents for a living, so there is one on this page. It answers from what I have published here, and it will tell you when it does not know something rather than guessing."
      />

      <Reveal delay={0.06}>
        <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_320px] lg:gap-20">
          <VoiceAgent compact />

          <aside className="rule-t pt-4">
            <p className="label">What it runs on</p>
            <dl className="mt-4 flex flex-col gap-3">
              {[
                ["LiveKit + WebRTC", "Transport"],
                ["Whisper large v3 turbo", "Speech recognition"],
                ["Piper, on the worker", "Speech synthesis"],
                ["Silero", "Turn taking"],
              ].map(([what, role]) => (
                <div key={role}>
                  <dt className="mono text-[0.8125rem] text-ink">{what}</dt>
                  <dd className="label mt-1">{role}</dd>
                </div>
              ))}
            </dl>

            <Link
              href="/talk"
              className="link-underline mono mt-6 inline-block text-xs uppercase tracking-[0.16em] text-accent"
            >
              See the latency, live
            </Link>
          </aside>
        </div>
      </Reveal>
    </section>
  );
}

import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function LatestWriting() {
  const posts = getAllPosts().slice(0, 4);
  if (!posts.length) return null;

  return (
    <section
      id="writing"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-28 sm:px-10 sm:py-36"
    >
      <SectionHeading
        index="06"
        eyebrow="Writing"
        title="Engineering write-ups"
        lead="Long-form notes on latency, concurrency and retrieval in production AI systems."
      />

      <ul className="mt-14">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.05}>
            <li>
              <Link
                href={`/blog/${post.slug}`}
                className="row rule-t group grid gap-3 py-7 lg:grid-cols-12 lg:gap-8"
              >
                <time dateTime={post.date} className="tabular text-xs text-accent lg:col-span-2">
                  {formatDate(post.date)}
                </time>
                <span className="lg:col-span-8">
                  <span className="block text-[1.05rem] leading-snug text-ink">
                    {post.title}
                  </span>
                </span>
                <span className="mono text-xs text-faint lg:col-span-2 lg:text-right">
                  {post.readingMinutes} min
                </span>
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>
      <div className="rule-t" />

      <Reveal>
        <Link
          href="/blog"
          className="link-underline mono mt-8 inline-block text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
        >
          All writing
        </Link>
      </Reveal>
    </section>
  );
}

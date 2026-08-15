import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";
import { site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Engineering write-ups on production voice AI, retrieval-augmented generation, vLLM concurrency, and computer-vision pipelines by Wasif Ullah.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const totalWords = posts.reduce((sum, post) => sum + post.words, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${site.name}, Writing`,
    url: `${site.url}/blog`,
    author: { "@type": "Person", name: site.name, url: site.url },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.date,
      url: `${site.url}/blog/${post.slug}`,
      mainEntityOfPage: post.canonicalUrl,
    })),
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-28 sm:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Reveal>
        <div className="rule-heavy pt-4">
          <div className="index-rule">
            <span className="tabular text-xs text-accent">06</span>
            <span className="label order-3">Writing</span>
          </div>
        </div>

        <h1 className="display mt-8 text-[clamp(2.1rem,6vw,4.5rem)]">
          Engineering write-ups
        </h1>

        <p className="measure mt-6 text-base leading-relaxed text-muted">
          Long-form notes on shipping AI systems in production: cutting voice-agent
          latency, tuning vLLM for concurrency, and building retrieval pipelines that
          answer from real documents. Each piece is a problem I actually hit at work.
        </p>

        <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4">
          <div>
            <dt className="tabular text-2xl text-accent">{posts.length}</dt>
            <dd className="label mt-1">articles</dd>
          </div>
          <div>
            <dt className="tabular text-2xl text-accent">
              {(totalWords / 1000).toFixed(1)}k
            </dt>
            <dd className="label mt-1">words published</dd>
          </div>
        </dl>
      </Reveal>

      <div className="mt-16">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.04}>
            <article>
              <Link
                href={`/blog/${post.slug}`}
                className="row rule-t group grid gap-4 py-8 lg:grid-cols-12 lg:gap-8"
              >
                <div className="lg:col-span-2">
                  <time
                    dateTime={post.date}
                    className="tabular text-xs text-accent"
                  >
                    {formatDate(post.date)}
                  </time>
                </div>

                <div className="lg:col-span-8">
                  <h2 className="text-[1.15rem] leading-snug text-ink sm:text-[1.35rem]">
                    {post.title}
                  </h2>
                  <p className="measure mt-2.5 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                    {post.tags.map((tag) => (
                      <li key={tag} className="mono text-[0.7rem] text-faint">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-2 lg:text-right">
                  <span className="mono text-xs text-faint">
                    {post.readingMinutes} min
                  </span>
                </div>
              </Link>
            </article>
          </Reveal>
        ))}
        <div className="rule-t" />
      </div>

    </div>
  );
}

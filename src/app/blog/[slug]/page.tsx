import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, formatDate } from "@/lib/posts";
import { site } from "@/content/site";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    // Deliberate: Medium published these first and keeps the ranking credit.
    alternates: { canonical: post.canonicalUrl },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [site.name],
      tags: post.tags,
      url: `${site.url}/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    wordCount: post.words,
    keywords: post.tags.join(", "),
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
      jobTitle: site.role,
    },
    publisher: { "@type": "Person", name: site.name, url: site.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": post.canonicalUrl },
    url: `${site.url}/blog/${post.slug}`,
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Writing", item: `${site.url}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${site.url}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-6 pb-28 pt-28 sm:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <nav aria-label="Breadcrumb">
        <Link
          href="/blog"
          className="link-underline mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
        >
          &larr; Writing
        </Link>
      </nav>

      <header className="mt-10">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <time dateTime={post.date} className="tabular text-xs text-accent">
            {formatDate(post.date)}
          </time>
          <span className="mono text-xs text-faint">{post.readingMinutes} min read</span>
        </div>

        <h1 className="mt-5 text-[clamp(1.9rem,4.5vw,3rem)] font-bold leading-[1.08] tracking-tight">
          {post.title}
        </h1>

        <p className="measure mt-6 text-lg leading-relaxed text-muted">{post.excerpt}</p>

        <ul className="rule-t mt-8 flex flex-wrap gap-x-5 gap-y-2 pt-4">
          {post.tags.map((tag) => (
            <li key={tag} className="mono text-[0.7rem] uppercase tracking-[0.12em] text-faint">
              {tag}
            </li>
          ))}
        </ul>
      </header>

      <div
        className="prose mt-12"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

      <footer className="rule-t mt-16 pt-6">
        <p className="text-sm text-muted">
          Originally published on{" "}
          <a
            href={post.canonicalUrl}
            target="_blank"
            rel="noreferrer"
            className="link-underline text-accent"
          >
            Medium
          </a>
          .
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link
            href="/hire"
            className="group mono inline-flex items-center gap-3 border border-ink px-6 py-3 text-xs uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-ink hover:text-paper"
          >
            Work with me
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
          <Link
            href="/blog"
            className="link-underline mono text-xs uppercase tracking-[0.16em] text-muted hover:text-ink"
          >
            More writing
          </Link>
        </div>
      </footer>
    </article>
  );
}

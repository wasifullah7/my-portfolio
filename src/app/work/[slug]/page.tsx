import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { getPost, formatDate } from "@/lib/posts";
import { ProjectMedia, resolveImage } from "@/components/ProjectMedia";
import { ProjectDiagram } from "@/components/ProjectDiagram";
import { diagrams } from "@/content/diagrams";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { ViewTransition } from "@/components/motion/ViewTransition";

/** Only projects with written case-study detail get a page. */
const caseStudies = projects.filter((project) => project.problem);

export function generateStaticParams() {
  return caseStudies.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = caseStudies.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.blurb,
    keywords: project.stack,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title}, ${site.name}`,
      description: project.blurb,
      url: `${site.url}/work/${project.slug}`,
    },
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = caseStudies.find((p) => p.slug === slug);
  if (!project) notFound();

  const hasImage = !!resolveImage(project.image);

  const related = (project.relatedPosts ?? [])
    .map((postSlug) => getPost(postSlug))
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.blurb,
    url: `${site.url}/work/${project.slug}`,
    keywords: project.stack.join(", "),
    creator: { "@type": "Person", name: site.name, url: site.url },
    ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Work", item: `${site.url}/#work` },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${site.url}/work/${project.slug}`,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-[1100px] px-6 pb-28 pt-28 sm:px-10">
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
          href="/#work"
          className="link-underline mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
        >
          &larr; Selected work
        </Link>
      </nav>

      <header className="mt-10">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="label">{project.context}</span>
          <span className="tabular text-xs text-faint">{project.year}</span>
        </div>

        <ViewTransition name={`work-title-${project.slug}`} share="morph" default="none">
          <h1 className="display mt-5 text-[clamp(2rem,6vw,4.25rem)]">{project.title}</h1>
        </ViewTransition>

        {/* Leading definition: the first 80 words carry the extractable answer. */}
        <p className="measure mt-7 text-lg leading-relaxed text-muted">{project.blurb}</p>

        {project.metrics ? (
          <dl className="rule-t mt-10 flex flex-wrap gap-x-16 gap-y-6 pt-6">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="tabular text-3xl text-accent">{metric.value}</dt>
                <dd className="label mt-1.5">{metric.label}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </header>

      {/* Where a real image of the work exists it leads, and the architecture
          follows underneath, because the two say different things and a case
          study has room for both. Where there is no image, the architecture
          takes the lead slot instead of leaving a hatched plate there. Most of
          this work is backend, and the client systems could not have been
          screenshotted in any case. */}
      <ClipReveal className="mt-12">
        {hasImage || !diagrams[project.slug] ? (
          <ProjectMedia project={project} />
        ) : (
          <ProjectDiagram
            slug={project.slug}
            title={project.title}
            year={project.year}
          />
        )}
      </ClipReveal>

      {hasImage && diagrams[project.slug] ? (
        <ClipReveal className="mt-10">
          <ProjectDiagram
            slug={project.slug}
            title={project.title}
            year={project.year}
          />
        </ClipReveal>
      ) : null}

      <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_260px] lg:gap-20">
        <div>
          <section>
            <h2 className="label text-accent">The problem</h2>
            <p className="measure mt-5 text-[1.0625rem] leading-relaxed text-muted">
              {project.problem}
            </p>
          </section>

          {project.approach ? (
            <section className="rule-t mt-12 pt-8">
              <h2 className="label text-accent">Approach</h2>
              <ol className="mt-6 space-y-5">
                {project.approach.map((step, i) => (
                  <li
                    key={step}
                    className="measure grid grid-cols-[38px_1fr] text-[1.0625rem] leading-relaxed text-muted"
                  >
                    <span className="tabular text-sm text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {project.outcome ? (
            <section className="rule-t mt-12 pt-8">
              <h2 className="label text-accent">Outcome</h2>
              <p className="measure mt-5 text-[1.0625rem] leading-relaxed text-ink">
                {project.outcome}
              </p>
            </section>
          ) : null}
        </div>

        <aside>
          <div className="rule-t pt-4">
            <p className="label">Stack</p>
            <ul className="mt-3 space-y-1.5">
              {project.stack.map((tech) => (
                <li key={tech} className="mono text-[0.8125rem] text-muted">
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          {project.repoUrl || project.demoUrl ? (
            <div className="rule-t mt-8 pt-4">
              <p className="label">Links</p>
              <ul className="mt-3 space-y-2">
                {project.demoUrl ? (
                  <li>
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline mono text-[0.8125rem] text-accent"
                    >
                      Live demo
                    </a>
                  </li>
                ) : null}
                {project.repoUrl ? (
                  <li>
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline mono text-[0.8125rem] text-muted"
                    >
                      Source on GitHub
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>

      {related.length ? (
        <section className="rule-heavy mt-20 pt-8">
          <h2 className="label text-accent">Written up in detail</h2>
          <ul className="mt-6">
            {related.map((post) => (
              <li key={post!.slug}>
                <Link
                  href={`/blog/${post!.slug}`}
                  className="row rule-t group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-5"
                >
                  <span className="text-[0.9375rem] text-ink">{post!.title}</span>
                  <span className="mono text-xs text-faint">
                    {formatDate(post!.date)} · {post!.readingMinutes} min
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="rule-t" />
        </section>
      ) : null}

      <footer className="mt-16">
        <Link
          href="/hire"
          className="group mono inline-flex items-center gap-3 border border-ink px-6 py-3 text-xs uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          Work with me
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </footer>
    </article>
  );
}

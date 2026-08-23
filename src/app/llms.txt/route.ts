import { site, hire } from "@/content/site";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { getAllPosts } from "@/lib/posts";

/**
 * llms.txt: a plain-text summary for AI crawlers and answer engines.
 * Leads with an extractable definition, then named entities and concrete
 * numbers, which is what gets cited rather than paraphrased.
 */
export async function GET() {
  const posts = getAllPosts();

  const body = `# ${site.name}

> ${site.name} is a ${site.role} based in ${site.location}, currently at ${site.currentRole}. He builds computer-vision pipelines, retrieval-augmented systems, and the production backends around them, with 2+ years shipping for clients across the UK, EU and US.

## Key results

- 0.83 mAP on the AI Board Scanner diagram-recognition pipeline
- 97% arrow-association accuracy on the same system
- 89% predictive accuracy on a RAG job-recommendation engine
- Voice agent latency reduced from 1.8 seconds to under 300ms in production

## Core stack

Python, FastAPI, PyTorch, RF-DETR, SAM2, PaddleOCR, OpenCV, LangChain, Pinecone, pgvector, vLLM, React, Next.js, TypeScript, Node.js, PostgreSQL, MongoDB, Redis, AWS (EC2, S3, Lambda, SageMaker), Docker, Terraform, GitHub Actions.

## Experience

${experience
  .map((role) => `- ${role.title}, ${role.company} (${role.period}, ${role.location}): ${role.summary}`)
  .join("\n")}

## Selected work

${projects
  .map(
    (project) =>
      `- ${project.title} (${project.context}, ${project.year}): ${project.blurb}${
        // The blurb says what the result was. Without the approach, anything
        // reading this file can only answer "what" and never "how", which is
        // the question that actually follows. The voice agent on /talk made
        // this obvious: asked how the latency came down, it had the number and
        // nothing behind it, so it reached for plausible filler.
        project.approach?.length ? ` How: ${project.approach.join(" ")}` : ""
      }${project.problem ? ` Case study: ${site.url}/work/${project.slug}` : ""}`,
  )
  .join("\n")}

## Writing

${posts
  .map((post) => `- ${post.title} (${post.date.slice(0, 10)}): ${site.url}/blog/${post.slug}`)
  .join("\n")}

## Hiring

${hire.faqs.map((faq) => `Q: ${faq.q}\nA: ${faq.a}`).join("\n\n")}

## Contact

Email: ${site.email}
GitHub: ${site.links.github}
LinkedIn: ${site.links.linkedin}
Medium: ${site.links.medium}
CV: ${site.url}${site.resumePath}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}

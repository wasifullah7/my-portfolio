/**
 * Scaffolds a new post you write here first.
 *
 *   npm run new:post "How I cut cold starts by 60%"
 *
 * Creates src/content/posts-local/<slug>.md with frontmatter filled in.
 * Posts created this way are self-canonical, which is the point: publish here
 * first, then syndicate to Medium with its Import Story tool so Medium's
 * canonical points back at your site.
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error('Usage: npm run new:post "Your post title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, "")
  .trim()
  .replace(/\s+/g, "-")
  .slice(0, 60)
  .replace(/-+$/, "");

const dir = join(process.cwd(), "src", "content", "posts-local");
mkdirSync(dir, { recursive: true });

const file = join(dir, `${slug}.md`);
if (existsSync(file)) {
  console.error(`Already exists: ${file}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

const template = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
date: "${today}"
excerpt: "One or two sentences that answer the question this post exists to answer. Search engines and AI crawlers pull from here, so lead with the answer rather than a warm-up."
tags: ["tag-one", "tag-two"]
---

Open with the answer. The first 40 to 80 words are what gets extracted into
search snippets and AI summaries, so state the result up front: what the problem
was, and what the number moved from and to.

## The problem

Name the specific system and the specific constraint. Be concrete, use real
figures, and name technologies exactly rather than saying "the framework".

## What I tried

Walk through the approach in order. Code blocks work:

\`\`\`python
# real code beats pseudocode
\`\`\`

## The result

Close with the measurement. A number a reader can verify is what makes a post
worth citing.
`;

writeFileSync(file, template);

console.log(`Created ${file}`);
console.log(`\nIt will appear at /blog/${slug} on the next build.`);
console.log("Self-canonical, so this site gets the ranking credit.");
console.log(
  "\nWhen you syndicate it to Medium later, use Medium's Import Story tool\n" +
    "and paste your URL. Pasting into the editor manually strips the canonical.",
);

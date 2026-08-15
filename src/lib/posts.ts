import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  /** Points at Medium: these were published there first and keep the credit. */
  canonicalUrl: string;
  readingMinutes: number;
  words: number;
  body: string;
};

const DIR = join(process.cwd(), "src", "content", "posts");

let cache: Post[] | null = null;

/** Read at build time during static generation, then memoised. */
export function getAllPosts(): Post[] {
  if (cache) return cache;

  const files = readdirSync(DIR).filter(
    (file) => file.endsWith(".json") && !file.startsWith("_"),
  );

  cache = files
    .map((file) => JSON.parse(readFileSync(join(DIR, file), "utf8")) as Post)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return cache;
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

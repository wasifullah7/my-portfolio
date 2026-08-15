import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  /** Short title for the <title> tag, so long headlines never truncate in results. */
  metaTitle?: string;
  date: string;
  excerpt: string;
  tags: string[];
  /**
   * Present only on posts that were published on Medium first. When set, the
   * page canonicalises to Medium. Posts written here have no canonicalUrl and
   * canonicalise to this site, which is where the ranking credit should go.
   */
  canonicalUrl?: string;
  readingMinutes: number;
  words: number;
  body: string;
};

/** Imported from Medium by scripts/import-medium.mjs. Canonical stays on Medium. */
const IMPORTED_DIR = join(process.cwd(), "src", "content", "posts");

/** Written here first. Self-canonical. Author with `npm run new:post`. */
const LOCAL_DIR = join(process.cwd(), "src", "content", "posts-local");

let cache: Post[] | null = null;

function readImported(): Post[] {
  if (!existsSync(IMPORTED_DIR)) return [];
  return readdirSync(IMPORTED_DIR)
    .filter((file) => file.endsWith(".json") && !file.startsWith("_"))
    .map((file) => JSON.parse(readFileSync(join(IMPORTED_DIR, file), "utf8")) as Post);
}

function readLocal(): Post[] {
  if (!existsSync(LOCAL_DIR)) return [];

  return readdirSync(LOCAL_DIR)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .map((file) => {
      const raw = readFileSync(join(LOCAL_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const body = marked.parse(content, { async: false }) as string;
      const words = content.split(/\s+/).filter(Boolean).length;

      return {
        slug: (data.slug as string) ?? file.replace(/\.md$/, ""),
        title: (data.title as string) ?? file.replace(/\.md$/, ""),
        metaTitle: (data.metaTitle as string) || undefined,
        date: new Date(data.date ?? Date.now()).toISOString(),
        excerpt: (data.excerpt as string) ?? "",
        tags: (data.tags as string[]) ?? [],
        // Only set if the author explicitly points elsewhere.
        canonicalUrl: (data.canonicalUrl as string) || undefined,
        readingMinutes: Math.max(1, Math.round(words / 220)),
        words,
        body,
      } satisfies Post;
    });
}

/** Read at build time during static generation, then memoised. */
export function getAllPosts(): Post[] {
  if (cache) return cache;

  const all = [...readLocal(), ...readImported()];

  // A local post wins over an imported one with the same slug, so republishing
  // something here later cleanly supersedes the Medium import.
  const bySlug = new Map<string, Post>();
  for (const post of all) {
    if (!bySlug.has(post.slug)) bySlug.set(post.slug, post);
  }

  cache = [...bySlug.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
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

/**
 * Imports posts from the Medium RSS feed into src/content/posts/.
 *
 * The feed carries full article HTML in <content:encoded>, so this is a real
 * import rather than a summary. Canonical stays on Medium (see canonicalUrl),
 * which is a deliberate choice: no duplicate-content risk, Medium keeps the
 * ranking credit, and the writing is still visible on this domain.
 *
 * Re-run with:  node scripts/import-medium.mjs
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const FEED = "https://medium.com/feed/@wasifullahdev";
const OUT_DIR = join(process.cwd(), "src", "content", "posts");

const pick = (block, re) => (block.match(re) ?? [])[1] ?? "";

function slugify(text) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  if (base.length <= 60) return base.replace(/-+$/, "");
  // Cut on a word boundary so slugs never end mid-word.
  const cut = base.slice(0, 60);
  return cut.slice(0, cut.lastIndexOf("-")).replace(/-+$/, "");
}

/** Keep a conservative subset of tags; drop anything that could execute. */
function sanitize(html) {
  return (
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
      .replace(/\son\w+="[^"]*"/gi, "")
      .replace(/\son\w+='[^']*'/gi, "")
      .replace(/javascript:/gi, "")
      // Medium wraps every image in a figure with a redundant caption link.
      .replace(/<figcaption[\s\S]*?<\/figcaption>/gi, "")
      // Trailing Medium boilerplate.
      .replace(/<p>\s*<em>\s*Originally published[\s\S]*?<\/p>/gi, "")
      // Medium images are large and below the fold; never block first paint.
      .replace(/<img /gi, '<img loading="lazy" decoding="async" ')
      .trim()
  );
}

function toText(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/** First real sentence or two, for cards, meta description and AI extraction. */
function excerptOf(html) {
  const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) =>
    toText(m[1]),
  );
  const first = paragraphs.find((p) => p.length > 80) ?? paragraphs[0] ?? "";
  if (first.length <= 200) return first;
  const cut = first.slice(0, 200);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

const raw = await fetch(FEED, {
  headers: { "user-agent": "Mozilla/5.0 (portfolio import)" },
}).then((r) => {
  if (!r.ok) throw new Error(`Feed returned ${r.status}`);
  return r.text();
});

const items = raw.split("<item>").slice(1);
if (!items.length) throw new Error("No items in feed");

mkdirSync(OUT_DIR, { recursive: true });

const index = [];

for (const item of items) {
  const title = pick(item, /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/).trim();
  const link = pick(item, /<link>([\s\S]*?)<\/link>/).split("?")[0];
  const pubDate = pick(item, /<pubDate>([\s\S]*?)<\/pubDate>/);
  const body = sanitize(
    pick(item, /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/),
  );
  const tags = [...item.matchAll(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g)]
    .map((m) => m[1])
    .slice(0, 5);

  if (!title || !body) continue;

  const slug = slugify(title.split(":")[0]);
  const words = toText(body).split(" ").length;

  const post = {
    slug,
    title: title.replace(/…$/, "").trim(),
    date: new Date(pubDate).toISOString(),
    excerpt: excerptOf(body),
    tags,
    canonicalUrl: link,
    readingMinutes: Math.max(1, Math.round(words / 220)),
    words,
    body,
  };

  writeFileSync(join(OUT_DIR, `${slug}.json`), JSON.stringify(post, null, 2));
  index.push({ slug, title: post.title, date: post.date, words });
}

index.sort((a, b) => (a.date < b.date ? 1 : -1));
writeFileSync(
  join(OUT_DIR, "_index.json"),
  JSON.stringify(index.map((p) => p.slug), null, 2),
);

console.log(`Imported ${index.length} posts:`);
for (const p of index) {
  console.log(`  ${p.date.slice(0, 10)}  ${p.words.toString().padStart(5)}w  ${p.slug}`);
}

const missing = existsSync(join(OUT_DIR, "_index.json"))
  ? JSON.parse(readFileSync(join(OUT_DIR, "_index.json"), "utf8")).length
  : 0;
console.log(`\n_index.json lists ${missing} slugs.`);
console.log(
  "Note: Medium's RSS feed only exposes the 10 most recent posts. Older ones must be added by hand.",
);

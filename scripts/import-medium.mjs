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
import { writeFileSync, mkdirSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const FEED = "https://medium.com/feed/@wasifullahdev";
const OUT_DIR = join(process.cwd(), "src", "content", "posts");
const IMG_DIR = join(process.cwd(), "public", "blog");

/**
 * Descriptions live in src/content/image-alt.json rather than here, so that
 * re-importing a post keeps its alt text instead of resetting every image to
 * empty. Anything without an entry falls back to empty, which is the correct
 * value for decorative stock photography anyway.
 */
const ALT = JSON.parse(
  readFileSync(join(process.cwd(), "src", "content", "image-alt.json"), "utf8"),
);

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
      // Medium's view-tracking pixel. It reports back to Medium from this site.
      .replace(/<img[^>]*medium\.com\/_\/stat[^>]*>/gi, "")
      // Trailing Medium boilerplate.
      .replace(/<p>\s*<em>\s*Originally published[\s\S]*?<\/p>/gi, "")
      .trim()
  );
}

/**
 * Medium-specific calls to action. They ask for claps, follows and comments,
 * none of which exist here, so they read as leftovers on this site.
 */
const CTA_PATTERNS = [
  /\bclaps?\b/i,
  /\bfollow me\b/i,
  /a follow helps/i,
  /in the comments/i,
  /if you found this (useful|helpful)/i,
  /if this (helped|saved you)/i,
  /subscribe/i,
];

function stripCallsToAction(html) {
  let removed = 0;
  const cleaned = html.replace(/<p>[\s\S]*?<\/p>/gi, (block) => {
    const text = block.replace(/<[^>]+>/g, " ");
    if (text.length < 400 && CTA_PATTERNS.some((re) => re.test(text))) {
      removed++;
      return "";
    }
    return block;
  });
  return { cleaned, removed };
}

/**
 * Pulls every Medium-hosted image into /public/blog and rewrites the markup to
 * point at the local copy. Three reasons: Medium's CDN is blocked by common ad
 * blockers, which is why these rendered as broken boxes; the originals are
 * unoptimised (some over 800 KB); and hotlinking leaves the article dependent
 * on a third party staying up.
 */
async function localiseImages(html, slug) {
  const urls = [
    ...new Set(
      [...html.matchAll(/<img[^>]*src="(https?:\/\/[^"]+)"/gi)].map((m) => m[1]),
    ),
  ];
  if (!urls.length) return { html, count: 0, bytes: 0 };

  const dir = join(IMG_DIR, slug);
  mkdirSync(dir, { recursive: true });

  let out = html;
  let count = 0;
  let bytes = 0;

  for (const [i, url] of urls.entries()) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "Mozilla/5.0 (portfolio import)" },
        redirect: "follow",
      });
      if (!response.ok) continue;

      const buffer = Buffer.from(await response.arrayBuffer());
      const image = sharp(buffer);
      const meta = await image.metadata();

      // Cap width at 1600: nothing on this site renders wider.
      const webp = await image
        .resize({ width: Math.min(meta.width ?? 1600, 1600), withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toBuffer();
      const finalMeta = await sharp(webp).metadata();

      const name = `${String(i + 1).padStart(2, "0")}.webp`;
      writeFileSync(join(dir, name), webp);
      bytes += webp.length;
      count++;

      // Explicit dimensions so the article reserves space and never shifts.
      const alt = (ALT[`/blog/${slug}/${name}`] ?? "").replace(/"/g, "&quot;");
      const tag =
        `<img src="/blog/${slug}/${name}" width="${finalMeta.width}" ` +
        `height="${finalMeta.height}" loading="lazy" decoding="async" alt="${alt}" />`;

      out = out.replace(
        new RegExp(`<img[^>]*src="${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`, "gi"),
        tag,
      );
    } catch {
      // Leave the original tag alone if a download fails.
    }
  }

  return { html: out, count, bytes };
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

/**
 * Titles already published here first. Syndicating one to Medium puts it back
 * in this feed, and importing it would create a second copy of the same
 * article on this site, canonicalised to Medium. Skip those.
 */
const LOCAL_DIR = join(process.cwd(), "src", "content", "posts-local");
const localTitles = new Set();
if (existsSync(LOCAL_DIR)) {
  for (const file of readdirSync(LOCAL_DIR).filter((f) => f.endsWith(".md"))) {
    const front = readFileSync(join(LOCAL_DIR, file), "utf8");
    const title = (front.match(/^title:\s*"?(.+?)"?\s*$/m) ?? [])[1];
    if (title) localTitles.add(title.trim().toLowerCase());
  }
}

const index = [];
const stats = [];
const skipped = [];

for (const item of items) {
  const title = pick(item, /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/).trim();
  const link = pick(item, /<link>([\s\S]*?)<\/link>/).split("?")[0];
  const pubDate = pick(item, /<pubDate>([\s\S]*?)<\/pubDate>/);
  const raw = sanitize(
    pick(item, /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/),
  );
  const tags = [...item.matchAll(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g)]
    .map((m) => m[1])
    .slice(0, 5);

  if (!title || !raw) continue;

  if (localTitles.has(title.trim().toLowerCase())) {
    skipped.push(title);
    continue;
  }

  const slug = slugify(title.split(":")[0]);

  const { cleaned, removed } = stripCallsToAction(raw);
  const localised = await localiseImages(cleaned, slug);
  const body = localised.html;

  stats.push({
    slug,
    ctaRemoved: removed,
    images: localised.count,
    imageKb: Math.round(localised.bytes / 1024),
  });

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
  const s = stats.find((entry) => entry.slug === p.slug);
  const extra = s
    ? `  ${String(s.images).padStart(2)} img ${String(s.imageKb).padStart(4)}KB` +
      (s.ctaRemoved ? `  ${s.ctaRemoved} CTA removed` : "")
    : "";
  console.log(
    `  ${p.date.slice(0, 10)}  ${p.words.toString().padStart(5)}w  ${p.slug.padEnd(56)}${extra}`,
  );
}

const totalImages = stats.reduce((sum, s) => sum + s.images, 0);
const totalKb = stats.reduce((sum, s) => sum + s.imageKb, 0);
const totalCta = stats.reduce((sum, s) => sum + s.ctaRemoved, 0);
console.log(
  `\n${totalImages} images pulled local (${totalKb} KB total), ${totalCta} Medium calls to action removed.`,
);

if (skipped.length) {
  console.log(`\nSkipped ${skipped.length}, already published here first:`);
  for (const title of skipped) console.log(`  ${title}`);
}

const missing = existsSync(join(OUT_DIR, "_index.json"))
  ? JSON.parse(readFileSync(join(OUT_DIR, "_index.json"), "utf8")).length
  : 0;
console.log(`\n_index.json lists ${missing} slugs.`);
console.log(
  "Note: Medium's RSS feed only exposes the 10 most recent posts. Older ones must be added by hand.",
);

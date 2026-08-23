/**
 * Pushes src/content/image-alt.json into the alt attributes of every imported
 * post. The importer applies the same map as it writes each <img>, so this only
 * needs running when the map itself changes, or after an import that predates a
 * new entry.
 *
 * Reports anything missing in either direction, because a silently unmatched
 * key looks identical to a correctly applied one.
 *
 *   node scripts/apply-alt.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = join(here, "..", "src", "content", "posts");
const ALT_PATH = join(here, "..", "src", "content", "image-alt.json");

const altMap = JSON.parse(readFileSync(ALT_PATH, "utf8"));
delete altMap._comment;

const seen = new Set();
let changed = 0;
const unmapped = [];

for (const file of readdirSync(POSTS_DIR)) {
  if (!file.endsWith(".json") || file === "_index.json") continue;

  const path = join(POSTS_DIR, file);
  const post = JSON.parse(readFileSync(path, "utf8"));
  const before = post.body;

  // Rewrite the alt of every <img>, whatever it currently holds, so the map
  // stays the single source of truth rather than only filling empty ones.
  post.body = post.body.replace(/<img\b[^>]*>/g, (tag) => {
    const src = tag.match(/src="([^"]*)"/)?.[1];
    if (src === undefined) return tag;
    if (!(src in altMap)) {
      unmapped.push(src);
      return tag;
    }
    seen.add(src);
    const alt = altMap[src].replace(/"/g, "&quot;");
    return tag.includes("alt=")
      ? tag.replace(/alt="[^"]*"/, `alt="${alt}"`)
      : tag.replace(/\s*\/?>$/, ` alt="${alt}" />`);
  });

  if (post.body !== before) {
    writeFileSync(path, JSON.stringify(post, null, 2));
    changed += 1;
  }
}

const orphans = Object.keys(altMap).filter((k) => !seen.has(k));

console.log(`posts rewritten: ${changed}`);
console.log(`images described: ${seen.size}`);
if (unmapped.length) {
  console.log(`\nno entry in image-alt.json (left untouched):`);
  for (const src of unmapped) console.log(`  ${src}`);
}
if (orphans.length) {
  console.log(`\nin image-alt.json but no matching image:`);
  for (const src of orphans) console.log(`  ${src}`);
}

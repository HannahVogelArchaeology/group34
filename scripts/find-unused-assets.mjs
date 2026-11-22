// Lists the files in assets/ that no page, layout, include, script or style refers to.
// Run from the repository root:  node scripts/find-unused-assets.mjs
// It only reads files. Delete the files it lists after checking them (some may be kept on purpose, for example for later pages).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, basename, extname } from "node:path";

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "_site", "node_modules", ".jekyll-cache", "vendor", "tests"]);
const TEXT_EXT = new Set([".md", ".html", ".json", ".js", ".mjs", ".scss", ".yml", ".yaml", ".cff", ".txt", ".vtt", ".svg", ".xml"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const info = statSync(full);
    if (info.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(ROOT);
let text = "";
for (const file of files) {
  if (TEXT_EXT.has(extname(file).toLowerCase()) && !file.includes(join("assets", "images", "responsive"))) {
    text += readFileSync(file, "utf8") + "\n";
  }
}

// Responsive copies (assets/images/responsive/<name>-<width>.webp) are used when the original image is used.
const responsive = /-(\d+)\.(webp|avif|jpg|jpeg|png)$/i;
const unused = [];

for (const file of files) {
  const rel = file.slice(ROOT.length + 1).split("\\").join("/");
  if (!rel.startsWith("assets/") || /^assets\/(css|js)\//.test(rel) || rel === "assets/main.scss") continue;

  const name = basename(rel);
  let stem = name;
  if (rel.startsWith("assets/images/responsive/")) stem = name.replace(responsive, "");
  const needles = rel.startsWith("assets/images/responsive/") ? [stem] : [name, rel];

  if (!needles.some((needle) => text.includes(needle))) unused.push(rel);
}

if (unused.length === 0) {
  console.log("Every file in assets/ is used somewhere.");
} else {
  console.log(`${unused.length} file(s) in assets/ are not used anywhere:`);
  for (const rel of unused.sort()) console.log("  " + rel);
}

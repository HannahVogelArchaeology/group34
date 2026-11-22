// Shrinks the text files of a built Jekyll site (the _site folder) without changing how pages look or behave.
//  - .json: parsed and written back without whitespace (skipped if the file does not parse).
//  - .html: removes HTML comments and indentation / blank lines, except inside <script>, <style>, <pre>, <textarea>.
// CSS is already compressed by Jekyll (sass: style: compressed) and JavaScript by esbuild in the workflow.
// Usage: node scripts/minify-site.mjs <site directory>
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "_site");
let saved = 0, files = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith(".json")) handle(p, minJson);
    else if (p.endsWith(".html")) handle(p, minHtml);
  }
}
function handle(p, fn) {
  try {
    const before = fs.readFileSync(p, "utf8");
    const after = fn(before);
    if (after && after.length < before.length) {
      fs.writeFileSync(p, after);
      saved += Buffer.byteLength(before) - Buffer.byteLength(after);
      files++;
    }
  } catch (err) {
    console.log(`::warning::Could not minify ${p}: ${err.message}`);
  }
}
const minJson = (s) => JSON.stringify(JSON.parse(s));

function minHtml(s) {
  // Split into protected blocks (kept as is) and normal text (cleaned).
  const protectedRe = /<(script|style|pre|textarea)\b[\s\S]*?<\/\1>/gi;
  let out = "", last = 0, m;
  const clean = (t) => t
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, "")
    .replace(/^[ \t]+/gm, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\r?\n(?:[ \t]*\r?\n)+/g, "\n");
  while ((m = protectedRe.exec(s))) {
    out += clean(s.slice(last, m.index)) + m[0];
    last = m.index + m[0].length;
  }
  return out + clean(s.slice(last));
}

walk(root);
console.log(`Minified ${files} files, saved ${(saved / 1024).toFixed(1)} KiB.`);

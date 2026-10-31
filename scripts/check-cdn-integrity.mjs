// Checks every third-party stylesheet and script in the built site.
//   1. The URL names an exact version (no "latest" or open ranges).
//   2. The tag has an integrity hash and crossorigin="anonymous".
//   3. With --verify, the downloaded file really matches that hash (needs internet access).
// Google Fonts are exempt because they return different CSS for every browser, so no single hash can match.
//
// Usage: node scripts/check-cdn-integrity.mjs <built-site-folder> [--verify]

import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const EXEMPT_HOSTS = new Set(["fonts.googleapis.com", "fonts.gstatic.com"]);
const siteFolder = process.argv[2] || "_site";
const verify = process.argv.includes("--verify");

function htmlFiles(folder) {
  return readdirSync(folder).flatMap((name) => {
    const path = join(folder, name);
    return statSync(path).isDirectory() ? htmlFiles(path) : path.endsWith(".html") ? [path] : [];
  });
}

function attribute(tag, name) {
  const match = new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i").exec(tag);
  return match ? match[2] ?? match[3] : null;
}

// Collect each distinct external resource once, remembering where it was found.
const resources = new Map();

for (const file of htmlFiles(siteFolder)) {
  const html = readFileSync(file, "utf8");

  for (const tag of html.match(/<(link|script)\b[^>]*>/gi) || []) {
    const isStyle = /^<link/i.test(tag) && /rel\s*=\s*["']?stylesheet/i.test(tag);
    const isScript = /^<script/i.test(tag) && attribute(tag, "src");
    const url = isStyle ? attribute(tag, "href") : isScript ? attribute(tag, "src") : null;

    if (!url || !/^https?:\/\//i.test(url) || EXEMPT_HOSTS.has(new URL(url).hostname)) {
      continue;
    }

    if (!resources.has(url)) {
      resources.set(url, { tag, files: [] });
    }
    resources.get(url).files.push(file);
  }
}

const problems = [];

for (const [url, { tag, files }] of resources) {
  const integrity = attribute(tag, "integrity");
  const crossorigin = attribute(tag, "crossorigin");
  const where = `${url} (in ${files[0]}${files.length > 1 ? ` and ${files.length - 1} more` : ""})`;

  if (!/(\/|@)v?\d+\.\d+(\.\d+)?[\/@.-]/.test(url) || /latest|\^|~/.test(url)) {
    problems.push(`No exact version in the URL: ${where}`);
  }
  if (!integrity || !/^sha(256|384|512)-/.test(integrity)) {
    problems.push(`Missing integrity hash: ${where}`);
    continue;
  }
  if (crossorigin !== "anonymous") {
    problems.push(`Missing crossorigin="anonymous": ${where}`);
  }

  if (verify) {
    const response = await fetch(url);
    if (!response.ok) {
      problems.push(`Could not download (${response.status}): ${where}`);
      continue;
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    const matches = integrity.split(" ").some((entry) => {
      const [algorithm, expected] = entry.split("-");
      return createHash(algorithm).update(bytes).digest("base64") === expected;
    });
    if (!matches) {
      problems.push(`The file does not match its integrity hash: ${where}`);
    }
  }
}

console.log(`Checked ${resources.size} third-party file(s)${verify ? " (hashes verified against the downloads)" : ""}.`);

if (problems.length) {
  console.error(problems.map((problem) => `- ${problem}`).join("\n"));
  process.exit(1);
}

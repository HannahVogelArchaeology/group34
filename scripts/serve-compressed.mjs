// Static file server that compresses text responses (Brotli or gzip), like GitHub Pages does.
// Used by the Lighthouse workflow so the audit measures what visitors really receive.
// Usage: node scripts/serve-compressed.mjs <directory> <port>
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = path.resolve(process.argv[2] || ".");
const port = Number(process.argv[3] || 4173);
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".vtt": "text/vtt; charset=utf-8",
  ".woff2": "font/woff2", ".woff": "font/woff", ".ico": "image/x-icon",
};
const cache = new Map();
const compressible = new Set([".html", ".css", ".js", ".mjs", ".json", ".svg", ".xml", ".txt", ".vtt"]);

http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(root, rel);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found"); return; }
  const ext = path.extname(file).toLowerCase();
  const headers = { "Content-Type": types[ext] || "application/octet-stream", Vary: "Accept-Encoding" };
  const body = fs.readFileSync(file);
  const accept = String(req.headers["accept-encoding"] || "");
  if (compressible.has(ext) && body.length > 1024) {
    // Compress each file once and keep the result. Brotli at its default (highest) level is slow, so a medium level is
    // used: the audit then measures the pages, not the time this test server needs to compress them.
    const encoding = /\bbr\b/.test(accept) ? "br" : /\bgzip\b/.test(accept) ? "gzip" : "";
    if (encoding) {
      const key = encoding + ":" + file;
      if (!cache.has(key)) {
        cache.set(
          key,
          encoding === "br"
            ? zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } })
            : zlib.gzipSync(body, { level: 6 })
        );
      }
      headers["Content-Encoding"] = encoding;
      res.writeHead(200, headers).end(cache.get(key));
      return;
    }
  }
  res.writeHead(200, headers).end(body);
}).listen(port, "127.0.0.1", () => console.log(`Serving ${root} on http://127.0.0.1:${port}`));

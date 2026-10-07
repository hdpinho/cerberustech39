// Servidor estático local que imita a Vercel / Cloudflare Pages:
// compresión Brotli/gzip, cabeceras de public/_headers y rutas con barra final.
// Uso: node scripts/serve.mjs [puerto]   (sirve ./out)
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { createServer as createHttpsServer } from "node:https";
import { extname, join, normalize } from "node:path";
import { createBrotliCompress, createGzip, constants } from "node:zlib";

const root = join(process.cwd(), "out");
const port = Number(process.argv[2] ?? 3000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
const compressible = new Set([".html", ".js", ".css", ".json", ".txt", ".xml", ".svg"]);

// Interpreta public/_headers (formato Cloudflare) de forma básica
async function loadHeaders() {
  const rules = [];
  try {
    const raw = await readFile(join(root, "_headers"), "utf8");
    let current = null;
    for (const line of raw.split(/\r?\n/)) {
      if (!line.trim() || line.trim().startsWith("#")) continue;
      if (!/^\s/.test(line)) {
        current = { pattern: new RegExp(`^${line.trim().replace(/\*/g, ".*")}$`), headers: {} };
        rules.push(current);
      } else if (current) {
        const i = line.indexOf(":");
        current.headers[line.slice(0, i).trim()] = line.slice(i + 1).trim();
      }
    }
  } catch {
    /* sin _headers */
  }
  return rules;
}
const rules = await loadHeaders();

// HTTPS opcional (TLS_CERT y TLS_KEY con rutas a PEM): necesario para medir con
// Lighthouse en equipos donde un proxy/antivirus descomprime el tráfico HTTP.
const tls =
  process.env.TLS_CERT && process.env.TLS_KEY
    ? { cert: await readFile(process.env.TLS_CERT), key: await readFile(process.env.TLS_KEY) }
    : null;
const make = tls ? (h) => createHttpsServer(tls, h) : (h) => createServer(h);

make(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://x");
    let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
    let file = join(root, path);
    let s = await stat(file).catch(() => null);
    if (s?.isDirectory()) {
      file = join(file, "index.html");
      s = await stat(file).catch(() => null);
    } else if (!s && !extname(path)) {
      file = `${file}.html`;
      s = await stat(file).catch(() => null);
    }
    let status = 200;
    if (!s) {
      status = 404;
      file = join(root, "404.html");
    }
    const ext = extname(file);
    const headers = { "Content-Type": types[ext] ?? "application/octet-stream", Vary: "Accept-Encoding" };
    for (const r of rules) if (r.pattern.test(url.pathname)) Object.assign(headers, r.headers);

    const accept = String(req.headers["accept-encoding"] ?? "");
    if (process.env.DEBUG_SERVE) console.log(req.url, "accept-encoding:", accept);
    let stream = createReadStream(file);
    if (compressible.has(ext) && /\bbr\b/.test(accept)) {
      headers["Content-Encoding"] = "br";
      stream = stream.pipe(createBrotliCompress({ params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }));
    } else if (compressible.has(ext) && /\bgzip\b/.test(accept)) {
      headers["Content-Encoding"] = "gzip";
      stream = stream.pipe(createGzip());
    }
    res.writeHead(status, headers);
    stream.pipe(res);
  } catch (e) {
    res.writeHead(500).end(String(e));
  }
}).listen(port, () => console.log(`Sirviendo out/ en ${tls ? "https" : "http"}://localhost:${port}`));

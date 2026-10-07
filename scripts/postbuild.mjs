// Post-procesado de out/ tras `next build` (script "postbuild"):
//
// 1. Hidratación tras el primer pintado. Los scripts async de Next se piden
//    y ejecutan antes de que el navegador pinte el HTML (que ya trae todo el
//    contenido). Se sustituyen por un cargador mínimo que los inserta justo
//    después del primer frame: el contenido aparece antes y la interactividad
//    llega un frame más tarde (imperceptible). Mejora FCP/LCP en móvil.
//
// 2. Content-Security-Policy estricta en <meta>, con hashes SHA-256 de cada
//    script inline (incluido el cargador). frame-ancestors no es válido en
//    <meta>: va como cabecera en vercel.json y public/_headers.
//
// Funciona igual en Vercel y en Cloudflare Pages porque modifica los HTML.
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = "out";

function origin(u) {
  try {
    return u ? new URL(u).origin : "";
  } catch {
    return "";
  }
}

// Orígenes externos permitidos: proveedor del formulario y analítica (si se activan)
const formOrigin = origin(process.env.NEXT_PUBLIC_FORM_ENDPOINT) || "https://formspree.io";
const analyticsSrc =
  process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER === "plausible"
    ? origin(process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js")
    : process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER === "umami"
      ? origin(process.env.NEXT_PUBLIC_UMAMI_SRC)
      : "";

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(p);
    else if (entry.name.endsWith(".html")) yield p;
  }
}

/* ── 1. Cargador post-pintado ── */
function deferHydration(html) {
  const srcs = [];
  html = html.replace(/<script src="(\/_next\/static\/[^"]+\.js)" async=""><\/script>/g, (_, src) => {
    srcs.push(src);
    return "";
  });
  html = html.replace(/<link rel="preload" as="script"[^>]*\/?>/g, "");
  if (!srcs.length) return html;
  // Espera al primer pintado con contenido (FCP) y luego pide los scripts.
  // Respaldo: pestaña oculta (no pinta), navegador sin PerformanceObserver
  // o FCP que no llega → se cargan igual en ≤1,5 s.
  const loader =
    `(function(){var s=${JSON.stringify(srcs)},d=0;function g(){if(d)return;d=1;` +
    `for(var i=0;i<s.length;i++){var e=document.createElement("script");e.src=s[i];e.async=true;document.head.appendChild(e)}}` +
    `try{if(document.visibilityState==="hidden")throw 0;new PerformanceObserver(function(l,o){` +
    `if(l.getEntriesByName("first-contentful-paint").length){o.disconnect();setTimeout(g,0)}}).observe({type:"paint",buffered:true})}` +
    `catch(_){setTimeout(g,0)}setTimeout(g,1500)})();`;
  return html.replace("</body>", `<script>${loader}</script></body>`);
}

/* ── 2. CSP con hashes ── */
const inlineScript = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;

function withCsp(html) {
  const hashes = new Set();
  for (const [, attrs, body] of html.matchAll(inlineScript)) {
    // Los bloques de datos (JSON-LD) no se ejecutan: CSP no los evalúa.
    if (/type=["']?application\/(ld\+)?json/.test(attrs) || !body) continue;
    hashes.add(`'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`);
  }
  const csp = [
    "default-src 'self'",
    `script-src 'self' ${[...hashes].join(" ")} ${analyticsSrc}`.trim(),
    "style-src 'self' 'unsafe-inline'", // atributos style (variables CSS de escalonado)
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self' ${formOrigin} ${analyticsSrc}`.trim(),
    `form-action 'self' ${formOrigin}`,
    "base-uri 'self'",
    "object-src 'none'",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
  html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, "");
  return html.replace(/<head>/, `<head><meta http-equiv="Content-Security-Policy" content="${csp}">`);
}

let files = 0;
for await (const file of htmlFiles(OUT)) {
  const html = await readFile(file, "utf8");
  await writeFile(file, withCsp(deferHydration(html)));
  files++;
}
console.log(`Post-build: hidratación diferida y CSP aplicadas en ${files} archivos HTML.`);

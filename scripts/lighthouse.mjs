// Lighthouse (móvil por defecto y escritorio) sobre el build estático.
// Uso: npm run build && npm start   (en otra terminal)  →  npm run lighthouse
import { mkdir, writeFile } from "node:fs/promises";
import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:3000/";
const outDir = process.argv[3] ?? "docs/lighthouse";
const chrome = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

await mkdir(outDir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: chrome, args: ["--remote-debugging-port=9333", ...(url.startsWith("https://localhost") ? ["--ignore-certificate-errors"] : [])] });
const summary = {};
try {
  // mobile           → simulación (Lantern), como PageSpeed Insights.
  // mobile-aplicado  → mismo perfil 4G lento + CPU 4x, aplicado de verdad en Chrome.
  //   En localhost Chrome informa los tamaños descomprimidos y la simulación
  //   sobrestima la descarga; la corrida aplicada mide los bytes reales (Brotli).
  // desktop          → perfil de escritorio de Lighthouse.
  const runs = {
    mobile: { extends: "lighthouse:default" },
    // Diagnóstico: qué pesa en el LCP simulado
    "diag-sin-js": { extends: "lighthouse:default", settings: { blockedUrlPatterns: ["*.js"] } },
    "diag-sin-fuentes": { extends: "lighthouse:default", settings: { blockedUrlPatterns: ["*.woff2"] } },
    "mobile-aplicado": {
      extends: "lighthouse:default",
      settings: {
        throttlingMethod: "devtools",
        throttling: { requestLatencyMs: 562.5, downloadThroughputKbps: 1474.56, uploadThroughputKbps: 675, cpuSlowdownMultiplier: 4 },
      },
    },
    desktop: {
      extends: "lighthouse:default",
      settings: {
        formFactor: "desktop",
        screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false },
        throttlingMethod: "simulate",
        throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
      },
    },
  };
  const only = process.argv[4]?.split(","); // p. ej. "mobile" o "mobile,desktop"
  for (const [formFactor, config] of Object.entries(runs)) {
    if (only && !only.includes(formFactor)) continue;
    const flags = { port: 9333, output: ["html", "json"], logLevel: "error" };
    // Lighthouse falla a veces en la primera corrida (NO_NAVSTART): reintentar
    let result;
    for (let attempt = 0; attempt < 3; attempt++) {
      result = await lighthouse(url, flags, config);
      if (!result.lhr.runtimeError) break;
      console.error(`Reintentando ${formFactor}: ${result.lhr.runtimeError.code}`);
    }
    const { lhr, report } = result;
    const [html, json] = report;
    await writeFile(`${outDir}/${formFactor}.html`, html);
    await writeFile(`${outDir}/${formFactor}.json`, json);
    const a = lhr.audits;
    summary[formFactor] = {
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories["best-practices"].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
      LCP: a["largest-contentful-paint"].displayValue,
      CLS: a["cumulative-layout-shift"].displayValue,
      TBT: a["total-blocking-time"].displayValue,
      FCP: a["first-contentful-paint"].displayValue,
    };
    const failing = Object.values(a)
      .filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== "informative" && x.scoreDisplayMode !== "notApplicable")
      .map((x) => `${x.id} (${x.score})`);
    summary[formFactor].failing = failing;
  }
} finally {
  await browser.close();
}
await writeFile(`${outDir}/resumen.json`, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));

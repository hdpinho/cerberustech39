// Genera, con el logo OFICIAL (public/brand/*.svg, extraídos del PDF por
// scripts/extraer-logo.py): favicon, icono para iPhone, icono 512, logo para
// buscadores (JSON-LD) e imagen Open Graph. No recolorea el logo: usa la versión
// a color sobre blanco y la versión blanca sobre el navy de la mesa de trabajo
// del PDF (#001A4C), las dos composiciones oficiales.
// Uso: node scripts/gen-assets.mjs
import { readFile } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const chrome = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const NAVY_OFICIAL = "#001A4C";
const svg = async (n) => `data:image/svg+xml;base64,${(await readFile(`public/brand/${n}.svg`)).toString("base64")}`;
const fonts =
  '<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=JetBrains+Mono:wght@500&display=block" rel="stylesheet">';

const isoBlanco = await svg("isotipo-blanco");
const vertColor = await svg("logo-vertical-color");
const horBlanco = await svg("logo-horizontal-blanco");

// Icono cuadrado: isotipo blanco centrado sobre navy, con margen proporcional
const icono = (size, margen) => `<!doctype html><html><body style="margin:0">
  <div style="width:${size}px;height:${size}px;background:${NAVY_OFICIAL};display:flex;align-items:center;justify-content:center">
    <img src="${isoBlanco}" style="width:${Math.round(size * (1 - 2 * margen))}px;height:auto">
  </div></body></html>`;

// Logo para buscadores: vertical a color sobre blanco
const logoBuscadores = `<!doctype html><html><body style="margin:0">
  <div style="width:512px;height:512px;background:#fff;display:flex;align-items:center;justify-content:center">
    <img src="${vertColor}" style="width:420px;height:auto">
  </div></body></html>`;

const og = `<!doctype html><html><head>${fonts}<style>
html,body{margin:0;width:1200px;height:630px}
body{background:#040C33;background-image:radial-gradient(120% 90% at 15% 0%,#071A5F 0%,rgba(4,12,51,0) 62%);color:#fff;position:relative;overflow:hidden}
.wrap{position:absolute;left:80px;top:72px;right:80px;bottom:76px;display:flex;flex-direction:column;justify-content:space-between}
h1{font-family:'Chakra Petch';font-weight:700;font-size:74px;line-height:1.02;margin:0;letter-spacing:-.02em}
h1 span{color:#A2D9F9;display:block}
.tag{font-family:'JetBrains Mono';font-size:22px;color:rgba(255,255,255,.75)}
svg.c{position:absolute;right:0;top:0;opacity:.35}
</style></head><body>
<svg class="c" width="700" height="630" viewBox="0 0 700 630" fill="none" stroke="#A2D9F9" stroke-width="1.5">
<path d="M700 90H470L430 130H260"/><path d="M700 200H560L520 240H380L350 270H200"/><path d="M700 330H600L560 370H420"/>
<path d="M700 450H520L480 490H330"/><path d="M700 560H600L570 590H440"/>
<circle cx="260" cy="130" r="6" fill="#040C33"/><circle cx="200" cy="270" r="6" fill="#040C33"/><circle cx="420" cy="370" r="6" fill="#040C33"/><circle cx="330" cy="490" r="6" fill="#040C33"/>
</svg>
<div class="wrap">
  <img src="${horBlanco}" style="height:104px;width:auto;align-self:flex-start">
  <h1>Tecnología que trabaja.<span>Y que se defiende.</span></h1>
  <div class="tag">// construimos · protegemos · automatizamos — Caracas, Venezuela</div>
</div></body></html>`;

const browser = await puppeteer.launch({ executablePath: chrome });
try {
  const page = await browser.newPage();
  const foto = async (html, w, h, ruta) => {
    await page.setViewport({ width: w, height: h });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: ruta, clip: { x: 0, y: 0, width: w, height: h } });
    console.log("ok", ruta);
  };
  await foto(icono(32, 0.06), 32, 32, "public/favicon-32.png");
  await foto(icono(48, 0.07), 48, 48, "public/favicon-48.png");
  await foto(icono(180, 0.12), 180, 180, "public/apple-touch-icon.png");
  await foto(icono(512, 0.12), 512, 512, "public/icon-512.png");
  await foto(logoBuscadores, 512, 512, "public/brand/logo-512.png");
  await foto(og, 1200, 630, "public/og.png");
} finally {
  await browser.close();
}

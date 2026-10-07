// Genera favicon, apple-touch-icon, icono 512 e imagen Open Graph a partir
// del logo PROVISIONAL. Cuando llegue el logo oficial, reemplaza los PNG de
// public/ por los derivados de ./brand/perfil-1080.png y no ejecutes esto.
// Uso: node scripts/gen-assets.mjs
import { writeFile } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const chrome = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const fonts =
  '<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=JetBrains+Mono:wght@500&family=Inter:wght@400&display=block" rel="stylesheet">';

const monogram = (size, bg = "#071A5F", ink = "#FFFFFF") => `
<svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0H30L40 10V40H0Z" fill="${bg}"/>
  <text x="19" y="27.5" text-anchor="middle" font-family="Chakra Petch" font-weight="700" font-size="17" fill="${ink}">39</text>
</svg>`;

const iconPage = (size) => `<!doctype html><html><head>${fonts}<style>html,body{margin:0;background:transparent}</style></head><body>${monogram(size)}</body></html>`;

const ogPage = `<!doctype html><html><head>${fonts}<style>
html,body{margin:0;width:1200px;height:630px}
body{background:#040C33;background-image:radial-gradient(120% 90% at 15% 0%,#071A5F 0%,rgba(4,12,51,0) 62%);color:#fff;font-family:Inter;position:relative;overflow:hidden}
.wrap{position:absolute;left:80px;top:80px;right:80px;bottom:80px;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:20px}
.name{font-family:'Chakra Petch';font-weight:700;font-size:40px;letter-spacing:.08em}
.sub{font-family:'JetBrains Mono';font-size:18px;letter-spacing:.32em;color:#A2D9F9;margin-top:4px}
h1{font-family:'Chakra Petch';font-weight:700;font-size:76px;line-height:1.02;margin:0;letter-spacing:-.02em}
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
  <div class="brand">${monogram(72, "#A2D9F9", "#040C33")}<div><div class="name">CERBERUS</div><div class="sub">TECH 39</div></div></div>
  <h1>Tecnología que trabaja.<span>Y que se defiende.</span></h1>
  <div class="tag">// construimos · protegemos · automatizamos — Caracas, Venezuela</div>
</div></body></html>`;

const browser = await puppeteer.launch({ executablePath: chrome });
try {
  const page = await browser.newPage();
  for (const [size, file] of [
    [32, "public/favicon-32.png"],
    [180, "public/apple-touch-icon.png"],
    [512, "public/icon-512.png"],
  ]) {
    await page.setViewport({ width: size, height: size });
    await page.setContent(iconPage(size), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: file, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
    console.log("ok", file);
  }
  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(ogPage, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "public/og.png" });
  console.log("ok public/og.png");
  await writeFile("public/icon.svg", monogram(40).trim() .replace('font-family="Chakra Petch"', 'font-family="Chakra Petch, Arial, sans-serif"'));
  console.log("ok public/icon.svg");
} finally {
  await browser.close();
}

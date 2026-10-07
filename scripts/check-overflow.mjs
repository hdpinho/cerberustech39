// Detecta desbordamiento horizontal en anchos de móvil y tablet.
// Uso: node scripts/check-overflow.mjs [url] [anchos]
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:3939/";
const widths = (process.argv[3] ?? "360,390,768,1024").split(",").map(Number);
const b = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
try {
  for (const w of widths) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: 844, isMobile: w < 768, hasTouch: w < 768 });
    await p.goto(url, { waitUntil: "load" });
    const res = await p.evaluate(() => {
      const wide = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.right > innerWidth + 1 && wide.length < 8) wide.push(`${el.tagName}.${String(el.className).slice(0, 70)} → ${Math.round(r.right)}`);
      }
      return { innerWidth, scrollWidth: document.documentElement.scrollWidth, wide };
    });
    console.log(w, JSON.stringify(res, null, 1));
    await p.close();
  }
} finally {
  await b.close();
}

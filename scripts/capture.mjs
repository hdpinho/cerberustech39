// Capturas por sección en escritorio y móvil con Chrome headless.
// Uso: node scripts/capture.mjs [url] [carpeta] [anchos separados por coma]
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:3939/";
const outDir = process.argv[3] ?? "docs/capturas";
const widths = (process.argv[4] ?? "1440,390").split(",").map(Number);
const chrome = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const sections = ["inicio", "nosotros", "servicios", "paquetes", "proceso", "confianza", "sectores", "proposito", "preguntas", "contacto"];

const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--hide-scrollbars"] });
try {
  for (const w of widths) {
    const page = await browser.newPage();
    const mobile = w < 768;
    await page.setViewport({ width: w, height: mobile ? 844 : 900, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
    await page.goto(url, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 2200)); // animaciones de entrada del hero
    const dir = `${outDir}/${w}`;
    await mkdir(dir, { recursive: true });

    // Revelar todo y desactivar el scroll suave para capturas estables
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      document.querySelectorAll("[data-reveal]").forEach((e) => e.setAttribute("data-shown", ""));
    });

    for (const [i, id] of sections.entries()) {
      const tall = await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - (id === "inicio" ? 0 : 68));
        return el.offsetHeight;
      }, id);
      if (!tall) continue;
      await new Promise((r) => setTimeout(r, id === "servicios" ? 3500 : 900)); // el ecosistema 3D se monta al acercarse
      const name = `${dir}/${String(i + 1).padStart(2, "0")}-${id}.png`;
      await page.screenshot({ path: name });
      console.log("ok", name);
    }
    // Footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: `${dir}/11-footer.png` });
    // Página completa
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: `${dir}/00-pagina-completa.png`, fullPage: true });
    await page.close();
  }
} finally {
  await browser.close();
}

// Verifica que las escenas 3D se monten, dibujen contenido y no generen errores.
// Uso: node scripts/verificar-3d.mjs [url] [carpetaCapturas]
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:3939/";
const dir = process.argv[3] ?? "docs/capturas/3d";
await mkdir(dir, { recursive: true });
const chrome = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const b = await puppeteer.launch({
  executablePath: chrome,
  args: ["--ignore-gpu-blocklist"], // GPU real: sin GPU las escenas no se cargan (respaldo estático)
});
try {
  for (const [w, h, movil] of [
    [1440, 900, false],
    [390, 844, true],
  ]) {
    const p = await b.newPage();
    const errores = [];
    p.on("pageerror", (e) => errores.push(String(e)));
    p.on("console", (m) => m.type() === "error" && errores.push(m.text().slice(0, 200)));
    await p.setViewport({ width: w, height: h, isMobile: movil, hasTouch: movil, deviceScaleFactor: movil ? 2 : 1 });
    await p.goto(url, { waitUntil: "load" });
    await espera(800);
    await p.mouse.move(10, 10); // primera interacción: despierta las escenas 3D
    await espera(4500);

    const estado = () =>
      p.evaluate(() =>
        [...document.querySelectorAll(".escena-3d")].map((e) => {
          const c = e.querySelector("canvas");
          return { lista: e.hasAttribute("data-lista"), lienzo: c ? `${c.width}x${c.height}` : null, rotulos: e.querySelectorAll(".rotulo-3d").length };
        }),
      );
    console.log(w, "hero:", JSON.stringify(await estado()));
    await p.screenshot({ path: `${dir}/${w}-hero.png` });

    // Ecosistema de servicios
    await p.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      document.querySelectorAll("[data-reveal]").forEach((e) => e.setAttribute("data-shown", ""));
      document.getElementById("servicios").scrollIntoView();
    });
    await espera(5000);
    console.log(w, "servicios:", JSON.stringify(await estado()));
    await p.screenshot({ path: `${dir}/${w}-servicios.png` });

    // Ecosistema: el nodo está justo debajo de su rótulo. Pasar el puntero → tooltip; clic → diálogo
    if (!movil) {
      const r = await p.evaluate(() => {
        const el = [...document.querySelectorAll(".rotulo-3d--codigo")].find((e) => e.textContent === "SEG");
        const b = el.getBoundingClientRect();
        return { x: b.left + b.width / 2, y: b.bottom + 16, codigo: el.textContent };
      });
      // El nodo orbita: se sigue unos instantes hasta acertar
      let tip = false;
      for (let k = 0; k < 12 && !tip; k++) {
        const q = await p.evaluate(() => {
          const el = [...document.querySelectorAll(".rotulo-3d--codigo")].find((e) => e.textContent === "SEG");
          const b = el.getBoundingClientRect();
          return { x: b.left + b.width / 2, y: b.bottom + 16 };
        });
        await p.mouse.move(q.x, q.y);
        await espera(120);
        tip = await p.evaluate(() => document.querySelector(".tip-3d")?.hasAttribute("data-visible"));
      }
      console.log(w, "tooltip al pasar sobre", r.codigo + ":", tip);
      await p.screenshot({ path: `${dir}/${w}-ecosistema-tooltip.png` });
      if (tip) {
        await p.mouse.down();
        await p.mouse.up();
        await espera(500);
        const titulo = await p.evaluate(() => (document.querySelector("dialog")?.open ? document.querySelector("#servicio-dialog-title")?.textContent : null));
        console.log(w, "clic en el nodo abre el diálogo:", titulo);
        await p.keyboard.press("Escape");
        await espera(400);
      }
    }

    // Arrastrar el globo (giro con inercia) y pasar el puntero por un nodo del ecosistema
    if (!movil) {
      await p.evaluate(() => window.scrollTo(0, 0));
      await espera(600);
      const box = await (await p.$("#inicio .lienzo-3d"))?.boundingBox();
      if (box) {
        await p.mouse.move(box.x + box.width * 0.4, box.y + box.height / 2);
        await p.mouse.down();
        for (let i = 1; i <= 8; i++) await p.mouse.move(box.x + box.width * 0.4 + i * 25, box.y + box.height / 2, { steps: 2 });
        await p.mouse.up();
        await espera(700);
        await p.screenshot({ path: `${dir}/${w}-hero-girado.png` });
      }
    }
    await p.close();
    // Sin interacción: el globo debe montarse solo tras la espera (~6,5 s)
    const q = await b.newPage();
    q.on("pageerror", (e) => errores.push(String(e)));
    await q.setViewport({ width: w, height: h, isMobile: movil, hasTouch: movil });
    await q.goto(url, { waitUntil: "load" });
    await espera(2500);
    const antes = await q.evaluate(() => document.querySelector("#inicio .escena-3d").hasAttribute("data-lista"));
    await espera(7000);
    const despues = await q.evaluate(() => document.querySelector("#inicio .escena-3d").hasAttribute("data-lista"));
    console.log(w, "sin interacción → montado a los 2,5 s:", antes, "| a los 9,5 s:", despues);
    await q.close();
    console.log(w, "errores:", errores.length ? errores : "ninguno");
  }
} finally {
  await b.close();
}

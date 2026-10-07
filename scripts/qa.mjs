// QA funcional del build estático: revelados, anclas, teclado, diálogo y errores.
// Uso: npm run build && npm start (otra terminal) → node scripts/qa.mjs http://localhost:3000/
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:3000/";
const b = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let fallos = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? "OK   " : "FALLO"} ${msg}`);
  if (!cond) fallos++;
};

try {
  const p = await b.newPage();
  const errores = [];
  p.on("pageerror", (e) => errores.push(String(e)));
  p.on("console", (m) => m.type() === "error" && errores.push(m.text()));
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(url, { waitUntil: "load" });
  await espera(1200);

  // 1. Revelados: todos se muestran al recorrer la página
  const total = await p.evaluate(() => document.querySelectorAll("[data-reveal]").length);
  for (let y = 0; y < (await p.evaluate(() => document.body.scrollHeight)); y += 400) {
    await p.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
    await espera(110);
  }
  await espera(800);
  const vistos = await p.evaluate(() => document.querySelectorAll("[data-shown]").length);
  ok(vistos === total, `revelados ${vistos}/${total}`);

  // 2. Anclas de la navegación: aterrizan bajo la barra
  await espera(5000); // tras la medición ociosa de secciones
  for (const id of ["servicios", "paquetes", "proceso", "nosotros", "contacto"]) {
    await p.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await espera(300);
    await p.click(`header nav a[href="#${id}"]`);
    await espera(1700);
    const top = await p.evaluate((id) => Math.round(document.getElementById(id).getBoundingClientRect().top), id);
    ok(top >= 0 && top <= 90, `ancla #${id} (top ${top}px)`);
  }

  // 3. Teclado: saltar al contenido, diálogo (Enter abre, Escape cierra y devuelve el foco)
  await p.goto(url, { waitUntil: "load" }); // foco desde el principio del documento
  await espera(1500);
  await p.keyboard.press("Tab");
  ok((await p.evaluate(() => document.activeElement.textContent)) === "Saltar al contenido", "primer Tab: saltar al contenido");
  await p.focus("#servicios article button");
  await p.keyboard.press("Enter");
  await espera(400);
  ok(await p.evaluate(() => document.querySelector("dialog").open), "Enter abre el diálogo de servicio");
  await p.keyboard.press("Escape");
  await espera(400);
  ok(!(await p.evaluate(() => document.querySelector("dialog").open)), "Escape cierra el diálogo");
  ok(await p.evaluate(() => document.activeElement.closest("#servicios article") !== null), "el foco vuelve a la tarjeta");

  // 4. Acordeón
  await p.focus("#preguntas summary");
  await p.keyboard.press("Enter");
  ok(await p.evaluate(() => document.querySelector("#preguntas details").open), "Enter abre una pregunta frecuente");

  // 5. Errores de consola
  ok(errores.length === 0, `consola sin errores${errores.length ? ": " + errores.join(" | ") : ""}`);
} finally {
  await b.close();
}
console.log(fallos ? `\n${fallos} fallo(s)` : "\nTodo correcto");
process.exit(fallos ? 1 : 0);

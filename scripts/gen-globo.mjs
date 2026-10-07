// Genera los puntos de tierra del globo 3D del hero a partir de Natural Earth
// (world-atlas, 1:110m). Reparte puntos uniformes sobre la esfera (espiral de
// Fibonacci) y conserva los que caen en tierra. Resultado: lib/three/puntosTierra.ts
// (lat/lon cuantizados en Int16, base64), que solo se descarga junto con el globo.
// Uso: node scripts/gen-globo.mjs [numeroDePuntosEnLaEsfera]
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const N = Number(process.argv[2] ?? 16000);
const topo = JSON.parse(await readFile(require.resolve("world-atlas/land-110m.json"), "utf8"));
const tierra = feature(topo, topo.objects.land);

// Anillos [lon, lat] de todos los polígonos, con su caja para descartar rápido
const poligonos = [];
for (const f of tierra.features) {
  const g = f.geometry;
  const lista = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  for (const anillos of lista) {
    const ext = anillos[0];
    let minX = 180, maxX = -180, minY = 90, maxY = -90;
    for (const [x, y] of ext) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    poligonos.push({ anillos, minX, maxX, minY, maxY });
  }
}

function dentroAnillo([x, y], anillo) {
  let dentro = false;
  for (let i = 0, j = anillo.length - 1; i < anillo.length; j = i++) {
    const [xi, yi] = anillo[i];
    const [xj, yj] = anillo[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}

function esTierra(p) {
  for (const pol of poligonos) {
    if (p[0] < pol.minX || p[0] > pol.maxX || p[1] < pol.minY || p[1] > pol.maxY) continue;
    if (!dentroAnillo(p, pol.anillos[0])) continue;
    if (pol.anillos.slice(1).some((hueco) => dentroAnillo(p, hueco))) continue;
    return true;
  }
  return false;
}

const oro = Math.PI * (3 - Math.sqrt(5));
const datos = [];
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lon = ((((i * oro * 180) / Math.PI) % 360) + 540) % 360 - 180;
  if (lat < -60) continue; // sin Antártida: limpia el polo sur del globo
  if (esTierra([lon, lat])) datos.push(Math.round(lat * 100), Math.round(lon * 100));
}

const buf = Buffer.from(new Int16Array(datos).buffer);
const salida = `// Generado por scripts/gen-globo.mjs a partir de Natural Earth (world-atlas 1:110m, dominio público).
// ${datos.length / 2} puntos de tierra: pares [lat, lon] × 100 en Int16, codificados en base64.
export const PUNTOS_TIERRA_B64 =
  "${buf.toString("base64")}";
`;
await writeFile("lib/three/puntosTierra.ts", salida);
console.log(`${datos.length / 2} puntos de tierra (${(buf.length / 1024).toFixed(1)} KB)`);

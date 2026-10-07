// Convierte las imágenes fuente (assets-src/imagenes/*.png|jpg) a AVIF y WebP en
// varios anchos (public/img) y genera lib/imagenes.ts con dimensiones, anchos y
// una miniatura difuminada (LQIP) para mostrar mientras carga.
// Uso: node scripts/optimizar-imagenes.mjs
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const ORIGEN = "assets-src/imagenes";
const DESTINO = "public/img";
const ANCHOS = [480, 800, 1200, 1600, 2000];

await mkdir(DESTINO, { recursive: true });
const manifiesto = {};

for (const archivo of (await readdir(ORIGEN)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort()) {
  const nombre = basename(archivo, extname(archivo));
  const ruta = join(ORIGEN, archivo);
  const meta = await sharp(ruta).metadata();
  const anchos = ANCHOS.filter((w) => w <= meta.width);
  for (const w of anchos) {
    const base = sharp(ruta).resize({ width: w });
    await base.clone().avif({ quality: 48, effort: 6 }).toFile(join(DESTINO, `${nombre}-${w}.avif`));
    await base.clone().webp({ quality: 74, effort: 6 }).toFile(join(DESTINO, `${nombre}-${w}.webp`));
  }
  const lqip = await sharp(ruta).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  manifiesto[nombre] = {
    ancho: meta.width,
    alto: meta.height,
    anchos,
    lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
  };
  console.log("ok", nombre, anchos.join(","));
}

await writeFile(
  "lib/imagenes.ts",
  `// Generado por scripts/optimizar-imagenes.mjs. No editar a mano.
export interface ImagenOptimizada {
  ancho: number;
  alto: number;
  anchos: number[];
  lqip: string;
}

export const IMAGENES = ${JSON.stringify(manifiesto, null, 2)} satisfies Record<string, ImagenOptimizada>;

export type NombreImagen = keyof typeof IMAGENES;
`,
);
console.log("Manifiesto: lib/imagenes.ts");

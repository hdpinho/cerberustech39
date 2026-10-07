/**
 * Creación del renderer WebGL de cada escena.
 *
 * El motor viz3d de Prometheus comparte un solo contexto y copia cada escena a un
 * lienzo 2D: es lo óptimo para tableros con muchos gráficos que casi no se mueven.
 * Aquí hay dos escenas con animación continua y casi nunca visibles a la vez; la
 * copia por cuadro obliga a sincronizar la GPU (~13 ms por cuadro medidos), así que
 * cada escena dibuja directamente en su propio lienzo WebGL.
 */
import { SRGBColorSpace, WebGLRenderer } from "three";
import { forzado } from "./soporte";

/** Lanza si el navegador no ofrece WebGL acelerado: el envoltorio conserva el respaldo estático. */
export function crearRenderer(lienzo: HTMLCanvasElement): WebGLRenderer {
  const r = new WebGLRenderer({
    canvas: lienzo,
    antialias: true,
    alpha: true,
    powerPreference: "default",
    failIfMajorPerformanceCaveat: !forzado(),
  });
  r.outputColorSpace = SRGBColorSpace;
  r.setClearColor(0x000000, 0);
  return r;
}

/** Cede el hilo principal entre fases de construcción (tareas cortas = sin bloqueos largos). */
export function ceder(): Promise<void> {
  const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  return s?.yield ? s.yield() : new Promise((r) => setTimeout(r, 0));
}

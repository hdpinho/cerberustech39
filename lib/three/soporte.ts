/**
 * ¿Merece la pena cargar las escenas 3D en este equipo?
 *
 * Se consulta ANTES de descargar Three.js (~150 KB). No se cargan si:
 * - el navegador solo puede dibujar WebGL por software (sin GPU, máquinas
 *   virtuales, equipos muy antiguos): `failIfMajorPerformanceCaveat` lo detecta.
 *   Ahí cada cuadro costaría decenas de milisegundos de CPU; el respaldo estático
 *   es mejor experiencia;
 * - el usuario activó el ahorro de datos.
 *
 * `?3d=forzar` en la URL omite la comprobación (solo para pruebas y capturas).
 */
export function forzado(): boolean {
  try {
    return new URLSearchParams(location.search).get("3d") === "forzar";
  } catch {
    return false;
  }
}

export function puedeUsar3D(): boolean {
  if (forzado()) return true;
  const con = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (con?.saveData) return false;
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
      c.getContext("webgl", { failIfMajorPerformanceCaveat: true })) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext(); // libera el contexto de prueba al instante
    return true;
  } catch {
    return false;
  }
}

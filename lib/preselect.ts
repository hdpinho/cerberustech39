import type { Service } from "@/content/types";

export const PRESELECT_EVENT = "cerberus:preselect";

export interface PreselectDetail {
  service: Service["code"];
  packageName?: string;
}

// El formulario se carga de forma diferida: si aún no está montado cuando se
// pulsa "Solicitar cotización", la selección queda pendiente hasta que lo esté.
let pending: PreselectDetail | null = null;

/** Avisa al formulario de contacto qué servicio (y paquete) dejar marcado. */
export function preselectService(service: Service["code"], packageName?: string) {
  pending = { service, packageName };
  window.dispatchEvent(new CustomEvent<PreselectDetail>(PRESELECT_EVENT, { detail: pending }));
}

/** Devuelve (y consume) la selección pendiente, si la hay. */
export function takePendingPreselect(): PreselectDetail | null {
  const p = pending;
  pending = null;
  return p;
}

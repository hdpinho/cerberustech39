"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { DatosGlobo } from "@/lib/three/EscenaGlobo";
import type { DatosEcosistema } from "@/lib/three/EscenaEcosistema";

type Props =
  | { tipo: "globo"; datos: DatosGlobo; alSeleccionar?: never }
  | { tipo: "ecosistema"; datos: DatosEcosistema; alSeleccionar?: (codigo: string) => void };

/** Si el usuario no interactúa, la escena se monta tras este tiempo desde la carga. */
const ESPERA_SIN_INTERACCION_MS = 6500;

interface EscenaViva {
  liberar(): void;
  fijarMovimientoReducido(r: boolean): void;
}

/**
 * Envoltorio React de una escena 3D. Three.js (~150 KB) no está en la carga
 * inicial: se descarga cuando el navegador queda ocioso tras el primer pintado y
 * la escena está cerca de la pantalla. Mientras tanto (o si no hay WebGL) se ve
 * el respaldo estático, y la escena aparece con un fundido corto.
 */
export function Escena3D({
  className = "",
  respaldo,
  etiqueta,
  ...props
}: Props & { className?: string; respaldo?: ReactNode; etiqueta: string }) {
  const host = useRef<HTMLDivElement>(null);
  const escena = useRef<EscenaViva | null>(null);
  const alSel = useRef(props.alSeleccionar);
  const [lista, setLista] = useState(false);

  useEffect(() => {
    alSel.current = props.alSeleccionar;
  });

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let vivo = true;
    let idle = 0;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const montar = async () => {
      // Sin GPU o con ahorro de datos: ni siquiera se descarga Three.js
      const { puedeUsar3D } = await import("@/lib/three/soporte");
      if (!vivo || !puedeUsar3D()) return;
      try {
        let e: EscenaViva & { montar(): Promise<void> };
        if (props.tipo === "globo") {
          const { EscenaGlobo } = await import("@/lib/three/EscenaGlobo");
          if (!vivo) return;
          e = new EscenaGlobo(el, props.datos, { reducido: mq.matches });
        } else {
          const { EscenaEcosistema } = await import("@/lib/three/EscenaEcosistema");
          if (!vivo) return;
          e = new EscenaEcosistema(el, props.datos, (c) => alSel.current?.(c), { reducido: mq.matches });
        }
        escena.current = e;
        await e.montar(); // en fases cortas; lanza si no hay WebGL
        if (vivo) setLista(true);
      } catch {
        // Sin WebGL utilizable: se queda el respaldo estático
        escena.current?.liberar();
        escena.current = null;
      }
    };

    // Cuándo montar: la escena debe estar cerca de la pantalla Y la página "despierta":
    // con la primera interacción (mover el ratón, tocar, desplazar, teclado) o, si el
    // usuario solo mira, unos segundos después de cargar. Así la evaluación de Three.js
    // nunca compite con el contenido inicial ni con la hidratación.
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    let cerca = false;
    let despierta = false;
    let iniciado = false;
    const intentar = () => {
      if (iniciado || !cerca || !despierta) return;
      iniciado = true;
      idle = ric(() => void montar(), { timeout: 1500 }) as number;
    };
    const eventos = ["pointermove", "pointerdown", "scroll", "keydown", "touchstart"] as const;
    const despertar = () => {
      despierta = true;
      eventos.forEach((ev) => window.removeEventListener(ev, despertar));
      intentar();
    };
    eventos.forEach((ev) => window.addEventListener(ev, despertar, { passive: true, once: true }));
    const espera = window.setTimeout(despertar, ESPERA_SIN_INTERACCION_MS);

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        cerca = true;
        intentar();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);

    const alCambiar = () => escena.current?.fijarMovimientoReducido(mq.matches);
    mq.addEventListener("change", alCambiar);

    return () => {
      vivo = false;
      io.disconnect();
      window.clearTimeout(espera);
      eventos.forEach((ev) => window.removeEventListener(ev, despertar));
      (window.cancelIdleCallback ?? window.clearTimeout)(idle);
      mq.removeEventListener("change", alCambiar);
      escena.current?.liberar();
      escena.current = null;
    };
    // La escena se crea una vez por tipo; los datos son estáticos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tipo]);

  return (
    <div className={`escena-3d ${className}`} data-lista={lista || undefined} role="img" aria-label={etiqueta}>
      {respaldo ? (
        <div className="escena-3d__respaldo" aria-hidden="true">
          {respaldo}
        </div>
      ) : null}
      <div ref={host} className="escena-3d__host" />
    </div>
  );
}

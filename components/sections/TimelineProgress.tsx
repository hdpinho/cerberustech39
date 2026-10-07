"use client";

import { useEffect, useRef } from "react";

/**
 * Trazo de la línea de tiempo ligado al scroll. Se anima solo clip-path
 * mediante WAAPI + `scroll()` de Motion (usa ScrollTimeline nativo cuando
 * existe, así corre fuera del hilo principal). Motion se importa bajo
 * demanda para no pesar en la carga inicial.
 */
export function TimelineProgress({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const list = el?.closest("ol");
    if (!el || !list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // línea completa, estática

    // Mientras Motion no ha cargado, el trazo arranca oculto (sin salto visual).
    el.style.clipPath = "inset(0 0 100% 0)";
    let cancel: (() => void) | undefined;
    let alive = true;
    // Motion se descarga solo cuando la sección se acerca: fuera de la carga inicial.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        import("motion").then(({ scroll }) => {
          if (!alive) return;
          // Lineal: el progreso lo marca el scroll del usuario, no una curva.
          // Solo se escribe clip-path (sin layout); Motion agrupa las lecturas por cuadro.
          cancel = scroll(
            (p: number) => {
              el.style.clipPath = `inset(0 0 ${((1 - p) * 100).toFixed(2)}% 0)`;
            },
            { target: list, offset: ["start 75%", "end 55%"] },
          );
        });
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(list);
    return () => {
      alive = false;
      io.disconnect();
      cancel?.();
    };
  }, []);

  return <span ref={ref} aria-hidden="true" className={className} />;
}

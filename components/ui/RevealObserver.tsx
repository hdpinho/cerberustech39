"use client";

import { useEffect } from "react";

/**
 * Un solo IntersectionObserver para toda la página. Marca cada
 * [data-reveal] con [data-shown] la primera vez que entra en pantalla
 * y deja de observarlo: los revelados ocurren una sola vez.
 */
export function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-shown", "");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // content-visibility: auto estima la altura de las secciones aún no vistas,
  // y un salto de ancla largo (p. ej. a #contacto) aterrizaría desplazado.
  // En un momento ocioso tras la carga se renderizan todas una vez; gracias a
  // `contain-intrinsic-size: auto` el navegador recuerda su tamaño real.
  // Se mide una sección por cada momento ocioso: muchas tareas cortas en vez de
  // un solo layout de toda la página (que en un móvil modesto bloquea ~0,5 s).
  useEffect(() => {
    const secciones = Array.from(document.querySelectorAll<HTMLElement>(".cv-auto"));
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancelar = window.cancelIdleCallback ?? window.clearTimeout;
    let id = 0;
    let i = 0;
    const siguiente = () => {
      const s = secciones[i++];
      if (!s) return;
      s.style.contentVisibility = "visible";
      void s.offsetHeight; // layout de esta sección: el navegador recuerda su tamaño real
      requestAnimationFrame(() => {
        s.style.contentVisibility = "";
        id = idle(siguiente, { timeout: 4000 }) as number;
      });
    };
    // Empieza tarde: primero el contenido y las escenas 3D
    const inicio = window.setTimeout(() => (id = idle(siguiente, { timeout: 4000 }) as number), 4000);
    return () => {
      window.clearTimeout(inicio);
      cancelar(id);
    };
  }, []);

  return null;
}

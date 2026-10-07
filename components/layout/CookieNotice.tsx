"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

const KEY = "ct39-aviso-analitica";

/**
 * Aviso informativo: solo se monta si la analítica está activada
 * (ver layout). Plausible y Umami no usan cookies de seguimiento.
 */
export function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      setShow(!localStorage.getItem(KEY));
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* sin almacenamiento: el aviso volverá a mostrarse */
    }
    setShow(false);
  };

  return (
    <div role="region" aria-label="Aviso de privacidad" className="fixed inset-x-3 bottom-3 z-50 sm:right-auto sm:left-4 sm:max-w-md">
      <div className="bevel bevel-sm on-dark flex items-start gap-3 p-4 text-sm text-white/85 [--bevel-bg:var(--color-deep)] [--bevel-border:rgb(162_217_249/0.3)]">
        <p>
          Usamos analítica sin cookies de seguimiento para saber qué secciones son útiles.{" "}
          <a href="/privacidad/" className="text-cyan underline underline-offset-2">
            Más información
          </a>
          .
        </p>
        <button type="button" onClick={dismiss} className="press -m-2 inline-flex h-10 w-10 shrink-0 items-center justify-center" aria-label="Cerrar aviso">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

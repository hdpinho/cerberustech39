"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";

// react-hook-form + zod viven en su propio chunk: no se descargan en la carga inicial.
const ContactForm = lazy(() => import("./ContactForm").then((m) => ({ default: m.ContactForm })));

/** Monta el formulario cuando la sección se acerca a la pantalla (o al recibir foco). */
export function ContactFormLazy(props: ComponentProps<typeof ContactForm>) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || load) return;
    // Si alguien llega con #contacto o desde "Solicitar cotización", cargar ya.
    const onHash = () => location.hash === "#contacto" && setLoad(true);
    onHash();
    window.addEventListener("hashchange", onHash);
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setLoad(true), { rootMargin: "800px 0px" });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("hashchange", onHash);
    };
  }, [load]);

  const placeholder = <div aria-hidden="true" className="min-h-[46rem] sm:min-h-[38rem]" />;

  return <div ref={ref}>{load ? <Suspense fallback={placeholder}>{<ContactForm {...props} />}</Suspense> : placeholder}</div>;
}

"use client";

import { ArrowRight, Check, Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { Escena3D } from "@/components/three/Escena3D";
import { Icon } from "@/components/ui/Icon";
import { Chip, Container, Section, SectionHeader, buttonClass } from "@/components/ui/primitives";
import type { Service, SiteContent } from "@/content/types";
import { preselectService } from "@/lib/preselect";

export function Services({ data }: { data: SiteContent["services"] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Service | null>(null);
  const [closing, setClosing] = useState(false);

  const open = (s: Service) => {
    setActive(s);
    setClosing(false);
    dialogRef.current?.showModal();
  };

  // Salida más rápida que la entrada (160 ms vs 240 ms).
  const close = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setClosing(true);
    window.setTimeout(() => {
      dialogRef.current?.close();
      setClosing(false);
    }, reduce ? 0 : 160);
  };

  return (
    <Section id="servicios" tone="surface" labelledBy="servicios-title">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <SectionHeader id="servicios-title" label={data.label} title={data.title} intro={data.intro} className="lg:col-span-6" />
          {/* Ecosistema 3D: las seis líneas en órbita. Equivalente accesible: las tarjetas de abajo */}
          <div data-reveal style={{ "--i": 2 } as React.CSSProperties} className="lg:col-span-6">
            <div className="marco-hud marco-hud--tech">
              <div className="bevel on-dark relative overflow-hidden [--bevel:22px] [--bevel-bg:var(--color-deep)] [--bevel-border:rgb(26_122_179/0.6)]">
                <div className="fondo-reticula opacity-70" aria-hidden="true" />
                <Escena3D
                  tipo="ecosistema"
                  datos={{ servicios: data.list.map((s) => ({ codigo: s.code, titulo: s.title, beneficio: s.benefit })) }}
                  alSeleccionar={(codigo) => {
                    const s = data.list.find((x) => x.code === codigo);
                    if (s) open(s);
                  }}
                  etiqueta={data.ecosistema.etiqueta}
                  className="h-[300px] sm:h-[380px] lg:h-[420px]"
                />
                <p aria-hidden="true" className="mono-label pointer-events-none absolute right-4 bottom-3 left-4 text-[0.7rem] text-cyan/70">
                  {"// "}
                  <span className="[@media(pointer:coarse)]:hidden">{data.ecosistema.ayuda}</span>
                  <span className="hidden [@media(pointer:coarse)]:inline">{data.ecosistema.ayudaTactil}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {data.list.map((s, i) => (
            <li key={s.code} data-reveal style={{ "--i": i % 3 } as React.CSSProperties}>
              <article className="card-lift bevel group flex h-full flex-col p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="bg-navy px-2 py-1 font-mono text-xs font-medium tracking-[0.12em] text-cyan">{s.code}</span>
                  <Icon name={s.icon} className="h-6 w-6 text-tech" />
                </div>
                <h3 className="mt-6 text-xl leading-tight font-bold text-navy">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/70">{s.benefit}</p>
                <ul className="mt-5 space-y-2 text-[0.9375rem] text-ink/80">
                  {s.items.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-tech" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {s.stack.slice(0, 4).map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                  {s.stack.length > 4 ? <Chip>+{s.stack.length - 4}</Chip> : null}
                </div>
                {/* El botón cubre toda la tarjeta (::after), así cualquier clic abre el detalle */}
                <button
                  type="button"
                  onClick={() => open(s)}
                  aria-haspopup="dialog"
                  className="mt-auto flex items-center gap-1.5 pt-7 font-display text-sm font-semibold text-navy outline-none after:absolute after:inset-0 after:content-['']"
                >
                  {data.more}
                  <span className="sr-only">: {s.title}</span>
                  <Plus
                    className="h-4 w-4 text-tech transition-transform duration-200 ease-[var(--ease-out)] group-hover:rotate-90"
                    aria-hidden="true"
                  />
                </button>
              </article>
            </li>
          ))}
        </ul>
      </Container>

      <dialog
        ref={dialogRef}
        aria-labelledby="servicio-dialog-title"
        data-closing={closing || undefined}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="service-dialog m-auto outline-none w-[min(40rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-visible bg-transparent p-0 backdrop:bg-deep/70 backdrop:backdrop-blur-sm"
      >
        {active ? (
          <div className="bevel max-h-[calc(100dvh-2rem)] overflow-y-auto p-7 [--bevel:22px] sm:p-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <span className="bg-navy px-2 py-1 font-mono text-xs font-medium tracking-[0.12em] text-cyan">{active.code}</span>
                <h3 id="servicio-dialog-title" className="mt-4 text-2xl leading-tight font-bold text-navy sm:text-3xl">
                  {active.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={close}
                className="press -mt-1 -mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center text-navy"
                aria-label={data.close}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 text-lg leading-relaxed text-ink/75">{active.benefit}</p>
            <ul className="mt-7 space-y-3">
              {active.items.map((item) => (
                <li key={item} className="flex gap-3 text-ink/85">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-tech" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mono-label mt-8 text-navy">
              <span aria-hidden="true" className="text-tech">
                //{" "}
              </span>
              {active.stackLabel.toLowerCase()}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {active.stack.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <a
              href="#contacto"
              onClick={() => {
                preselectService(active.code);
                dialogRef.current?.close();
              }}
              className={buttonClass("primary", "mt-9 w-full sm:w-auto")}
            >
              {data.quote}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        ) : null}
      </dialog>
    </Section>
  );
}

import { ArrowRight } from "lucide-react";
import { CircuitField, Watermark } from "@/components/brand/Circuit";
import { Escena3D } from "@/components/three/Escena3D";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink, Container, MonoLabel } from "@/components/ui/primitives";
import type { SiteContent } from "@/content/types";

/**
 * Lo que se ve antes de que cargue el globo 3D (o si el equipo no tiene GPU):
 * una esfera de puntos holográfica hecha solo con CSS, con la misma silueta y
 * posición que el globo, para que la escena aparezca encima sin saltos.
 */
function GloboRespaldo() {
  return (
    <div className="globo-respaldo absolute inset-0">
      <div className="globo-respaldo__plataforma" />
      <div className="globo-respaldo__esfera">
        <div className="globo-respaldo__puntos" />
      </div>
    </div>
  );
}

export function Hero({ hero, pillars }: { hero: SiteContent["hero"]; pillars: SiteContent["guardians"]["pillars"] }) {
  const g = hero.globo;
  return (
    <section
      id="inicio"
      data-tone="dark"
      aria-labelledby="hero-title"
      className="bg-dark on-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[var(--header-h)]"
    >
      {/* Fondo: retícula holográfica, circuito y marca de agua, decorativos */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="fondo-reticula" />
        <CircuitField className="absolute inset-y-0 left-0 h-full w-full -scale-x-100 opacity-35 lg:w-[55%]" />
        <Watermark className="absolute top-1/2 left-[-18%] h-[110%] max-h-[52rem] w-auto -translate-y-1/2 text-cyan/[0.04]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-deep to-transparent" />
      </div>

      <Container className="grid flex-1 items-center gap-6 py-12 sm:py-16 lg:grid-cols-12 lg:gap-4">
        <div className="lg:col-span-7">
          <div className="hero-in">
            <MonoLabel dark>{hero.label}</MonoLabel>
          </div>
          <h1
            id="hero-title"
            className="mt-5 text-[2.6rem] leading-[1.02] font-bold tracking-[-0.02em] text-white xs:text-[3rem] sm:text-[4rem] lg:text-[3.85rem] xl:text-[4.35rem]"
          >
            <span className="hero-line" style={{ "--i": 0 } as React.CSSProperties}>
              {hero.title[0]}
            </span>
            <span className="hero-line texto-holo" style={{ "--i": 1 } as React.CSSProperties}>
              {hero.title[1]}
            </span>
          </h1>
          <p
            className="hero-line mt-6 max-w-[36rem] text-lg leading-relaxed text-white/75 sm:text-xl"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            {hero.subtitle}
          </p>
          <div className="hero-in mt-9 flex flex-col gap-3 xs:flex-row" style={{ "--i": 3 } as React.CSSProperties}>
            <ButtonLink href="#contacto" variant="primaryDark">
              {hero.primaryCta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#servicios" variant="ghostDark">
              {hero.secondaryCta}
            </ButtonLink>
          </div>
        </div>

        {/* Globo holográfico 3D: sede y alcance real de la empresa */}
        <div className="hero-in relative lg:col-span-5 lg:-mr-10 xl:-mr-20" style={{ "--i": 4 } as React.CSSProperties}>
          <Escena3D
            tipo="globo"
            datos={{ sede: g.sede, destinos: g.destinos }}
            etiqueta={g.etiqueta}
            respaldo={<GloboRespaldo />}
            className="mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[30rem] lg:max-w-none"
          />
          <ul className="mono-label mx-auto mt-1 flex max-w-[30rem] flex-col items-center gap-1 text-center text-[0.72rem] text-white/70 lg:mt-[-1.5rem]">
            <li>
              <span aria-hidden="true" className="mr-1.5 inline-block h-2 w-2 bg-cyan align-middle" />
              {g.leyendaSede}
            </li>
            <li>
              <span aria-hidden="true" className="mr-1.5 inline-block h-2 w-2 rounded-full ring-1 ring-cyan align-middle" />
              {g.leyendaRemota}
            </li>
            <li aria-hidden="true" className="text-cyan/70 [@media(pointer:coarse)]:hidden">
              {"// "}
              {g.ayuda}
            </li>
          </ul>
        </div>
      </Container>

      {/* Franja de los tres pilares */}
      <div className="relative border-t border-cyan/15 bg-deep/40 backdrop-blur-[2px]">
        <Container>
          <ul className="grid divide-y divide-cyan/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {pillars.map((p, i) => (
              <li
                key={p.id}
                className="hero-in flex items-start gap-4 py-5 sm:px-6 sm:py-7 sm:first:pl-0 sm:last:pr-0"
                style={{ "--i": 5 + i } as React.CSSProperties}
              >
                <Icon name={p.icon} className="mt-0.5 h-5 w-5 shrink-0 text-cyan" />
                <div>
                  <p className="font-display text-base font-semibold text-white">{p.title}</p>
                  <p className="mt-1 text-sm leading-snug text-white/65">{p.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}

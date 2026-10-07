import { Icon } from "@/components/ui/Icon";
import { Imagen } from "@/components/ui/Imagen";
import { Container, Section, SectionHeader } from "@/components/ui/primitives";
import type { SiteContent } from "@/content/types";

/** Diagrama: un centro que vigila en tres direcciones (sin imitar el isotipo). */
function GuardianDiagram() {
  return (
    <svg viewBox="0 0 320 260" className="h-auto w-full max-w-[22rem]" aria-hidden="true" focusable="false">
      <g fill="none" stroke="var(--color-tech)" strokeWidth="1.25">
        <path d="M160 130V40" pathLength={1} className="circuit-trace" style={{ "--i": 0 } as React.CSSProperties} />
        <path d="M160 130L70 205" pathLength={1} className="circuit-trace" style={{ "--i": 1 } as React.CSSProperties} />
        <path d="M160 130L250 205" pathLength={1} className="circuit-trace" style={{ "--i": 2 } as React.CSSProperties} />
        <circle cx="160" cy="130" r="74" strokeDasharray="2 6" opacity="0.5" />
      </g>
      <path d="M134 104H178L186 112V156H134Z" fill="var(--color-navy)" />
      <path d="M150 130h20M160 120v20" stroke="var(--color-cyan)" strokeWidth="2" />
      {[
        [160, 40],
        [70, 205],
        [250, 205],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="16" fill="#fff" stroke="var(--color-navy)" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="5" fill="var(--color-tech)" />
        </g>
      ))}
    </svg>
  );
}

export function Guardians({ data }: { data: SiteContent["guardians"] }) {
  return (
    <Section id="nosotros" tone="light" labelledBy="guardianes-title">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader id="guardianes-title" label={data.label} title={data.title} intro={data.intro} />
          </div>
          <div className="flex justify-center lg:col-span-5 lg:justify-end" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            <GuardianDiagram />
          </div>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-20">
          {data.pillars.map((p, i) => (
            <li key={p.id} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <article className="bevel group flex h-full flex-col p-3 sm:p-3.5">
                <div className="marco-hud marco-hud--tech [--l:14px]">
                  <Imagen
                    nombre={p.imagen}
                    alt={p.imagenAlt}
                    sizes="(min-width: 1200px) 380px, (min-width: 768px) 32vw, calc(100vw - 2rem)"
                    className="recorte-bisel zoom-suave aspect-[3/2] [--bevel:14px]"
                  />
                </div>
                <div className="flex flex-1 flex-col px-4 pt-6 pb-5 sm:px-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center bg-surface text-tech">
                      <Icon name={p.icon} className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs text-navy/60" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-navy">{p.title}</h3>
                  <p className="mt-2 font-medium text-navy/85">{p.summary}</p>
                  <p className="mt-3 leading-relaxed text-ink/65">{p.detail}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

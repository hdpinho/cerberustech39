import { Isotipo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { Imagen } from "@/components/ui/Imagen";
import { Container, Section, SectionHeader } from "@/components/ui/primitives";
import type { SiteContent } from "@/content/types";

export function Guardians({ data }: { data: SiteContent["guardians"] }) {
  return (
    <Section id="nosotros" tone="light" labelledBy="guardianes-title">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader id="guardianes-title" label={data.label} title={data.title} intro={data.intro} />
          </div>
          <div className="flex justify-center lg:col-span-5 lg:justify-end" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            {/* El isotipo oficial: el guardián de tres cabezas que da nombre a la sección */}
            <Isotipo variante="color" alt={data.isotipoAlt} className="h-auto w-full max-w-[20rem] lg:max-w-[22rem]" />
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

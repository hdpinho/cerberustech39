import { Icon } from "@/components/ui/Icon";
import { Imagen } from "@/components/ui/Imagen";
import { Container, Section, SectionHeader } from "@/components/ui/primitives";
import type { SiteContent } from "@/content/types";

export function Sectors({ data }: { data: SiteContent["sectors"] }) {
  return (
    <Section id="sectores" tone="light" labelledBy="sectores-title">
      <Container>
        {/* Banner: la ciudad conectada, con el encabezado sobre la imagen */}
        <div data-reveal className="marco-hud marco-hud--tech">
          <div className="recorte-bisel relative isolate overflow-hidden bg-deep [--bevel:26px]">
            <Imagen
              nombre="sectores-ciudad"
              alt={data.imagenAlt}
              sizes="(min-width: 1200px) 1136px, calc(100vw - 2rem)"
              className="zoom-suave absolute inset-0 -z-10 h-full w-full"
              posicion="center 60%"
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-deep/95 via-deep/70 to-deep/10" />
            <div className="on-dark px-6 py-14 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
              <SectionHeader id="sectores-title" label={data.label} title={data.title} intro={data.intro} dark />
            </div>
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden bg-line ring-1 ring-line md:grid-cols-3 lg:grid-cols-6">
          {data.list.map((s, i) => (
            <li
              key={s.name}
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
              className="flex flex-col gap-4 bg-white p-5 sm:p-6"
            >
              <Icon name={s.icon} className="h-6 w-6 text-tech" />
              <span className="font-display text-[0.975rem] leading-snug font-semibold text-navy">{s.name}</span>
            </li>
          ))}
        </ul>

        <div className="mt-20 lg:mt-24">
          <h3 data-reveal className="text-2xl font-bold text-navy sm:text-3xl">
            {data.trainingTitle}
          </h3>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {data.training.map((t, i) => (
              <li key={t.title} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <article className="bevel h-full p-7 [--bevel-bg:var(--color-surface)] [--bevel-border:var(--color-surface)]">
                  <Icon name={t.icon} className="h-6 w-6 text-tech" />
                  <h4 className="mt-5 text-lg font-bold text-navy">{t.title}</h4>
                  <p className="mt-2 leading-relaxed text-ink/70">{t.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

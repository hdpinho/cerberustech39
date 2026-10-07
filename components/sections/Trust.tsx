import { Icon } from "@/components/ui/Icon";
import { Imagen } from "@/components/ui/Imagen";
import { Container, Section, SectionHeader } from "@/components/ui/primitives";
import type { SiteContent } from "@/content/types";

export function Trust({ data }: { data: SiteContent["trust"] }) {
  const initials = data.leader.name
    .split(" ")
    .filter((w) => /^[A-ZÁÉÍÓÚÑ]/.test(w))
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <Section id="confianza" tone="dark" labelledBy="confianza-title">
      <div className="fondo-reticula" aria-hidden="true" />
      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <SectionHeader id="confianza-title" label={data.label} title={data.title} intro={data.intro} dark className="lg:col-span-7" />
          <div data-reveal style={{ "--i": 2 } as React.CSSProperties} className="lg:col-span-5">
            <div className="marco-hud mx-auto max-w-[26rem]">
              <Imagen
                nombre="confianza-candado"
                alt={data.imagenAlt}
                sizes="(min-width: 1024px) 416px, (min-width: 640px) 416px, calc(100vw - 2rem)"
                className="recorte-bisel zoom-suave aspect-[16/11] shadow-[0_0_60px_rgb(26_122_179/0.35)] lg:aspect-[4/5]"
                posicion="center 55%"
              />
            </div>
          </div>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-16">
          {data.reasons.map((r, i) => (
            <li key={r.title} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <article className="bevel h-full p-7 [--bevel-bg:rgb(10_22_78)] [--bevel-border:rgb(162_217_249/0.16)] sm:p-8">
                <Icon name={r.icon} className="h-7 w-7 text-cyan" />
                <h3 className="mt-6 text-xl font-bold text-white">{r.title}</h3>
                <p className="mt-2.5 leading-relaxed text-white/70">{r.body}</p>
              </article>
            </li>
          ))}
        </ul>

        {/* Marcos de referencia: no son certificaciones */}
        <div className="mt-16 border-y border-cyan/15 py-10 lg:mt-20">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-4" data-reveal>
              <h3 className="text-lg font-semibold text-white">{data.frameworksTitle}</h3>
              <p className="mt-1.5 text-sm text-white/65">{data.frameworksNote}</p>
            </div>
            <ul className="flex flex-wrap gap-2.5 lg:col-span-8 lg:justify-end">
              {data.frameworks.map((f, i) => (
                <li
                  key={f}
                  data-reveal
                  style={{ "--i": i } as React.CSSProperties}
                  className="bevel bevel-sm px-4 py-2.5 font-mono text-sm text-cyan [--bevel:8px] [--bevel-bg:var(--color-deep)] [--bevel-border:rgb(162_217_249/0.3)]"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Equipo: sin fotos ni nombres inventados */}
        <div className="mt-16 lg:mt-20">
          <h3 data-reveal className="text-2xl font-bold text-white sm:text-3xl">
            {data.teamTitle}
          </h3>
          <div className="mt-8 grid gap-5 lg:grid-cols-12">
            <article data-reveal className="flex gap-5 lg:col-span-5">
              <span
                aria-hidden="true"
                className="bevel inline-flex h-20 w-20 shrink-0 items-center justify-center font-display text-2xl font-bold text-deep [--bevel:14px] [--bevel-bg:var(--color-cyan)] [--bevel-border:var(--color-cyan)]"
              >
                {initials}
              </span>
              <div>
                <p className="font-display text-xl font-bold text-white">{data.leader.name}</p>
                <p className="mono-label mt-1 text-cyan">{data.leader.role}</p>
                <p className="mt-3 leading-relaxed text-white/70">{data.leader.body}</p>
              </div>
            </article>
            <article data-reveal style={{ "--i": 1 } as React.CSSProperties} className="flex gap-5 lg:col-span-7">
              <span
                aria-hidden="true"
                className="bevel inline-flex h-20 w-20 shrink-0 items-center justify-center text-cyan [--bevel:14px] [--bevel-bg:rgb(10_22_78)] [--bevel-border:rgb(162_217_249/0.3)]"
              >
                <Icon name="users" className="h-8 w-8" />
              </span>
              <div>
                <p className="font-display text-xl font-bold text-white">{data.team.name}</p>
                <p className="mt-3 leading-relaxed text-white/70">{data.team.body}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {data.team.areas.map((a) => (
                    <li key={a} className="bg-white/[0.06] px-2.5 py-1 font-mono text-xs text-white/80 ring-1 ring-cyan/15 ring-inset">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </Container>
    </Section>
  );
}

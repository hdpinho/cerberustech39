import { Container, Section, SectionHeader } from "@/components/ui/primitives";
import type { SiteContent } from "@/content/types";
import { TimelineProgress } from "./TimelineProgress";

/**
 * Línea de tiempo que se dibuja con el scroll. Solo se anima clip-path
 * (sin alturas): la línea completa existe siempre y se recorta.
 */
export function Process({ data }: { data: SiteContent["process"] }) {
  return (
    <Section id="proceso" tone="light" labelledBy="proceso-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
              <SectionHeader id="proceso-title" label={data.label} title={data.title} intro={data.intro} />
            </div>
          </div>

          <ol className="relative lg:col-span-7 lg:col-start-6">
            {/* Riel base + trazo que se revela */}
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[1.375rem] w-px bg-line sm:left-[1.625rem]" />
            <TimelineProgress className="absolute top-2 bottom-2 left-[1.375rem] w-[2px] -translate-x-[0.5px] bg-gradient-to-b from-tech to-navy sm:left-[1.625rem]" />
            {data.steps.map((s, i) => (
              <li key={s.title} data-reveal className="relative flex gap-5 pb-10 last:pb-0 sm:gap-7 sm:pb-12">
                <span className="bevel bevel-sm relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center font-mono text-sm font-medium text-cyan [--bevel-bg:var(--color-navy)] [--bevel-border:var(--color-navy)] sm:h-[3.25rem] sm:w-[3.25rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pt-1.5 sm:pt-2.5">
                  <h3 className="text-xl font-bold text-navy sm:text-2xl">{s.title}</h3>
                  <p className="mt-1.5 max-w-[32rem] leading-relaxed text-ink/70">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

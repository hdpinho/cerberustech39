import { Plus } from "lucide-react";
import { Container, Section, SectionHeader } from "@/components/ui/primitives";
import type { SiteContent } from "@/content/types";

/**
 * Acordeón nativo (<details>/<summary>): accesible con teclado y lector
 * de pantalla sin JS. `name` hace que solo una respuesta quede abierta.
 */
export function Faq({ data }: { data: SiteContent["faq"] }) {
  return (
    <Section id="preguntas" tone="light" labelledBy="faq-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader id="faq-title" label={data.label} title={data.title} />
          </div>
          <div className="border-t border-line lg:col-span-8">
            {data.list.map((f, i) => (
              <details key={f.q} name="faq" className="group border-b border-line" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-lg leading-snug font-semibold text-navy sm:text-xl">{f.q}</h3>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center bg-surface text-navy transition-colors duration-200 group-open:bg-navy group-open:text-cyan">
                    <Plus className="h-4 w-4 transition-transform duration-200 ease-[var(--ease-out)] group-open:rotate-45" aria-hidden="true" />
                  </span>
                </summary>
                <div className="faq-body pr-12 pb-6">
                  <p className="max-w-[40rem] leading-relaxed text-ink/75">{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

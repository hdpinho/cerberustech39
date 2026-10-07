import { Check } from "lucide-react";
import { CircuitField } from "@/components/brand/Circuit";
import { Icon } from "@/components/ui/Icon";
import { Container, Section, SectionHeader } from "@/components/ui/primitives";
import { QuoteLink } from "@/components/ui/QuoteLink";
import type { SiteContent } from "@/content/types";

export function Packages({ data }: { data: SiteContent["packages"] }) {
  return (
    <Section id="paquetes" tone="dark" labelledBy="paquetes-title">
      <div className="fondo-reticula" aria-hidden="true" />
      <CircuitField animated={false} className="pointer-events-none absolute top-0 right-0 h-[28rem] w-[50rem] opacity-25" />
      <Container className="relative">
        <SectionHeader id="paquetes-title" label={data.label} title={data.title} intro={data.intro} dark />

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {data.list.map((p, i) => {
            const rec = Boolean(p.recommended);
            return (
              <li key={p.id} data-reveal style={{ "--i": i % 3 } as React.CSSProperties}>
                <article
                  aria-labelledby={`pkg-${p.id}`}
                  className={`bevel flex h-full flex-col p-7 sm:p-8 ${
                    rec
                      ? "[--bevel-bg:#0B1E66] [--bevel-border:var(--color-cyan)]"
                      : "[--bevel-bg:rgb(10_22_78)] [--bevel-border:rgb(162_217_249/0.16)]"
                  }`}
                >
                  <div className="flex min-h-7 items-center justify-between gap-3">
                    <h3 id={`pkg-${p.id}`} className="text-2xl font-bold text-white">
                      {p.name}
                    </h3>
                    {rec ? (
                      <span className="bg-ink px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.14em] text-gold uppercase ring-1 ring-gold/50 ring-inset">
                        {data.recommended}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-white/70">
                    <span className="sr-only">{data.forWhom}: </span>
                    {p.audience}
                  </p>
                  <div className="my-6 h-px bg-cyan/15" aria-hidden="true" />
                  <ul className="space-y-3 text-[0.9375rem] text-white/85">
                    {p.includes.map((inc) => (
                      <li key={inc} className="flex gap-2.5">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <QuoteLink label={data.cta} service={p.service} packageName={p.name} highlighted={rec} />
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="mt-20 lg:mt-24">
          <h3 data-reveal className="text-2xl font-bold text-white sm:text-3xl">
            {data.commitmentsTitle}
          </h3>
          <ul className="mt-8 grid gap-px overflow-hidden bg-cyan/15 sm:grid-cols-2 lg:grid-cols-4">
            {data.commitments.map((c, i) => (
              <li key={c.title} data-reveal style={{ "--i": i } as React.CSSProperties} className="bg-deep p-6 sm:p-7">
                <Icon name={c.icon} className="h-6 w-6 text-cyan" />
                <p className="mt-4 font-display text-lg font-semibold text-white">{c.title}</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/70">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

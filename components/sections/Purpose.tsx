import { Container, MonoLabel, Section } from "@/components/ui/primitives";
import type { SiteContent } from "@/content/types";

export function Purpose({ data }: { data: SiteContent["purpose"] }) {
  return (
    <Section id="proposito" tone="surface" labelledBy="proposito-title" className="!py-20 lg:!py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div data-reveal>
              <MonoLabel>{data.label}</MonoLabel>
            </div>
            <h2 id="proposito-title" data-reveal="clip" className="mt-4 text-[2rem] leading-[1.1] font-bold text-navy sm:text-[2.5rem]">
              <span className="clip-inner">{data.title}</span>
            </h2>
          </div>
          <dl className="grid gap-10 sm:grid-cols-2 lg:col-span-8">
            <div data-reveal>
              <dt className="mono-label text-navy">misión</dt>
              <dd className="mt-3 text-lg leading-relaxed text-ink/80">{data.mission}</dd>
            </div>
            <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              <dt className="mono-label text-navy">visión</dt>
              <dd className="mt-3 text-lg leading-relaxed text-ink/80">{data.vision}</dd>
            </div>
          </dl>
        </div>

        <h3 className="sr-only">{data.valuesTitle}</h3>
        <ul className="mt-14 grid gap-px overflow-hidden bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
          {data.values.map((v, i) => (
            <li key={v.name} data-reveal style={{ "--i": i } as React.CSSProperties} className="bg-white p-6">
              <p className="font-display text-lg font-bold text-navy">
                <span aria-hidden="true" className="mr-2 font-mono text-sm font-normal text-tech">
                  0{i + 1}
                </span>
                {v.name}
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/70">{v.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

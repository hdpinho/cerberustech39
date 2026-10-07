import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/primitives";
import { contact } from "@/content/config";
import { getContent } from "@/content";

const c = getContent();

export const metadata: Metadata = {
  title: c.privacy.title,
  description: `Cómo ${c.company.shortName} recoge, usa y protege los datos que envías a través de este sitio.`,
  alternates: { canonical: "/privacidad/" },
};

export default function PrivacyPage() {
  return (
    <>
      <header data-tone="light" className="border-b border-line bg-white">
        <Container className="flex h-[var(--header-h)] items-center justify-between">
          <a href="/">
            <Logo />
            <span className="sr-only">, ir al inicio</span>
          </a>
          <a href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al inicio
          </a>
        </Container>
      </header>
      <main id="contenido" tabIndex={-1} className="bg-white py-16 outline-none sm:py-24">
        <Container>
          <article className="max-w-[44rem]">
            <p className="mono-label text-navy">
              <span aria-hidden="true" className="text-tech">
                //{" "}
              </span>
              legal
            </p>
            <h1 className="mt-4 text-4xl font-bold text-navy sm:text-5xl">{c.privacy.title}</h1>
            <p className="mt-3 text-sm text-ink/60">{c.privacy.updated}</p>
            {c.privacy.sections.map((s) => (
              <section key={s.title} className="mt-10">
                <h2 className="text-2xl font-bold text-navy">{s.title}</h2>
                {s.body.map((p) => (
                  <p key={p.slice(0, 24)} className="mt-3 leading-relaxed text-ink/80">
                    {p}
                  </p>
                ))}
              </section>
            ))}
            {contact.correo ? (
              <p className="mt-10 leading-relaxed text-ink/80">
                Contacto:{" "}
                <a href={`mailto:${contact.correo}`} className="font-medium text-tech underline underline-offset-2">
                  {contact.correo}
                </a>
              </p>
            ) : null}
          </article>
        </Container>
      </main>
      <Footer c={c} homePrefix="/" />
    </>
  );
}

import { Mail, MapPin } from "lucide-react";
import { Watermark } from "@/components/brand/Circuit";
import { WhatsappIcon } from "@/components/ui/Icon";
import { Imagen } from "@/components/ui/Imagen";
import { ButtonLink, Container, Section, SectionHeader } from "@/components/ui/primitives";
import { contact, whatsappUrl } from "@/content/config";
import type { SiteContent } from "@/content/types";
import { ContactFormLazy } from "./ContactFormLazy";

export function Contact({ data, services }: { data: SiteContent["contact"]; services: SiteContent["services"]["list"] }) {
  const wa = whatsappUrl(data.whatsappMessage);
  // Sin endpoint, el formulario no se publica (se muestra el aviso). En
  // desarrollo sí se muestra, en modo vista previa, para poder diseñarlo.
  const showForm = Boolean(contact.formEndpoint) || process.env.NODE_ENV !== "production";

  return (
    <Section id="contacto" tone="dark" labelledBy="contacto-title">
      <Watermark className="pointer-events-none absolute -bottom-24 -left-24 h-[34rem] w-[34rem] text-cyan/[0.045]" />
      <div className="fondo-reticula" aria-hidden="true" />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader id="contacto-title" label={data.label} title={data.title} intro={data.intro} dark />

            {wa ? (
              <div data-reveal className="mt-8">
                <ButtonLink href={wa} target="_blank" rel="noopener noreferrer" variant="ghostDark">
                  <WhatsappIcon className="h-5 w-5 text-cyan" />
                  {data.whatsappCta}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </ButtonLink>
              </div>
            ) : null}

            <ul className="mt-10 space-y-6 border-t border-cyan/15 pt-8">
              {contact.correo ? (
                <li data-reveal className="flex gap-4">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-cyan" aria-hidden="true" />
                  <div>
                    <p className="mono-label text-white/60">{data.emailLabel.toLowerCase()}</p>
                    <p className="mt-1">
                      <a href={`mailto:${contact.correo}`} className="text-white underline-offset-4 hover:underline">
                        {contact.correo}
                      </a>
                    </p>
                  </div>
                </li>
              ) : null}
              <li data-reveal style={{ "--i": 1 } as React.CSSProperties} className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-cyan" aria-hidden="true" />
                <div>
                  <p className="mono-label text-white/60">{data.locationLabel.toLowerCase()}</p>
                  <p className="mt-1 text-white">{data.location}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/65">{data.reach}</p>
                </div>
              </li>
            </ul>

            <div data-reveal style={{ "--i": 2 } as React.CSSProperties} className="marco-hud mt-10 hidden lg:block">
              <Imagen
                nombre="contacto-movil"
                alt={data.imagenAlt}
                sizes="440px"
                className="recorte-bisel zoom-suave aspect-[4/3]"
                posicion="center 40%"
              />
            </div>
          </div>

          <div className="lg:col-span-7" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            <div className="bevel p-6 [--bevel:24px] [--bevel-bg:rgb(8_19_70)] [--bevel-border:rgb(162_217_249/0.22)] sm:p-9">
              {showForm ? (
                <ContactFormLazy form={data.form} services={services} endpoint={contact.formEndpoint} />
              ) : (
                <p className="text-white/80">{wa ? data.form.unavailable : data.form.unavailableEmailOnly}</p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

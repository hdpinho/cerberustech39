import { Logo } from "@/components/brand/Logo";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/primitives";
import { Year } from "@/components/ui/Year";
import { contact, instagramUrl } from "@/content/config";
import type { SiteContent } from "@/content/types";

export function Footer({ c, homePrefix = "" }: { c: SiteContent; homePrefix?: string }) {
  const ig = instagramUrl();
  const socials = [
    ig ? { href: ig, label: `Instagram @${contact.instagramHandle}`, Icon: InstagramIcon } : null,
    contact.linkedinUrl ? { href: contact.linkedinUrl, label: "LinkedIn", Icon: LinkedinIcon } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null);

  return (
    <footer data-tone="dark" className="cv-auto on-dark border-t border-cyan/10 bg-deep text-white">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href={`${homePrefix}#inicio`} className="inline-block">
              <Logo variant="light" />
              <span className="sr-only">, ir al inicio</span>
            </a>
            <p className="mt-5 max-w-[22rem] text-white/70">{c.company.tagline}</p>
            <p className="mt-4 text-sm text-white/60">
              {c.company.city}, {c.company.country}
            </p>
          </div>

          <nav aria-label="Pie de página" className="md:col-span-4">
            <p className="mono-label text-white/60">{c.footer.navTitle.toLowerCase()}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {c.nav.links.map((l) => (
                <li key={l.href}>
                  <a href={`${homePrefix}${l.href}`} className="text-white/80 hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {socials.length ? (
            <div className="md:col-span-3">
              <p className="mono-label text-white/60">{c.footer.socialTitle.toLowerCase()}</p>
              <ul className="mt-4 flex gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} (se abre en una pestaña nueva)`}
                      className="press inline-flex h-11 w-11 items-center justify-center text-cyan ring-1 ring-cyan/25 ring-inset hover:ring-cyan/60"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <Year buildYear={new Date().getFullYear()} /> {c.company.name} {c.footer.rights}
            {contact.rif ? ` RIF ${contact.rif}.` : ""}
          </p>
          <a href="/privacidad/" className="text-white/70 hover:text-white">
            {c.footer.privacy}
          </a>
        </div>
      </Container>
    </footer>
  );
}

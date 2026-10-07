import { config, contact, instagramUrl, siteUrl } from "@/content/config";
import type { SiteContent } from "@/content/types";

/** JSON-LD: Organization + ProfessionalService (Venezuela y atención remota). */
export function buildJsonLd(c: SiteContent) {
  const sameAs = [instagramUrl(), contact.linkedinUrl || null].filter(Boolean);
  const orgId = `${siteUrl}/#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: c.company.name,
        alternateName: c.company.shortName,
        url: `${siteUrl}/`,
        logo: `${siteUrl}/icon-512.png`,
        slogan: c.company.tagline,
        founder: { "@type": "Person", name: c.trust.leader.name, jobTitle: "CEO" },
        ...(contact.correo ? { email: contact.correo } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#service`,
        name: c.company.shortName,
        description: c.meta.description,
        url: `${siteUrl}/`,
        image: `${siteUrl}/og.png`,
        parentOrganization: { "@id": orgId },
        address: {
          "@type": "PostalAddress",
          addressLocality: c.company.city,
          addressCountry: "VE",
        },
        areaServed: [
          { "@type": "Country", name: "Venezuela" },
          { "@type": "Place", name: "Latinoamérica (remoto)" },
          { "@type": "Country", name: "Estados Unidos" },
          { "@type": "Place", name: "Europa (remoto)" },
        ],
        availableChannel: { "@type": "ServiceChannel", name: "Atención remota" },
        ...(contact.correo ? { email: contact.correo } : {}),
        ...(contact.whatsappDigits ? { telephone: `+${contact.whatsappDigits}` } : {}),
        knowsAbout: c.services.list.map((s) => s.title),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios",
          itemListElement: c.services.list.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.benefit },
          })),
        },
      },
    ],
  };
}

export const domain = config.dominio;

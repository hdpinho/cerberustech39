/**
 * Datos de contacto y operación de Cerberus Tech 39.
 *
 * Todo lo marcado como PENDIENTE es un valor de ejemplo. Cuando un campo
 * queda vacío (""), el sitio oculta el elemento correspondiente en lugar
 * de mostrar un enlace roto.
 */
export const config = {
  dominio: "cerberustech39.com", //            PENDIENTE confirmar
  correo: "pjjulio@gmail.com", //              Provisional, hasta tener el buzón del dominio
  whatsapp: "+580000000000", //                PENDIENTE (formato internacional, sin espacios)
  instagram: "@cerberustech39", //             PENDIENTE
  linkedin: "", //                             PENDIENTE (URL completa del perfil de empresa)
  formEndpoint: "", //                         PENDIENTE (p. ej. https://formspree.io/f/xxxxxxx)
  rif: "", //                                  No mostrar hasta que la empresa esté formalizada
} as const;

/**
 * URL canónica del sitio (canónicas, sitemap, Open Graph, JSON-LD), con protocolo y sin
 * barra final. Se resuelve al compilar, en este orden:
 * 1. NEXT_PUBLIC_SITE_URL, si se define a mano;
 * 2. en Vercel, el dominio de producción del proyecto (VERCEL_PROJECT_PRODUCTION_URL):
 *    hoy la URL *.vercel.app y, cuando se conecte el dominio propio, ese dominio;
 * 3. el `dominio` de arriba (compilaciones locales).
 */
function resolverSiteUrl(): string {
  const manual = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (manual) return manual.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
  return `https://${config.dominio}`;
}
export const siteUrl = resolverSiteUrl();

/**
 * Un número de WhatsApp de relleno (solo ceros después del código de país)
 * se trata como vacío para no generar un enlace wa.me que no lleva a nadie.
 */
function whatsappDigits(): string {
  const digits = config.whatsapp.replace(/\D/g, "");
  const local = digits.startsWith("58") ? digits.slice(2) : digits;
  return /[1-9]/.test(local) ? digits : "";
}

export const contact = {
  whatsappDigits: whatsappDigits(),
  correo: config.correo.trim(),
  instagramHandle: config.instagram.replace(/^@/, "").trim(),
  linkedinUrl: config.linkedin.trim(),
  formEndpoint: (process.env.NEXT_PUBLIC_FORM_ENDPOINT || config.formEndpoint).trim(),
  rif: config.rif.trim(),
};

export function whatsappUrl(message: string): string | null {
  if (!contact.whatsappDigits) return null;
  return `https://wa.me/${contact.whatsappDigits}?text=${encodeURIComponent(message)}`;
}

export function instagramUrl(): string | null {
  return contact.instagramHandle ? `https://www.instagram.com/${contact.instagramHandle}/` : null;
}

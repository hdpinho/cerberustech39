import type { Locale, SiteContent } from "./types";
import { site as es } from "./es/site";

/**
 * Punto único de acceso al contenido. Para publicar en inglés:
 * crea `content/en/site.ts` con el mismo tipo y agrégalo aquí.
 */
const dictionaries: Record<Locale, SiteContent> = { es };

export const defaultLocale: Locale = "es";
export const htmlLang: Record<Locale, string> = { es: "es-VE" };

export function getContent(locale: Locale = defaultLocale): SiteContent {
  return dictionaries[locale];
}

export type { SiteContent } from "./types";

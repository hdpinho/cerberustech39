import { z } from "zod";
import type { SiteContent } from "@/content/types";

export const SERVICE_OPTIONS = ["DEV", "DAT", "INF", "SEG", "IA", "CON", "OTRO"] as const;

export function contactSchema(e: SiteContent["contact"]["form"]["errors"]) {
  return z.object({
    nombre: z.string().trim().min(2, e.name).max(80, e.name),
    empresa: z.string().trim().max(120).optional().or(z.literal("")),
    correo: z.string().trim().email(e.email).max(160, e.email),
    whatsapp: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s().-]{7,20}$/, e.whatsapp)
      .optional()
      .or(z.literal("")),
    servicio: z.enum(SERVICE_OPTIONS, { message: e.service }),
    mensaje: z.string().trim().min(10, e.message).max(2000, e.message),
    consentimiento: z.literal(true, { message: e.consent }),
    // Honeypot: debe llegar vacío. Los bots suelen rellenarlo.
    // Se revisa en el envío (no aquí) para responder con un falso éxito.
    sitio_web: z.string().optional(),
  });
}

export type ContactValues = z.infer<ReturnType<typeof contactSchema>>;

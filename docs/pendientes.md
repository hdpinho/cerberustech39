# Datos pendientes y siguientes pasos

## Datos que faltan (`content/config.ts`)

| Campo | Valor actual | Estado | Qué pasa mientras tanto |
|---|---|---|---|
| `dominio` | `cerberustech39.com` | **Confirmar** | En Vercel la URL sale de `VERCEL_PROJECT_PRODUCTION_URL` (hoy `cerberustech39.vercel.app`); este valor solo se usa en compilaciones locales |
| `correo` | `pjjulio@gmail.com` | **Provisional**, hasta tener el buzón del dominio | Se muestra en Contacto, Privacidad y el JSON-LD |
| `whatsapp` | `+584129632254` | **Configurado** | Botón en Contacto, en el pie, flotante y JSON-LD |
| `instagram` | `@cerberustech39` | **Confirmar** que la cuenta existe | Se muestra en el pie |
| `linkedin` | vacío | **Pendiente** | Icono oculto |
| `formEndpoint` | vacío | **Pendiente**: crear un formulario en Formspree (gratis) | En producción se muestra el aviso «formulario disponible muy pronto» con el correo |
| `rif` | vacío | Hasta formalizar la empresa | No se muestra |

## Otros pendientes

- **Logo oficial.** Se usa un wordmark provisional. Cuando lo autorices, sigue «Cambiar al logo oficial» en el README.
- **Brochure (`brand/brochure.pdf`).** No estaba en `./brand/`. Conviene contrastar textos y diagramación cuando esté disponible.
- **Respuesta de la FAQ «¿Cuánto tarda una web?».** Usa un tono comercial («en cuestión de días» / «en pocas semanas»). Confirma que el equipo puede cumplir esos plazos.
- **Política de privacidad.** Es básica. Si se trabaja con datos del sector financiero o de clientes en la UE, conviene una revisión legal (RGPD / normativa venezolana).

- **Imágenes generadas con IA (Higgsfield, GPT Image 2.5).** Son originales, sin texto ni logotipos. Antes de publicar, revisa los términos de uso comercial de tu plan de Higgsfield.
- **Peso del repositorio.** Los PNG fuente de `assets-src/imagenes/` pesan unos 25 MB. Si usas Git, considera Git LFS o guárdalos fuera del repositorio; el sitio solo necesita los AVIF/WebP de `public/img/`.
- **Clave de Gemini (Nano Banana).** Gemini respondió «API key not valid». Si quieres generar más imágenes con Nano Banana, actualiza `GEMINI_API_KEY` en `C:\Users\hdpinho\Claude Code\nano-banana-mcp\.env`.

## Recomendaciones de siguientes pasos

1. **Publicar y medir con PageSpeed Insights** sobre la URL real, y registrar el sitio en Google Search Console (enviar `sitemap.xml`).
2. **Perfil de empresa en Google** (Caracas) con el mismo nombre, dominio y teléfono que el JSON-LD.
3. **Casos de éxito.** Cuando existan clientes que autoricen su publicación: una sección «Casos» con problema → solución → resultado medible. Nada de logos ni cifras sin autorización escrita.
4. **Versión en inglés** para el público de EE. UU. y Europa. La estructura ya está lista (README, «Versión en inglés»); hace falta traducir `content/es/site.ts`.
5. **Blog / recursos.** Artículos breves de seguridad e IA aplicada para PyMEs venezolanas: buen SEO de cola larga y prueba de criterio técnico.
6. **Analítica sin cookies** (Plausible o Umami) para saber qué servicios y paquetes despiertan interés.
7. **Agenda en línea** (Cal.com, gratuita y de código abierto) para el CTA «Agenda tu diagnóstico», cuando se defina la disponibilidad.

# Cerberus Tech 39 — sitio web oficial

Landing one-page de **Cerberus Tech 39, C.A.** (Caracas, Venezuela).
Next.js (App Router) + TypeScript estricto + Tailwind CSS v4, exportado como **sitio 100 % estático**.

> **Logo provisional.** Por decisión del cliente aún no se usa el logo oficial.
> El wordmark «CERBERUS / TECH 39» y el monograma «39» son marcadores neutros
> (ver [Cambiar al logo oficial](#cambiar-al-logo-oficial)).

---

## Requisitos

- Node.js 20 o superior (probado con Node 24)
- npm 10 o superior

## Instalación y desarrollo

```bash
npm install
npm run dev          # http://localhost:3000 (con recarga en caliente)
```

En desarrollo, si no hay `formEndpoint`, el formulario se muestra en **modo vista previa**: valida igual, pero el envío se simula y aparece un aviso dorado.

## Build de producción

```bash
npm run build        # genera ./out (HTML, CSS, JS y recursos estáticos)
npm start            # sirve ./out en http://localhost:3000 con Brotli/gzip y las cabeceras de _headers
```

`npm run build` ejecuta automáticamente `scripts/postbuild.mjs`, que:

1. **Difiere la hidratación** hasta después del primer pintado: el HTML ya trae todo el contenido, y los scripts de Next se piden justo después (mejora FCP/LCP en móvil).
2. Inserta una **Content-Security-Policy** estricta con hashes SHA-256 de cada script inline.

## Despliegue

### Vercel (proyecto `pjjulio/cerberustech39`, ya vinculado)

```bash
npx vercel deploy          # preview (protegido con el inicio de sesión de Vercel, no indexable)
npx vercel deploy --prod   # producción
```

- **`vercel.json` fuerza el modo estático** (`framework: null`, `buildCommand: npm run build`, `outputDirectory: out`). Con el adaptador de Next.js, Vercel copia la salida antes del `postbuild` y se perderían la CSP y la carga diferida de scripts.
- **Cabeceras de seguridad:** en `vercel.json`.
- **`.vercelignore`** excluye `assets-src/`, `docs/`, `brand/` y los `.env*.local`. Las rutas van ancladas con `/`: sin la barra, `brand/` excluiría también `components/brand/`.
- **URL del sitio:** se toma sola de `VERCEL_PROJECT_PRODUCTION_URL` (hoy `cerberustech39.vercel.app`). Al conectar cerberustech39.com como dominio de producción en Vercel, canónicas, sitemap y Open Graph cambian en el siguiente despliegue. Para fijarla a mano, usa `NEXT_PUBLIC_SITE_URL`.
- **Variables de entorno opcionales** (en el panel de Vercel): las de `.env.example`, por ejemplo `NEXT_PUBLIC_FORM_ENDPOINT`.

### Cloudflare Pages
1. *Build command:* `npm run build` · *Build output directory:* `out`
2. Variable `NODE_VERSION=20` (o superior).
3. Las cabeceras de seguridad viajan en `public/_headers` (se copia a `out/_headers`).

Tras publicar, mide con [PageSpeed Insights](https://pagespeed.web.dev/) sobre la URL real.

---

## Editar textos y datos

| Qué | Dónde |
|---|---|
| Todos los textos (hero, servicios, paquetes, FAQ, privacidad…) | `content/es/site.ts` |
| Datos de contacto, redes, dominio, endpoint del formulario, RIF | `content/config.ts` |
| Colores, tipografías, curvas de animación | `app/globals.css` (bloque `@theme`) |

Reglas de `content/config.ts`:

- Si un campo queda vacío (`""`), **el elemento se oculta** (no hay enlaces rotos).
- Un WhatsApp de relleno (solo ceros después del `+58`) se trata como vacío.
- `rif` vacío: no se muestra. Cuando la empresa esté formalizada, aparecerá en el pie.

### Formulario de contacto (gratis con Formspree)

1. Crea una cuenta gratuita en [formspree.io](https://formspree.io) (el plan gratuito incluye 50 envíos al mes).
2. Crea un formulario y copia su URL (`https://formspree.io/f/xxxxxxx`).
3. Pégala en `content/config.ts → formEndpoint`, o en la variable `NEXT_PUBLIC_FORM_ENDPOINT`.
4. Recompila. Si el endpoint queda vacío, en producción se muestra un aviso con el correo (y WhatsApp, si existe) en lugar del formulario.

**Anti-spam:**
- Campo trampa (honeypot) invisible.
- Tiempo mínimo de llenado de 3 s.
- Límite de 3 envíos cada 10 minutos por navegador.
- Filtros y límites propios de Formspree.

Con un sitio estático, el límite real por IP lo aplica Formspree.

### Analítica (desactivada por defecto)

Plausible o Umami, sin cookies de seguimiento. En `.env.local`:

```
NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=cerberustech39.com
```

Al activarla aparece un aviso informativo de privacidad, y `postbuild` añade su dominio a la CSP automáticamente.

### Versión en inglés (i18n)

El contenido pasa por `getContent(locale)` en `content/index.ts`. Para publicar en inglés:

1. Crea `content/en/site.ts` con el mismo tipo `SiteContent`.
2. Regístralo en `content/index.ts` y crea la ruta `app/en/page.tsx`, que llame a `getContent("en")`.
3. Añade `alternates.languages` en los metadatos y la URL en `app/sitemap.ts`.

### Cambiar al logo oficial

1. Coloca los archivos en `./brand/`, preferiblemente en SVG.
2. Reemplaza el contenido de `components/brand/Logo.tsx` (`Logo` y `Monogram`) por el logo oficial (`<img>` o SVG en línea). No lo redibujes ni lo recolorees.
3. Reemplaza `public/icon.svg`, `public/favicon-32.png`, `public/apple-touch-icon.png`, `public/icon-512.png` y `public/og.png` por versiones derivadas de `brand/perfil-1080.png`. A partir de ahí no ejecutes `scripts/gen-assets.mjs`, que genera los provisionales.
4. Opcional: cambia la `Watermark` de `components/brand/Circuit.tsx` por `isotipo-blanco-circuitos`.

---

## Estructura

```
app/
  layout.tsx           fuentes (next/font), metadatos, OG/Twitter, enlace "saltar al contenido"
  page.tsx             compone la landing + JSON-LD (Organization + ProfessionalService)
  privacidad/          política de privacidad
  sitemap.ts, robots.ts
  globals.css          tokens de marca, bisel, revelados, movimiento reducido
components/
  brand/               Logo (provisional), circuito SVG y marca de agua
  layout/              Navbar, Footer, Analytics, CookieNotice
  sections/            Hero, Guardians, Services (+diálogo), Packages, Process, Trust,
                       Sectors, Purpose, Faq, Contact (+ContactForm diferido)
  ui/                  primitivas (Section, Button, Chip…), RevealObserver, iconos
content/               config.ts (datos), es/site.ts (textos), types.ts, index.ts (i18n)
lib/                   seo.ts (JSON-LD), schema.ts (zod), preselect.ts
scripts/               postbuild, serve, capture, lighthouse, check-overflow, gen-assets
docs/                  capturas, Lighthouse, accesibilidad, pendientes
```

## Scripts de calidad

```bash
npm run build && npm start                          # en una terminal
npm run capturas                                    # docs/capturas a 1440/390 px
node scripts/capture.mjs http://localhost:3000/ docs/capturas 1440,1024,768,390
npm run lighthouse                                  # ver nota en docs/lighthouse/README.md
node scripts/check-overflow.mjs http://localhost:3000/   # detecta scroll horizontal
```

Requieren Google Chrome instalado. Si no está en la ruta por defecto, usa `CHROME_PATH`.

## Escenas 3D e imágenes

### Escenas 3D (Three.js)

| Escena | Dónde | Qué muestra (datos reales del documento de marca) |
|---|---|---|
| Globo holográfico | Hero | Sede en Caracas y arcos de atención remota a Latinoamérica, EE. UU. y Europa; tierra de Natural Earth; órbita con los tres pilares |
| Ecosistema de servicios | Servicios | Las seis líneas (DEV, DAT, INF, SEG, IA, CON) en órbita. Al pasar el puntero muestra el beneficio; al pulsar abre el mismo detalle que la tarjeta |

Siguen la arquitectura de la skill `creacion-graficos-3d`, con estas reglas:

- Montaje diferido y cerca de la pantalla.
- Pausa fuera de pantalla y con la pestaña oculta.
- `touch-action: pan-y`: el gesto vertical sigue desplazando la página.
- Sin zoom con la rueda.
- Tooltips con `textContent`.
- Respaldo estático si no hay WebGL.
- Movimiento reducido: sin giro ni pulsos.
- Equivalente accesible: leyenda visible en el hero y tarjetas en Servicios.

**Cambio respecto a la skill.** En lugar de un contexto compartido que se copia a lienzos 2D, cada escena dibuja en su propio lienzo WebGL. Con animación continua, esa copia costaba unos 13 ms por cuadro.

**Cuándo se cargan**, para cuidar el rendimiento:

1. Three.js no está en la carga inicial.
2. Se descarga con la **primera interacción** (ratón, toque, scroll o teclado) o 6,5 s después de cargar si el usuario solo mira, y siempre que la escena esté cerca de la pantalla.
3. Se construye en fases cortas y compila los sombreadores con `compileAsync`.
4. Mientras tanto se ve un respaldo en CSS: una esfera de puntos con la misma silueta.

**Cuándo no se cargan:**

- En equipos sin GPU (WebGL por software, detectado con `failIfMajorPerformanceCaveat`).
- Con «Ahorro de datos» activado.

Para pruebas y capturas, `?3d=forzar` omite esas comprobaciones.

Archivos: `lib/three/` (motor, base `Escena`, `EscenaGlobo`, `EscenaEcosistema`, `soporte`) y `components/three/Escena3D.tsx`.
Para regenerar los puntos de tierra: `node scripts/gen-globo.mjs`.

### Imágenes

Las seis imágenes son **originales**, generadas con Higgsfield (GPT Image 2.5) en la paleta de marca y sin texto. Están en `assets-src/imagenes/`.

```bash
node scripts/optimizar-imagenes.mjs   # AVIF + WebP en 480–2000 px y lib/imagenes.ts (con miniatura difuminada)
```

El componente `components/ui/Imagen.tsx` las sirve responsive, con carga diferida, dimensiones explícitas (CLS 0) y la miniatura difuminada de fondo mientras llegan. Para cambiar una imagen, reemplaza el PNG en `assets-src/imagenes/` con el mismo nombre y vuelve a ejecutar el script.

### Verificación

```bash
node scripts/qa.mjs http://localhost:3000/           # revelados, anclas, teclado, diálogo, consola
node scripts/verificar-3d.mjs http://localhost:3000/ # montaje 3D, tooltip, clic en nodo, carga sin interacción
```

## Decisiones de animación (principios de Emil Kowalski)

- **Curvas propias.** `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` para entradas; nunca `linear` ni `ease` en la interfaz. Única excepción: la línea de tiempo, cuyo progreso lo marca el scroll.
- **Duraciones.**
  - Botones: 160 ms, con `scale(0.97)` en `:active`.
  - Menú: 200 ms al entrar y 150 ms al salir.
  - Diálogo: 240 ms al entrar y 160 ms al salir.
  - Revelados: 450–500 ms, con escalonado de 50 ms y una sola vez.
- **Propiedades.** Solo `transform`, `opacity`, `clip-path` y `filter`. Hover únicamente con `(hover: hover) and (pointer: fine)`.
- **Sin animación.** Navbar, enlaces de ancla y cualquier cosa que se use cientos de veces.
- **Titular del hero.** Nunca se oculta (es el elemento LCP): solo se asienta con un leve desplazamiento.
- **`prefers-reduced-motion`.** Sin desplazamientos ni recortes; solo opacidad.
- **Motion** (`motion`) se descarga solo cuando la sección Proceso se acerca. Usa `scroll()` + WAAPI, con ScrollTimeline nativo cuando existe.

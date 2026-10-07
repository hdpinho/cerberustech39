# Informe de Lighthouse

## Producción (https://cerberustech39.vercel.app) · 7 de octubre de 2026

Medido sobre la URL pública, servida por la CDN de Vercel. Es la medición de referencia.

| Perfil | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| **Móvil** | **99** | **100** | **100** | **100** | 1,8 s | 0 | 80 ms |
| **Escritorio** | **100** | **100** | **100** | **100** | 0,5 s | 0 | 0 ms |

Informes completos: [`produccion/mobile.html`](produccion/mobile.html) y [`produccion/desktop.html`](produccion/desktop.html).

## Medición local previa al despliegue

Lighthouse 13.5 sobre el build de producción (`npm run build`), servido con Brotli y las cabeceras de `public/_headers`. Incluye las escenas 3D y las imágenes. Fecha: 6 de octubre de 2026.

| Perfil | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| **Móvil** (Moto G Power, 4G lento, CPU 4x, simulado) | **98** | **100** | **100** | **100** |
| **Escritorio** | **100** | **100** | **100** | **100** |

| Métrica (móvil) | Valor | Objetivo |
|---|---|---|
| LCP | 2,4 s | < 2,5 s ✅ |
| CLS | 0 | < 0,1 ✅ |
| TBT (aproxima el INP en laboratorio) | 60 ms | < 200 ms ✅ |
| FCP | 1,4 s | — |

El INP solo se mide con usuarios reales. Tras publicar, revísalo en PageSpeed Insights, en la pestaña «Experiencia de usuarios reales».

Informes completos: [`mobile.html`](mobile.html) y [`desktop.html`](desktop.html); datos crudos en los `.json`.

## Lo que cuesta el 3D y cómo se contuvo

Con la CPU a 4x, medido en este equipo con GPU Intel Iris Xe:

| Pieza | Coste | Cómo se contiene |
|---|---|---|
| Evaluar Three.js (≈130 KB con Brotli) | ~200 ms, una vez | Fuera de la carga inicial: se descarga con la primera interacción o 6,5 s después de cargar |
| Crear la escena | Varias tareas cortas | Construcción por fases con `scheduler.yield()` |
| Sombreadores | Sin bloqueo | `compileAsync` (compilación en paralelo) |
| Cada cuadro | 0,8 ms a velocidad normal; 11 ms a 4x | Sin asignaciones por cuadro; rótulos solo si se mueven; pausa fuera de pantalla |
| Equipos sin GPU | 0 ms | No se descarga Three.js; se ve el respaldo en CSS |

La primera versión del 3D bajó el móvil a **83** (TBT de 550 ms). Estas medidas lo devolvieron a 98.

## Por qué se mide en HTTPS

En este equipo, un intermediario de red (proxy o antivirus) entrega a Chrome las respuestas HTTP **ya descomprimidas**. Lighthouse cree entonces que la página pesa unas cinco veces más, y por HTTP el móvil marca unos 74 de forma artificial. Por HTTPS los tamaños son los reales, igual que en Vercel o Cloudflare.

```bash
openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 7 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost"
TLS_CERT=cert.pem TLS_KEY=key.pem node scripts/serve.mjs 3943
node scripts/lighthouse.mjs https://localhost:3943/ docs/lighthouse mobile,desktop
```

La referencia definitiva es **PageSpeed Insights sobre la URL publicada**.

## Avisos que quedan (no penalizan la puntuación)

- **unused-javascript / legacy-javascript.** Corresponden al runtime de React y Next.js.
- **render-blocking.** La hoja de estilos (unos 13 KB con Brotli) bloquea el primer pintado, como debe.
- **LCP 2,4 s.** Las imágenes de los tres guardianes están justo bajo el hero y el navegador las pide pronto; aun así se cumple el objetivo de 2,5 s.

## Optimizaciones aplicadas

| Antes | Después | Efecto |
|---|---|---|
| Zod + react-hook-form + Motion en la carga inicial | Formulario y Motion bajo demanda | −300 KB de JS inicial |
| Titular del hero oculto con `clip-path` | Visible desde el primer pintado | El LCP no espera a la animación |
| Todas las secciones maquetadas al cargar | `content-visibility: auto` bajo el hero | Layout inicial ~2× más barato |
| Scripts de Next antes del primer pintado | Se piden tras el FCP (`scripts/postbuild.mjs`) | LCP de 3,2 s a 2,1 s antes del 3D |
| Three.js al quedar ocioso | Primera interacción o 6,5 s | TBT de 550 ms a 60 ms |
| Copia de cada cuadro WebGL a un lienzo 2D | Lienzo WebGL propio por escena | −13 ms por cuadro |
| Imágenes PNG de 3–5 MB | AVIF/WebP responsive (30–50 KB a 800 px) | — |

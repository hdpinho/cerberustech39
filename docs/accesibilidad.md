# Lista de verificación de accesibilidad (WCAG 2.2 AA)

Verificado el 6 de octubre de 2026 sobre el build de producción. Lighthouse Accesibilidad: **100** (móvil y escritorio).

## Percepción

- [x] **Contraste ≥ 4.5:1 en texto normal.**
  - Navy `#071A5F` sobre blanco: unos 16:1.
  - Blanco sobre navy/deep: más de 15:1.
  - Cian `#A2D9F9` sobre deep `#040C33`: unos 12:1.
- [x] **Cian solo sobre fondos oscuros.** Nunca se usa como texto sobre blanco ni sobre `#F4F7FB`.
- [x] **Azul Tech `#1A7AB3` en texto solo sobre blanco** (4,69:1). Sobre `#F4F7FB` (4,38:1) se usa solo en iconos (≥ 3:1). Las etiquetas `// …` sobre fondo claro llevan el texto en navy; el `//` en tech es decorativo (`aria-hidden`).
- [x] **Textos con opacidad sobre oscuro** (blanco al 60–85 %): ≥ 7:1. Errores del formulario en `#FFB4B4` sobre navy: ≥ 9:1.
- [x] **Iconos decorativos** con `aria-hidden="true"`. Los SVG de circuito, la marca de agua y el diagrama son decorativos.
- [x] **Imágenes de marca.** El logo se lee como texto («CERBERUS TECH 39») y no hay imágenes de contenido sin `alt`.
- [x] **Orden de lectura.** El contenido no depende del color: el paquete recomendado lleva además la etiqueta de texto «Recomendado».
- [x] **Ampliación al 200 % y reflujo a 320 px sin scroll horizontal.** Comprobado a 360, 390, 768 y 1024 px con `scripts/check-overflow.mjs`.

## Operabilidad

- [x] **«Saltar al contenido»:** primer elemento enfocable, visible al recibir foco, lleva el foco a `<main>`.
- [x] **Todo el sitio funciona con teclado:**
  - Navegación y CTAs.
  - Tarjetas de servicio: Enter abre el diálogo.
  - Diálogo: Escape lo cierra y el foco vuelve a la tarjeta.
  - Acordeón: Enter y Espacio.
  - Formulario y menú móvil.
- [x] **Menú móvil:** `aria-expanded` y `aria-controls`, trampa de foco, Escape, el foco entra al primer enlace y vuelve al botón al cerrar. Usa `inert` cuando está cerrado.
- [x] **Diálogo nativo `<dialog>` con `showModal()`:** trampa de foco y fondo inerte. Bloquea el scroll de la página.
- [x] **Foco visible** en todo elemento interactivo: contorno de 2 px, azul tech sobre claro y cian sobre oscuro. La tarjeta de servicio muestra el anillo completo (`:has(button:focus-visible)`).
- [x] **Objetivos táctiles ≥ 44 × 44 px:** botones de 48 px; iconos del menú, cerrar y redes de 44 px.
- [x] **`prefers-reduced-motion`:** sin desplazamientos, escalados ni recortes; solo opacidad. El titular no se anima.
- [x] **Nada parpadea ni se anima de forma perpetua.**
- [x] **Sin JavaScript**, todo el contenido es visible: los revelados solo se activan con `@media (scripting: enabled)`.

## Comprensión

- [x] `lang="es-VE"` en `<html>`.
- [x] **Formulario:**
  - Etiqueta `<label>` visible en cada campo; los obligatorios llevan `*` y `aria-required`, los opcionales «(opcional)».
  - Errores en texto, asociados con `aria-describedby` y `aria-invalid`; validación al salir del campo, sin bloquear la escritura.
  - Resultado del envío en una región `role="status"` con `aria-live="polite"`, que recibe el foco.
  - Ejemplo de formato en el campo WhatsApp (`+58 412 000 0000`).
  - Casilla de consentimiento con enlace a la política de privacidad.
- [x] **Enlaces externos** («se abre en una pestaña nueva») anunciados para lectores de pantalla.

## Robustez

- [x] **Landmarks:** `header`, `nav` (Principal y Pie de página), `main` y `footer`. Cada sección es un `<section>` con `aria-labelledby`.
- [x] **Jerarquía de encabezados:** un único `h1` y `h2` por sección, con `h3`/`h4` dentro.
- [x] **Acordeón nativo** `<details>`/`<summary>`, accesible sin JavaScript.
- [x] **Listas semánticas** (`ul`/`ol`/`dl`) sin hijos inválidos (corregido tras la auditoría).
- [x] **Nombres accesibles** que contienen el texto visible (enlace del logo: «CERBERUS TECH 39, ir al inicio»).

## Escenas 3D e imágenes

- [x] **Contenedor de cada escena:** `role="img"` con `aria-label` que describe lo que muestra y cómo se usa. El lienzo y los rótulos internos son `aria-hidden`.
- [x] **Equivalente accesible:** en el hero, una leyenda visible (sede y alcance remoto); en Servicios, las tarjetas con el mismo contenido y el mismo diálogo.
- [x] **Sin trampas de interacción:** la rueda del ratón no hace zoom ni captura el desplazamiento, y en táctil el gesto vertical sigue desplazando la página (`touch-action: pan-y`).
- [x] **Movimiento reducido:** sin giro en reposo, inercia, pulsos ni paquetes de datos; las escenas quedan estáticas, aunque se pueden girar a mano.
- [x] **Tooltips seguros:** se pintan con `textContent` y quedan sobre los rótulos; la órbita se detiene mientras el puntero señala un nodo.
- [x] **Sin WebGL** (o sin GPU) se muestra un respaldo estático en CSS; no se pierde información.
- [x] **Imágenes:** `alt` descriptivo en todas, desde `content/es/site.ts`. El texto que va sobre la imagen de Sectores lleva un degradado navy que garantiza el contraste.

## Pendiente de verificar con personas

- [ ] Prueba con NVDA (Windows) y VoiceOver (iOS/macOS) sobre el sitio publicado.
- [ ] Prueba en un teléfono real (Android de gama media) de los gestos táctiles y del rendimiento percibido.

/**
 * Logo oficial de Cerberus Tech 39, C.A.
 *
 * Los SVG de public/brand/ salen del PDF vectorial oficial (brand/ceerberus.pdf)
 * con scripts/extraer-logo.py: conversión directa de los trazos, sin redibujar
 * ni recolorear. Las dimensiones (en puntos del PDF) evitan saltos de diseño.
 */

const HORIZONTAL = {
  // sobre fondos claros
  color: { src: "/brand/logo-horizontal-color.svg", ancho: 548, alto: 130 },
  // sobre fondos oscuros
  blanco: { src: "/brand/logo-horizontal-blanco.svg", ancho: 551, alto: 130 },
} as const;

const ISOTIPO = {
  color: { src: "/brand/isotipo-color.svg", ancho: 387, alto: 344 },
  blanco: { src: "/brand/isotipo-blanco.svg", ancho: 387, alto: 344 },
} as const;

export const NOMBRE_LEGAL = "Cerberus Tech 39, C.A.";

type Variante = keyof typeof HORIZONTAL;

/** Logo horizontal. `variante="blanco"` se usa sobre fondos oscuros. */
export function Logo({
  variante = "color",
  className = "h-10 w-auto",
  oculto = false,
}: {
  variante?: Variante;
  className?: string;
  /** Se renderiza pero no se muestra (para alternar sin esperar a la descarga). */
  oculto?: boolean;
}) {
  const l = HORIZONTAL[variante];
  return (
    <img
      src={l.src}
      width={l.ancho}
      height={l.alto}
      alt={NOMBRE_LEGAL}
      decoding="async"
      hidden={oculto}
      className={className}
    />
  );
}

/** Isotipo (escudo con las tres cabezas) como imagen de contenido. */
export function Isotipo({
  variante = "color",
  alt,
  className = "",
}: {
  variante?: Variante;
  alt: string;
  className?: string;
}) {
  const i = ISOTIPO[variante];
  return <img src={i.src} width={i.ancho} height={i.alto} alt={alt} loading="lazy" decoding="async" className={className} />;
}

/**
 * Isotipo como marca de agua decorativa: silueta blanca casi transparente.
 * Se pinta con una máscara CSS (no es <img>), así nunca compite como elemento
 * LCP con el titular ni aparece en el árbol de accesibilidad.
 */
export function MarcaDeAgua({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`marca-agua ${className}`} />;
}

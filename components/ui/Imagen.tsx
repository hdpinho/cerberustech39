import { IMAGENES, type NombreImagen } from "@/lib/imagenes";

/**
 * Imagen responsive sin JavaScript: AVIF y WebP en varios anchos, dimensiones
 * explícitas (sin saltos de diseño), carga diferida y una miniatura difuminada
 * de fondo mientras llega la imagen real.
 */
export function Imagen({
  nombre,
  alt,
  sizes,
  className = "",
  imgClassName = "",
  prioridad = false,
  posicion = "center",
}: {
  nombre: NombreImagen;
  alt: string;
  /** Igual que el atributo HTML `sizes`, p. ej. "(min-width: 1024px) 33vw, 100vw". */
  sizes: string;
  className?: string;
  imgClassName?: string;
  prioridad?: boolean;
  /** object-position de la imagen recortada. */
  posicion?: string;
}) {
  const img = IMAGENES[nombre];
  const set = (ext: string) => img.anchos.map((w) => `/img/${nombre}-${w}.${ext} ${w}w`).join(", ");
  const mediano = img.anchos.find((w) => w >= 1200) ?? img.anchos[img.anchos.length - 1];

  return (
    <picture
      className={`imagen block overflow-hidden ${className}`}
      style={{ backgroundImage: `url(${img.lqip})` }}
    >
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`/img/${nombre}-${mediano}.webp`}
        alt={alt}
        width={img.ancho}
        height={img.alto}
        loading={prioridad ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={prioridad ? "high" : "auto"}
        className={`h-full w-full object-cover ${imgClassName}`}
        style={{ objectPosition: posicion }}
      />
    </picture>
  );
}

/**
 * LOGO PROVISIONAL.
 * Por decisión del cliente aún no se usa el logo oficial. Este wordmark y
 * el monograma «39» son marcadores neutros: NO imitan el isotipo del perro
 * de tres cabezas. Cuando llegue el logo oficial, reemplaza solo este
 * archivo (y `Monogram`) por los SVG/PNG de ./brand/.
 */
type Variant = "dark" | "light";

export function Monogram({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d="M0 0H30L40 10V40H0Z" fill="currentColor" />
      <text
        x="19"
        y="27.5"
        textAnchor="middle"
        fontFamily="var(--font-chakra), sans-serif"
        fontWeight="700"
        fontSize="17"
        fill="var(--mono-ink, #fff)"
      >
        39
      </text>
    </svg>
  );
}

/** `variant="light"` se usa sobre fondos oscuros. */
export function Logo({ variant = "dark", className = "" }: { variant?: Variant; className?: string }) {
  const onDark = variant === "light";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Monogram
        className={`h-8 w-8 shrink-0 ${onDark ? "text-cyan [--mono-ink:#040C33]" : "text-navy [--mono-ink:#fff]"}`}
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.05rem] font-bold tracking-[0.08em] ${onDark ? "text-white" : "text-navy"}`}
        >
          CERBERUS
        </span>
        <span
          className={`mt-1 font-mono text-[0.625rem] tracking-[0.32em] ${onDark ? "text-cyan" : "text-tech"}`}
        >
          TECH 39
        </span>
      </span>
    </span>
  );
}

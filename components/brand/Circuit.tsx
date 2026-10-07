/**
 * Trazos de circuito impreso (cian, baja opacidad), como los del isotipo.
 * SVG estático + CSS: las pistas se dibujan una sola vez al cargar y unos
 * pocos nodos laten muy tenue. Sin JS, sin WebGL.
 */

// Pistas con ángulos de 45°, estilo PCB. pathLength=1 normaliza el trazado.
const traces = [
  "M1200 96H930L890 136H720L690 166H560",
  "M1200 168H1010L960 218H840",
  "M1200 252H1060L1020 292H900L870 322H700L660 362H520",
  "M1200 340H1110L1070 380H960",
  "M1200 430H1040L990 480H820L790 450H640",
  "M1200 520H1130L1090 560H930L900 590H760",
  "M1200 610H1000L960 650H820",
  "M980 0V60L940 100V136",
  "M1080 700V620L1110 590V560",
  "M760 700V640L800 600H930",
];

const nodes: [number, number][] = [
  [560, 166],
  [840, 218],
  [520, 362],
  [960, 380],
  [640, 450],
  [760, 590],
  [820, 650],
  [940, 136],
  [1110, 560],
  [930, 600],
];

// Solo estos nodos laten (pocos: animación decorativa, no ruido).
const pulsing = new Set([0, 2, 4]);

export function CircuitField({ className = "", animated = true }: { className?: string; animated?: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMaxYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="var(--color-cyan)" strokeWidth="1.25" strokeLinecap="square" opacity="0.38">
        {traces.map((d, i) => (
          <path
            key={d}
            d={d}
            pathLength={1}
            className={animated ? "circuit-trace" : undefined}
            style={{ "--i": i, "--len": 1 } as React.CSSProperties}
          />
        ))}
      </g>
      <g fill="var(--color-deep)" stroke="var(--color-cyan)" strokeWidth="1.25">
        {nodes.map(([cx, cy], i) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={pulsing.has(i) ? 5 : 3.5}
            opacity={pulsing.has(i) ? undefined : 0.45}
            className={animated && pulsing.has(i) ? "circuit-node" : undefined}
            style={{ "--i": i } as React.CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}

/** Marca de agua grande y casi transparente (sustituye al isotipo mientras no haya logo oficial). */
export function Watermark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M40 40H300L360 100V360H40Z" />
        <path d="M80 80H284L320 116V320H80Z" opacity="0.6" />
        <path d="M120 200H200L230 170H320M200 200V280L230 310H320M120 140H170L200 110V40" opacity="0.8" />
        <circle cx="120" cy="200" r="6" />
        <circle cx="120" cy="140" r="6" />
        <circle cx="320" cy="170" r="6" />
        <circle cx="320" cy="310" r="6" />
      </g>
    </svg>
  );
}

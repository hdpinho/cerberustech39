import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

type Tone = "light" | "surface" | "dark";

const toneClass: Record<Tone, string> = {
  light: "bg-white text-ink",
  surface: "bg-surface text-ink",
  dark: "bg-dark on-dark",
};

/**
 * Sección con ancla. `data-tone` lo lee la navbar para cambiar entre
 * logo claro y oscuro según la sección que tiene debajo.
 */
export function Section({
  id,
  tone = "light",
  labelledBy,
  className = "",
  children,
}: {
  id?: string;
  tone?: Tone;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-tone={tone === "dark" ? "dark" : "light"}
      aria-labelledby={labelledBy}
      className={`cv-auto relative overflow-hidden py-20 sm:py-24 lg:py-32 ${toneClass[tone]} ${className}`}
    >
      {children}
    </section>
  );
}

/** `// etiqueta`. El prefijo es decorativo; el texto conserva contraste AA. */
export function MonoLabel({ children, dark = false, className = "" }: { children: string; dark?: boolean; className?: string }) {
  const text = children.replace(/^\/\/\s*/, "");
  return (
    <p className={`mono-label ${dark ? "text-cyan" : "text-navy"} ${className}`}>
      <span aria-hidden="true" className={dark ? "text-cyan/60" : "text-tech"}>
        //{" "}
      </span>
      {text}
    </p>
  );
}

export function SectionHeader({
  id,
  label,
  title,
  intro,
  dark = false,
  className = "",
}: {
  id: string;
  label: string;
  title: string;
  intro?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <header className={`max-w-[46rem] ${className}`}>
      <div data-reveal>
        <MonoLabel dark={dark}>{label}</MonoLabel>
      </div>
      <h2
        id={id}
        data-reveal="clip"
        className={`mt-4 text-[2rem] leading-[1.1] font-bold tracking-[-0.01em] sm:text-[2.5rem] lg:text-[3rem] ${dark ? "text-white" : "text-navy"}`}
      >
        <span className="clip-inner">{title}</span>
      </h2>
      {intro ? (
        <p
          data-reveal
          style={{ "--i": 1 } as React.CSSProperties}
          className={`mt-5 text-lg leading-relaxed text-pretty ${dark ? "text-white/75" : "text-ink/70"}`}
        >
          {intro}
        </p>
      ) : null}
    </header>
  );
}

export function Chip({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 font-mono text-[0.75rem] leading-none ${
        dark ? "bg-white/[0.06] text-cyan ring-1 ring-cyan/20 ring-inset" : "bg-surface text-navy ring-1 ring-line ring-inset"
      }`}
    >
      {children}
    </span>
  );
}

type ButtonVariant = "primary" | "primaryDark" | "ghost" | "ghostDark";

const btn: Record<ButtonVariant, string> = {
  // Sobre claro: navy con texto blanco
  primary: "[--bevel-bg:var(--color-navy)] [--bevel-border:var(--color-navy)] text-white hover-tech",
  // Sobre oscuro: cian con texto deep (CTA sobre oscuro)
  primaryDark: "[--bevel-bg:var(--color-cyan)] [--bevel-border:var(--color-cyan)] text-deep hover-white brillo-cian",
  // El fondo del bisel debe ser opaco: la capa del borde está debajo.
  ghost: "[--bevel-bg:#fff] [--bevel-border:var(--color-line)] text-navy hover-border-navy",
  ghostDark: "[--bevel-bg:var(--color-deep)] [--bevel-border:rgb(162_217_249/0.4)] text-white hover-border-cyan",
};

export function buttonClass(variant: ButtonVariant = "primary", extra = "") {
  return `bevel bevel-sm press inline-flex min-h-12 items-center justify-center gap-2 px-6 font-display text-[0.95rem] font-semibold tracking-[0.02em] whitespace-nowrap select-none ${btn[variant]} ${extra}`;
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">) {
  return (
    <a href={href} className={buttonClass(variant, className)} {...rest}>
      {children}
    </a>
  );
}

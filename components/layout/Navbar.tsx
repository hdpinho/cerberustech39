"use client";

import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { buttonClass } from "@/components/ui/primitives";
import type { SiteContent } from "@/content/types";

type Tone = "dark" | "light";

export function Navbar({ nav }: { nav: SiteContent["nav"] }) {
  const [tone, setTone] = useState<Tone>("dark");
  const [atTop, setAtTop] = useState(true);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Tono de la sección que está justo debajo de la barra.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-tone]"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const probe = 34; // mitad de la altura de la barra
      const current = sections.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= probe && r.bottom > probe;
      });
      setTone((current?.dataset.tone as Tone) ?? "light");
      setAtTop(window.scrollY < 8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Menú móvil: Escape, trampa de foco y cierre al pasar a escritorio.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    // Tras el commit: el panel deja de ser inert/invisible en este render.
    const t = window.setTimeout(() => panel?.querySelector<HTMLElement>("a")?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !panel) return;
      const focusables = [toggleRef.current, ...panel.querySelectorAll<HTMLElement>("a")].filter(
        Boolean,
      ) as HTMLElement[];
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && close(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  const dark = tone === "dark";
  const solid = !atTop || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-[background-color,border-color] duration-200 ease-[var(--ease-out)] ${
        dark ? "on-dark text-white" : "text-navy"
      } ${
        solid
          ? dark
            ? "border-b border-white/10 bg-deep/75 backdrop-blur-md backdrop-saturate-150"
            : "border-b border-line bg-white/85 backdrop-blur-md backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Principal" className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="-m-1 p-1">
          <Logo variant={dark ? "light" : "dark"} />
          <span className="sr-only">, ir al inicio</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`rounded-sm px-3 py-2 text-[0.9375rem] font-medium transition-colors duration-150 ${
                  dark ? "text-white/80 hover:text-white" : "text-navy/80 hover:text-navy"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#contacto" className={buttonClass(dark ? "primaryDark" : "primary", "min-h-10 px-5 text-[0.875rem] max-md:hidden")}>
            {nav.cta}
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="press -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-sm lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? nav.closeMenu : nav.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Panel móvil: se despliega desde la esquina del botón que lo abre */}
      <div
        id="menu-movil"
        ref={panelRef}
        inert={!open}
        className={`absolute inset-x-3 top-[calc(var(--header-h)-4px)] origin-top-right lg:hidden ${
          open
            ? "visible scale-100 opacity-100 transition-[opacity,scale,translate] duration-200 ease-[var(--ease-out)]"
            : "invisible scale-[0.96] -translate-y-1 opacity-0 motion-reduce:translate-y-0 motion-reduce:scale-100 transition-[opacity,scale,translate,visibility] duration-150 ease-[var(--ease-out)]"
        }`}
      >
        <div className="bevel [--bevel-bg:var(--color-deep)] [--bevel-border:rgb(162_217_249/0.25)] on-dark p-2 text-white shadow-2xl shadow-deep/40">
          <ul className="flex flex-col">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => close(false)}
                  className="flex min-h-12 items-center px-4 font-display text-lg font-semibold text-white/90 active:text-cyan"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contacto" onClick={() => close(false)} className={buttonClass("primaryDark", "mt-2 w-full")}>
            {nav.cta}
          </a>
        </div>
      </div>
    </header>
  );
}

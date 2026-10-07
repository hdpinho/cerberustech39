import Script from "next/script";

/**
 * Analítica respetuosa con la privacidad, DESACTIVADA por defecto.
 * Actívala en `.env` con NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible|umami
 * (ver README). Plausible y Umami no usan cookies de seguimiento.
 * Si se activa, recuerda añadir su dominio a la CSP de vercel.json / _headers.
 */
export function Analytics() {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;

  if (provider === "plausible" && process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
    return (
      <Script
        defer
        strategy="afterInteractive"
        data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
        src={process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js"}
      />
    );
  }

  if (provider === "umami" && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && process.env.NEXT_PUBLIC_UMAMI_SRC) {
    return (
      <Script
        defer
        strategy="afterInteractive"
        data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        src={process.env.NEXT_PUBLIC_UMAMI_SRC}
      />
    );
  }

  return null;
}

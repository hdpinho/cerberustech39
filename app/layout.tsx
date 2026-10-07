import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@/components/layout/Analytics";
import { CookieNotice } from "@/components/layout/CookieNotice";
import { WhatsAppFloating } from "@/components/ui/WhatsAppFloating";
import { siteUrl } from "@/content/config";
import { getContent, htmlLang, defaultLocale } from "@/content";
import "./globals.css";

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-chakra",
});
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false, // solo etiquetas pequeñas: no compite con el titular
  variable: "--font-jetbrains",
});

const c = getContent();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: c.meta.title, template: `%s · ${c.company.shortName}` },
  description: c.meta.description,
  applicationName: c.company.shortName,
  alternates: { canonical: "/" },
  // Logo PROVISIONAL (scripts/gen-assets.mjs). Sustituir por el oficial.
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: "/",
    siteName: c.company.shortName,
    title: c.meta.title,
    description: c.meta.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: c.meta.ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: c.meta.title,
    description: c.meta.description,
    images: [{ url: "/og.png", alt: c.meta.ogAlt }],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#040C33",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={htmlLang[defaultLocale]} className={`${chakra.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <a
          href="#contenido"
          className="fixed top-3 left-3 z-[100] -translate-y-24 bg-cyan px-4 py-3 font-display font-semibold text-deep focus:translate-y-0"
        >
          {c.nav.skip}
        </a>
        {children}
        <WhatsAppFloating message={c.contact.whatsappMessage} />
        <Analytics />
        {process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ? <CookieNotice /> : null}
      </body>
    </html>
  );
}

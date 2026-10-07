import type { NextConfig } from "next";

// Sitio 100 % estático: `npm run build` genera la carpeta `out/`,
// lista para Vercel o Cloudflare Pages. Las cabeceras de seguridad
// viven en `vercel.json` y `public/_headers` (Next no las aplica en export).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;

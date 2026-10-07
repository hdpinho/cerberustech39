import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/privacidad/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}

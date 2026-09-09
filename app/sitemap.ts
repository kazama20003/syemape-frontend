import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/servicios`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/nosotros`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contacto`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}

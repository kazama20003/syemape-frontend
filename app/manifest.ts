import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${COMPANY.brand} | ${COMPANY.slogan}`,
    short_name: COMPANY.brand,
    description: COMPANY.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ed0404",
    lang: "es-PE",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/mape-logo.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}

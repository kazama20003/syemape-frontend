import type { Metadata, Viewport } from "next";
import { Archivo_Black, Kufam, Overpass, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { COMPANY, KEYWORDS, SITE_URL, organizationJsonLd } from "@/lib/seo";

const kufam = Kufam({
  variable: "--font-kufam",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const overpass = Overpass({
  variable: "--font-overpass",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "400",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MAPE | Supervisión & Emergencias — Transporte y Servicios Especializados en Perú",
    template: "%s | MAPE Supervisión & Emergencias",
  },
  description: COMPANY.description,
  keywords: [...KEYWORDS],
  applicationName: COMPANY.brand,
  authors: [{ name: COMPANY.legalName, url: SITE_URL }],
  creator: COMPANY.legalName,
  publisher: COMPANY.legalName,
  category: "Transporte y Logística",
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, email: true },
  icons: {
    icon: [
      { url: "/mape-logo.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/icon-192.png",
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    siteName: `${COMPANY.brand} | ${COMPANY.slogan}`,
    title: "MAPE | Supervisión & Emergencias — Transporte y Servicios Especializados",
    description: COMPANY.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Logo de MAPE Supervisión & Emergencias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAPE | Supervisión & Emergencias",
    description: COMPANY.description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ed0404",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={cn("antialiased", kufam.variable, overpass.variable, archivoBlack.variable, spaceGrotesk.variable)}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        {children}
      </body>
    </html>
  );
}

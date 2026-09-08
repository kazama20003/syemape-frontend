import type { Metadata } from "next";
import { Archivo_Black, Kufam, Overpass, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

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
  title: "MAPE | Transporte y Servicios Especializados",
  description: "S&E MAPE E.I.R.L. - Alquiler de vehículos, supervisión y escolta en ruta, y transporte de carga.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={cn("antialiased", kufam.variable, overpass.variable, archivoBlack.variable, spaceGrotesk.variable)}>
      <body>{children}</body>
    </html>
  );
}

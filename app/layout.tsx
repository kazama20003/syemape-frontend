import type { Metadata } from "next";
import { Kufam, Overpass, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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

export const metadata: Metadata = {
  title: "Reyou",
  description: "Feel like you again.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("antialiased", kufam.variable, overpass.variable, "font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}

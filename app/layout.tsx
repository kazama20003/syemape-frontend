import type { Metadata } from "next";
import { Kufam, Overpass } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className={`${kufam.variable} ${overpass.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}

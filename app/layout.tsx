import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE } from "@/components/reading-views";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const title = "Reading Shelf — Chaowalit Greepoke";
const description = "A small shelf of books and essays in progress, each with one margin note.";

export const metadata: Metadata = {
  title: { default: title, template: "%s — Reading Shelf" },
  description,
  authors: [{ name: "Chaowalit Greepoke (Book)", url: "https://bookchaowalit.com" }],
  creator: "Chaowalit Greepoke (Book)",
  metadataBase: new URL(SITE),
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: SITE, title, description, siteName: "Reading Shelf" },
  twitter: { card: "summary", title, description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The font variables sit on <html>: the Reader shell tokens live on :root and read them from there.
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}><body>{children}</body></html>;
}

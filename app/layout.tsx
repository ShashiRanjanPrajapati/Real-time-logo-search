import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LogoSearch — Instant Brand Logo Discovery",
  description:
    "Search and discover high-quality logos for any brand or company in seconds. Powered by logo.dev.",
  keywords: ["logo search", "brand logo", "company logo", "logo finder"],
  openGraph: {
    title: "LogoSearch — Instant Brand Logo Discovery",
    description: "Search and discover high-quality logos for any brand instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}

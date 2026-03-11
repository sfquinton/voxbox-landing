import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MetaPixel from "@/components/meta-pixel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TheVoxBox",
  description: "Vocal presets that actually work. Used by 16,000+ artists with 100M+ streams generated.",
  openGraph: {
    title: "TheVoxBox",
    description: "Vocal presets that actually work. Used by 16,000+ artists with 100M+ streams generated.",
    url: "https://thevoxbox.xyz",
    siteName: "TheVoxBox",
    type: "website",
    images: [
      {
        url: "https://thevoxbox.xyz/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TheVoxBox",
    description: "Vocal presets that actually work. Used by 16,000+ artists with 100M+ streams generated.",
    images: ["https://thevoxbox.xyz/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}

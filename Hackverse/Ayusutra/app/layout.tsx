import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "upyogi - Panchakarma Patient Management & Therapy Scheduling",
  description:
    "Modern digital platform for authentic Panchakarma therapy management, automated scheduling, and patient care in the growing Ayurveda market.",
  keywords: [
    "Ayurveda",
    "Panchakarma",
    "Patient Management",
    "Therapy Scheduling",
    "Digital Healthcare",
    "AIIA",
    "Ministry of Ayush",
  ],
  authors: [{ name: "All India Institute of Ayurveda (AIIA)" }],
  robots: "index, follow",
  openGraph: {
    title: "upyogi - Panchakarma Patient Management Software",
    description: "Bridging Ancient Wisdom with Modern Technology",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "upyogi Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "upyogi - Panchakarma Patient Management Software",
    description: "Bridging Ancient Wisdom with Modern Technology",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable}`}
      >
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}

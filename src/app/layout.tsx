import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://mudae-spheres.vercel.app";
const siteName = "Mudae Spheres";
const siteDescription =
  "Practice the Mudae sphere minigames ($oh, $oc, $oq, $ot) in a fast, free browser simulator.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Mudae Sphere Minigame Simulator`,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "Mudae",
    "Mudae Bot",
    "Mudae Spheres",
    "Mudae sphere",
    "kakera",
    "minigame",
    "simulator",
    "$oh",
    "$oc",
    "$oq",
    "$ot",
    "Orb Harvest",
    "Orb Chest",
    "Orb Quest",
    "Orb Trace",
    "Discord",
  ],
  authors: [{ name: "Gustavo Lima" }],
  creator: "Gustavo Lima",
  category: "games",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: `${siteName} — Mudae Sphere Minigame Simulator`,
    description: siteDescription,
    locale: "en_US",
    alternateLocale: ["pt_BR"],
    images: [
      {
        url: "/rainbow.webp",
        width: 512,
        height: 512,
        alt: "Mudae Spheres",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${siteName} — Mudae Sphere Minigame Simulator`,
    description: siteDescription,
    images: ["/rainbow.webp"],
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
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#111827",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  applicationCategory: "GameApplication",
  operatingSystem: "Any (Web Browser)",
  browserRequirements: "Requires JavaScript",
  inLanguage: ["en", "pt-BR"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900`}
      >
        <I18nProvider>{children}</I18nProvider>
        <Script
          id="ld-json-webapp"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dries & Verouschka | 19 december 2026",
  description:
    "Een winterse dag om nooit te vergeten. Ontdek alle informatie over de trouwdag van Dries & Verouschka op 19 december 2026.",
  applicationName: "Dries & Verouschka",
  keywords: [
    "Dries en Verouschka",
    "trouwdag",
    "bruiloft",
    "winterbruiloft",
    "19 december 2026",
  ],
  authors: [{ name: "Dries & Verouschka" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "nl_BE",
    siteName: "Dries & Verouschka",
    title: "Dries & Verouschka",
    description: "19 december 2026 · Onze trouwdag",
    images: [
      {
        url: "/images/hero.jpg",
        alt: "Dries & Verouschka · 19 december 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dries & Verouschka",
    description: "19 december 2026 · Onze trouwdag",
    images: ["/images/hero.jpg"],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#10261d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} ${cormorant.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/ai/ChatWidget";
import { PERSON_JSON_LD } from "@/lib/profile";

const SITE_URL = "https://navdeepbhanderi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Navdeep Bhanderi — Software Engineer",
    template: "%s — Navdeep Bhanderi",
  },
  description:
    "Software engineer building AI-powered products, modern web applications, and scalable digital experiences with Next.js, React, Angular, and Node.js.",
  keywords: [
    "Navdeep Bhanderi",
    "Software Engineer",
    "Full-stack Developer",
    "Next.js",
    "React",
    "Angular",
    "Node.js",
    "AI",
    "Generative AI",
    "Web3",
    "India",
  ],
  authors: [{ name: "Navdeep Bhanderi", url: SITE_URL }],
  creator: "Navdeep Bhanderi",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Navdeep Bhanderi",
    title: "Navdeep Bhanderi — Software Engineer",
    description:
      "Building AI-powered products, modern web applications, and scalable digital experiences with Next.js, React, Angular, and Node.js.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Navdeep Bhanderi — Software Engineer",
    description:
      "Building AI-powered products, modern web applications, and scalable digital experiences.",
    creator: "@navdeepbhanderi",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="grain antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <ChatWidget />
        </SmoothScroll>
      </body>
    </html>
  );
}

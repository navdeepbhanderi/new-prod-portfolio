import type { Metadata, Viewport } from "next";
import { ViewTransitions } from "next-view-transitions";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { HashScroll } from "@/components/layout/HashScroll";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { Preloader } from "@/components/layout/Preloader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidgetLazy } from "@/components/ai/ChatWidgetLazy";
import { SITE_JSON_LD } from "@/lib/profile";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Navdeep Bhanderi — Software Engineer",
    template: "%s — Navdeep Bhanderi",
  },
  description:
    "Software engineer building AI-powered products and modern web applications with Next.js, React, Angular, and Node.js — end to end, from idea to production.",
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
    "India",
  ],
  authors: [{ name: "Navdeep Bhanderi", url: SITE_URL }],
  creator: "Navdeep Bhanderi",
  publisher: "Navdeep Bhanderi",
  applicationName: "Navdeep Bhanderi — Portfolio",
  category: "technology",
  formatDetection: { telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Navdeep Bhanderi",
    title: "Navdeep Bhanderi — Software Engineer",
    description:
      "Building AI-powered products and modern web applications with Next.js, React, Angular, and Node.js.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Navdeep Bhanderi — Software Engineer",
    description:
      "Building AI-powered products and modern web applications — end to end, from idea to production.",
    creator: "@NavdeepBhanderi",
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
    <ViewTransitions>
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Pre-paint gate: kill the preloader before first paint on repeat
            visits (sessionStorage). Attribute lives on <html>, which React
            does not reconcile — no hydration mismatch. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("nv-intro-done"))document.documentElement.setAttribute("data-intro","done")}catch(e){}`,
          }}
        />
      </head>
      <body className="grain antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <MotionProvider>
            <HashScroll />
            <Preloader />
            <CommandPalette />
            <CustomCursor />
            <ScrollProgress />
            <Navbar />
            <main
              id="main"
              className="relative z-10 rounded-b-[2.5rem] bg-background shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]"
            >
              {children}
            </main>
            <Footer />
            <ChatWidgetLazy />
          </MotionProvider>
        </SmoothScroll>
      </body>
    </html>
    </ViewTransitions>
  );
}

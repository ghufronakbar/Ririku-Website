import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Dela_Gothic_One, Geist, Geist_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/smooth-scroll";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

const sans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Only the decorative リリク uses it, so it is not preloaded.
const jp = Dela_Gothic_One({
  variable: "--font-dela",
  weight: "400",
  subsets: ["latin"],
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  // Without NEXT_PUBLIC_SITE_URL, Vercel's production domain is used for
  // absolute Open Graph URLs.
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author.name, url: site.author.github }],
  keywords: ["Ririku", "macOS", "notch", "synced lyrics", "YouTube Music", "Dynamic Island", "widgets", "LRCLIB", "open source"],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    creator: "@lansProdigy",
  },
};

export const viewport: Viewport = {
  themeColor: "#060608",
  colorScheme: "dark",
};

// Runs before first paint, so a repeat visit never flashes the preloader. The
// flag also lives on window because React resets <html> attributes when it
// hydrates; the preloader puts the attribute back (see preloader.tsx).
const introScript = `try{var s=!!sessionStorage.getItem("ririku-intro")||matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){s=true}if(s){window.__ririkuSkipIntro=true;document.documentElement.dataset.intro="skip"}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} ${jp.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style>{"[data-preloader]{display:none}.reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body className="min-h-full overflow-x-clip">
        <SmoothScroll>{children}</SmoothScroll>
        <div aria-hidden className="grain animate-grain" />
      </body>
    </html>
  );
}

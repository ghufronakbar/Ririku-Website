import type { ReactNode } from "react";
import "lenis/dist/lenis.css";
import "@/app/globals.css";
import { fontVariables } from "@/components/fonts";
import { SmoothScroll } from "@/components/smooth-scroll";
import { defaultLocale, LANG_KEY, type Locale } from "@/i18n/config";

// Runs before first paint, so a repeat visit never flashes the preloader. The
// flag also lives on window because React resets <html> attributes when it
// hydrates; the preloader puts the attribute back (see preloader.tsx).
const introScript = `try{var s=!!sessionStorage.getItem("ririku-intro")||matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){s=true}if(s){window.__ririkuSkipIntro=true;document.documentElement.dataset.intro="skip"}`;

// On the English root only: send first-time visitors whose browser prefers
// Bahasa Indonesia or Japanese to their page, like the app follows macOS. A
// language picked in the switcher is remembered and always wins.
const languageScript = `try{if(!localStorage.getItem("${LANG_KEY}")){var n=((navigator.languages&&navigator.languages[0])||navigator.language||"").toLowerCase().slice(0,2);if(n==="id"||n==="ja")location.replace("/"+n+"/"+location.search+location.hash)}}catch(e){}`;

/** The <html> shell shared by every language's root layout. */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} suppressHydrationWarning className={`${fontVariables} antialiased`}>
      {/* eslint-disable-next-line @next/next/no-head-element -- this is the root layouts' shell, where <head> belongs */}
      <head>
        {locale === defaultLocale && <script dangerouslySetInnerHTML={{ __html: languageScript }} />}
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

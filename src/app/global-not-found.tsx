import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/components/fonts";
import { locales, localeNames, localePath } from "@/i18n/config";

export const metadata: Metadata = {
  title: "404 — Ririku",
  description: "This page is not here.",
};

// Shown for any URL outside the three language pages.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${fontVariables} antialiased`}>
      <body className="flex min-h-svh flex-col items-center justify-center gap-8 px-5 text-center">
        <p className="kicker">404</p>
        <h1 className="display text-[clamp(3rem,12vw,10rem)] lowercase">
          off the
          <br />
          notch.
        </h1>
        <p className="max-w-sm text-[15px] leading-relaxed text-mute">This page is not here. Head back to Ririku in your language.</p>
        <ul className="flex flex-wrap justify-center gap-3">
          {locales.map((locale) => (
            <li key={locale}>
              <a href={localePath(locale)} lang={locale} className="inline-flex h-11 items-center rounded-full border border-paper/20 px-5 text-sm transition-colors hover:border-coral hover:text-coral">
                {localeNames[locale].name}
              </a>
            </li>
          ))}
        </ul>
      </body>
    </html>
  );
}

import { Bricolage_Grotesque, Dela_Gothic_One, Geist, Geist_Mono } from "next/font/google";

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

// The decorative リリク, and headings on the Japanese page. Not preloaded: the
// browser fetches only the glyph slices a page uses.
const jp = Dela_Gothic_One({
  variable: "--font-dela",
  weight: "400",
  subsets: ["latin"],
  preload: false,
});

export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable} ${jp.variable}`;

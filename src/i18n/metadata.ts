import type { Metadata, Viewport } from "next";
import { site, siteUrl } from "@/content/site";
import { locales, localePath, ogLocales, type Locale } from "./config";
import { getDictionary } from "./index";

export const viewport: Viewport = {
  themeColor: "#060608",
  colorScheme: "dark",
};

/** Title, description, hreflang alternates and a share image for one locale. */
export function buildMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  const image = { url: `/og/${locale}.jpg`, width: 1200, height: 630, alt: t.meta.ogAlt };

  return {
    metadataBase: new URL(siteUrl),
    title: t.meta.title,
    description: t.meta.description,
    applicationName: site.name,
    authors: [{ name: site.author.name, url: site.author.github }],
    keywords: ["Ririku", "macOS", "notch", "synced lyrics", "YouTube Music", "Dynamic Island", "widgets", "LRCLIB", "open source"],
    alternates: {
      canonical: localePath(locale),
      languages: { ...Object.fromEntries(locales.map((l) => [l, localePath(l)])), "x-default": "/" },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      url: localePath(locale),
      locale: ogLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      creator: site.author.xHandle,
      images: [image],
    },
  };
}

import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { locales, localePath } from "@/i18n/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, new URL(localePath(l), siteUrl).href]));
  return locales.map((locale) => ({
    url: new URL(localePath(locale), siteUrl).href,
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages },
  }));
}

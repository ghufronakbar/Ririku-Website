export const locales = ["en", "id", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  id: { short: "ID", name: "Bahasa Indonesia" },
  ja: { short: "JA", name: "日本語" },
};

/** Open Graph locale codes. */
export const ogLocales: Record<Locale, string> = { en: "en_US", id: "id_ID", ja: "ja_JP" };

/** English lives at the root; the others under their code. */
export function localePath(locale: Locale) {
  return locale === defaultLocale ? "/" : `/${locale}/`;
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** localStorage key for a language the visitor picked themselves. */
export const LANG_KEY = "ririku-lang";

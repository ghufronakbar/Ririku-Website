"use client";

import { LANG_KEY, localeNames, localePath, locales, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/cn";

function remember(locale: Locale) {
  try {
    localStorage.setItem(LANG_KEY, locale);
  } catch {}
}

/**
 * Links to the other language pages. Picking one is remembered, so the
 * English root stops sending this visitor to their browser's language.
 */
export function LanguageSwitcher({ variant = "pill", className }: { variant?: "pill" | "list"; className?: string }) {
  const { locale, t } = useI18n();

  if (variant === "list") {
    return (
      <ul aria-label={t.nav.language} className={cn("flex flex-wrap gap-2", className)}>
        {locales.map((l) => (
          <li key={l}>
            <a
              href={localePath(l)}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "page" : undefined}
              onClick={() => remember(l)}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-4 text-[13px] transition-colors",
                l === locale ? "border-paper bg-paper text-ink" : "border-paper/20 text-paper/80 hover:border-coral hover:text-coral",
              )}
            >
              {localeNames[l].name}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul aria-label={t.nav.language} className={cn("flex items-center rounded-full bg-paper/8 p-1 backdrop-blur", className)}>
      {locales.map((l) => (
        <li key={l}>
          <a
            href={localePath(l)}
            hrefLang={l}
            lang={l}
            title={localeNames[l].name}
            aria-current={l === locale ? "page" : undefined}
            onClick={() => remember(l)}
            className={cn(
              "grid h-7 min-w-9 place-items-center rounded-full px-2 font-mono text-[11px] tracking-[0.08em] transition-colors duration-300",
              l === locale ? "bg-paper text-ink" : "text-paper/70 hover:text-paper",
            )}
          >
            {localeNames[l].short}
          </a>
        </li>
      ))}
    </ul>
  );
}

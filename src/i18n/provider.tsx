"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

const I18nContext = createContext<{ locale: Locale; t: Dictionary } | null>(null);

/** Gives client components the page's locale and its dictionary. */
export function I18nProvider({ locale, t, children }: { locale: Locale; t: Dictionary; children: ReactNode }) {
  const value = useMemo(() => ({ locale, t }), [locale, t]);
  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}

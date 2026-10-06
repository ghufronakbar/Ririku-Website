import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RootDocument } from "@/components/root-document";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { buildMetadata, viewport as sharedViewport } from "@/i18n/metadata";

// Every language except English, which lives at the root: /id/ and /ja/.
export const dynamicParams = false;
export const viewport = sharedViewport;

export function generateStaticParams() {
  return locales.filter((locale) => locale !== defaultLocale).map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? buildMetadata(lang) : {};
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();
  return <RootDocument locale={lang}>{children}</RootDocument>;
}

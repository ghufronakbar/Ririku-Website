import { notFound } from "next/navigation";
import { Landing } from "@/components/landing";
import { isLocale } from "@/i18n/config";

export default async function LocalePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <Landing locale={lang} />;
}

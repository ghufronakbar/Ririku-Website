import { RootDocument } from "@/components/root-document";
import { buildMetadata, viewport as sharedViewport } from "@/i18n/metadata";

// English, at the site root.
export const metadata = buildMetadata("en");
export const viewport = sharedViewport;

export default function EnglishLayout({ children }: LayoutProps<"/">) {
  return <RootDocument locale="en">{children}</RootDocument>;
}

import { Hero } from "@/components/hero/hero";
import { Nav } from "@/components/nav";
import { NotchIsland } from "@/components/notch-island";
import { Preloader } from "@/components/preloader";
import { Cta } from "@/components/sections/cta";
import { Features } from "@/components/sections/features";
import { Footer } from "@/components/sections/footer";
import { Install } from "@/components/sections/install";
import { Lyrics } from "@/components/sections/lyrics";
import { Pages } from "@/components/sections/pages";
import { Privacy } from "@/components/sections/privacy";
import { SetupGallery } from "@/components/sections/setup-gallery";
import { Statement } from "@/components/sections/statement";
import { WorksWith } from "@/components/sections/works-with";
import { site } from "@/content/site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  description: site.description,
  operatingSystem: "macOS 14 or later",
  applicationCategory: "MultimediaApplication",
  softwareVersion: site.version,
  downloadUrl: site.links.download,
  license: "https://opensource.org/licenses/MIT",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: site.author.name, url: site.author.github },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <a href="#statement" className="sr-only z-[110] rounded-full bg-paper px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Preloader />
      <Nav />
      <NotchIsland />
      <main>
        <Hero />
        <Statement />
        <Features />
        <WorksWith />
        <Lyrics />
        <Pages />
        <SetupGallery />
        <Privacy />
        <Install />
        <Cta />
      </main>
      <Footer />
    </>
  );
}

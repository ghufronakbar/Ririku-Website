# Ririku website

The landing site for [Ririku](https://github.com/ghufronakbar/Ririku), the macOS app that shows music and synced lyrics in your MacBook's notch. Live at [ririku.lans.my.id](https://ririku.lans.my.id), in English, Bahasa Indonesia and 日本語.

Built with Next.js 16 (App Router) as a static export, Tailwind CSS 4, [Motion](https://motion.dev) for animation, and [Lenis](https://lenis.darkroom.engineering) for smooth scrolling.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in out/
npm run lint
```

## Where things are

| Path | What |
| --- | --- |
| `src/i18n/dictionaries/` | Every word on the page, one file per language (`en.ts`, `id.ts`, `ja.ts`). Edit these for copy. |
| `src/content/site.ts` | What doesn't change between languages: version, links, the demo song, which screenshot goes where. |
| `src/components/landing.tsx` | The section order. |
| `src/components/sections/` | One file per section. |
| `src/components/hero/hero-art.tsx` | The WebGL hero: the app icon's character with drift, cursor ripple, halftone glow and the blinds intro. Falls back to a plain image for reduced motion or without WebGL. |
| `src/components/notch-island.tsx` | The live notch island fixed at the top of the page. It expands into the panel on hover or tap. |
| `src/lib/lyric-clock.ts` | The shared playback clock behind the island and the lyrics section. |
| `assets/` | Source PNGs (screenshots and the app icon). Not deployed. |
| `public/media/` | Generated AVIF/WebP variants. Don't edit by hand. |
| `public/og/` | Share images, one per language. |

## Languages

English lives at `/`, Bahasa Indonesia at `/id/`, and Japanese at `/ja/`. Each page has its own `<html lang>`, title, description, canonical URL, hreflang links and share image, and `sitemap.xml` lists all three.

- On a first visit to `/`, a browser set to Indonesian or Japanese is sent to its page, the way the app follows the macOS language. Choosing a language in the switcher (top bar, menu, footer) is remembered and always wins.
- Japanese headings use Dela Gothic One; the browser downloads only the glyphs a page needs. Setup page and widget names follow the app's own translations.
- To change a translation, edit the dictionary. TypeScript checks that `id.ts` and `ja.ts` have the same keys as `en.ts`.
- To add a language: add its code to `src/i18n/config.ts`, add a dictionary, register it in `src/i18n/index.ts`, and add a share image in `public/og/`.

## Images

A static export has no image server, so images are resized ahead of time. After changing anything in `assets/`, run:

```bash
npm run images
```

This writes `public/media/*` and `src/content/media.json`, and regenerates the favicon and touch icons in `src/app`. Use `<Picture slug="…">` (`src/components/picture.tsx`) to show one.

The share images in `public/og/` are 1200 × 630 captures of each language's hero; replace them if the hero changes.

## Deploy

Vercel builds this as a static site with no extra settings. Absolute URLs (canonical, hreflang, share images, sitemap) use `https://ririku.lans.my.id`; set `NEXT_PUBLIC_SITE_URL` to override it, for example on a preview domain.

## Motion and accessibility

- With `prefers-reduced-motion`, the preloader and WebGL art are skipped, scroll-linked movement is turned off (the Setup gallery still moves sideways as you scroll), and Lenis scrolls natively.
- The preloader plays once per browser session.
- Without JavaScript, all content is visible and the preloader is hidden.
- The demo song (「ノッチの下で」) is original, so the site never animates someone else's lyrics.

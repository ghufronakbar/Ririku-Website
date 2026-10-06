# Ririku website

The one-page landing site for [Ririku](https://github.com/ghufronakbar/Ririku), the macOS app that shows music and synced lyrics in your MacBook's notch.

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
| `src/content/site.ts` | Every word and link on the page: copy, nav, FAQ, version, the demo song's lyrics. Edit this first. |
| `src/app/page.tsx` | The section order. |
| `src/components/sections/` | One file per section. |
| `src/components/hero/hero-art.tsx` | The WebGL hero: the app icon's character with drift, cursor ripple, halftone glow and the blinds intro. Falls back to a plain image for reduced motion or without WebGL. |
| `src/components/notch-island.tsx` | The live notch island fixed at the top of the page. It expands into the panel on hover or tap. |
| `src/lib/lyric-clock.ts` | The shared playback clock behind the island and the lyrics section. |
| `public/assets/` | Source PNGs (screenshots and the app icon). |
| `public/media/` | Generated AVIF/WebP variants. Don't edit by hand. |

## Images

A static export has no image server, so images are resized ahead of time. After changing anything in `public/assets`, run:

```bash
npm run images
```

This writes `public/media/*` and `src/content/media.json`, and regenerates the favicon and touch icons in `src/app`. Use `<Picture slug="…">` (`src/components/picture.tsx`) to show one.

`src/app/opengraph-image.jpg` is a 1200 × 630 capture of the hero; replace it if the hero changes.

## Deploy

Vercel builds this as a static site with no extra settings. Open Graph URLs use the project's production domain automatically. To override it, set `NEXT_PUBLIC_SITE_URL` (for example `https://ririku.example`).

## Motion and accessibility

- With `prefers-reduced-motion`, the preloader and WebGL art are skipped, scroll-linked movement is turned off (the Setup gallery still moves sideways as you scroll), and Lenis scrolls natively.
- The preloader plays once per browser session.
- Without JavaScript, all content is visible and the preloader is hidden.
- The demo song (「ノッチの下で」) is original, so the site never animates someone else's lyrics.

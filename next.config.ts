import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML, one page per language, exported to out/ at build time.
  output: "export",
  // Images are pre-sized into public/media by `npm run images`; there is no
  // image server in a static export.
  images: { unoptimized: true },
  // /id/ and /ja/ export as folders with index.html, which any static host serves.
  trailingSlash: true,
  // One 404 page for all three root layouts (one per language).
  experimental: { globalNotFound: true },
};

export default nextConfig;

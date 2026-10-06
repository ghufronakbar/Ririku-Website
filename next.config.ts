import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // One static page, exported to out/ at build time.
  output: "export",
  // Images are pre-sized into public/media by `npm run images`; there is no
  // image server in a static export.
  images: { unoptimized: true },
};

export default nextConfig;

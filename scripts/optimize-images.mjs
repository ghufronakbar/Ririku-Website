// Turns the source PNGs in assets/ into responsive AVIF and WebP files in
// public/media, and writes src/content/media.json with each image's size and
// widths. Run with `npm run images` after changing anything in assets/. The
// sources stay outside public/ so they are not deployed.
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const sourceDir = path.join(root, "assets");
const outDir = path.join(root, "public/media");
const manifestPath = path.join(root, "src/content/media.json");

// slug: [source file, widths to emit]. A width above the source width is an
// upscale, used only for the hero art so it stays sharp on large screens.
const images = {
  character: ["AppIcon.png", [640, 1280, 2048]],
  artwork: ["AppIcon.png", [96, 192]],
  island: ["1-lyrics-notch-preview.png", [329, 658]],
  "panel-music": ["2-music-panel-preview.png", [519, 1038]],
  "panel-system": ["3-system-widgets-preview.png", [519, 1038]],
  "panel-focus": ["4-focus-timer-notes-preview.png", [519, 1038]],
  "panel-today": ["5-today-shortcuts-preview.png", [519, 1038]],
  "panel-tray": ["6-airdrop-tray-preview.png", [519, 1038]],
  "setup-general": ["8-general-setup.png", [960, 1896]],
  "setup-tutorial": ["9-tutorial-setup.png", [960, 1896]],
  "setup-language": ["10-language-setup.png", [960, 1896]],
  "setup-keyboard": ["11-keyboard-setup.png", [960, 1896]],
  "setup-layout": ["12-layout-setup.png", [960, 1896]],
  "setup-widgets": ["13-widgets-setup.png", [960, 1896]],
  "setup-appearance": ["14-appearance-setup.png", [960, 1896]],
  "setup-browser": ["15-browser-connection-setup.png", [960, 1896]],
  "setup-music-source": ["16-music-source-setup.png", [960, 1896]],
  "setup-lyrics": ["17-lyrics-setup.png", [960, 1896]],
  "setup-about": ["18-about-setup.png", [960, 1896]],
};

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const manifest = {};
for (const [slug, [file, widths]] of Object.entries(images)) {
  const input = path.join(sourceDir, file);
  const { width, height } = await sharp(input).metadata();
  for (const w of widths) {
    const resized = sharp(input).resize({ width: w, kernel: "lanczos3" });
    if (w > width) resized.sharpen({ sigma: 0.7 });
    const base = path.join(outDir, `${slug}-${w}`);
    await resized.clone().avif({ quality: 58, effort: 4 }).toFile(`${base}.avif`);
    await resized.clone().webp({ quality: 82, effort: 5 }).toFile(`${base}.webp`);
  }
  manifest[slug] = { width, height, widths };
}

// Favicon and touch icon: the face from the app icon, with rounded corners.
const face = sharp(path.join(sourceDir, "AppIcon.png")).extract({ left: 170, top: 150, width: 600, height: 600 });
const rounded = (size) =>
  Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.24}" fill="#fff"/></svg>`,
  );
for (const [name, size, round] of [
  ["icon.png", 192, true],
  ["apple-icon.png", 180, false],
]) {
  let img = face.clone().resize(size, size);
  if (round) img = img.composite([{ input: rounded(size), blend: "dest-in" }]);
  await img.png({ palette: true, quality: 90 }).toFile(path.join(root, "src/app", name));
}
// favicon.ico holding one 48px PNG, which every current browser accepts.
const png = await face.clone().resize(48, 48).composite([{ input: rounded(48), blend: "dest-in" }]).png().toBuffer();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(0, 0);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(1, 4);
ico.writeUInt8(48, 6);
ico.writeUInt8(48, 7);
ico.writeUInt16LE(1, 10);
ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(png.length, 14);
ico.writeUInt32LE(22, 18);
await writeFile(path.join(root, "src/app/favicon.ico"), Buffer.concat([ico, png]));

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
const files = await readdir(outDir);
console.log(`Wrote ${files.length} files to public/media and ${path.relative(root, manifestPath)}`);

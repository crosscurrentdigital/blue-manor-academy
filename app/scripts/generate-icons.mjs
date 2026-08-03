// Generates placeholder PWA icons — a simple "BMA" monogram crest on a navy
// canvas, since this preview was built without access to Blue Manor
// Academy's real logo file (see AUDIT.md's methodology note: live-fetch
// tooling was unavailable this session). Swap this script's output — or
// just the exported PNGs in public/ — for the real logo before this ever
// goes in front of the client.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "..", "public");

const NAVY = { r: 0x14, g: 0x21, b: 0x3d, alpha: 1 };
const GOLD = "#c9a227";

function crestSvg(size, { border = true } = {}) {
  const strokeWidth = Math.round(size * 0.03);
  const fontSize = Math.round(size * 0.34);
  return Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="rgb(${NAVY.r},${NAVY.g},${NAVY.b})" />
      ${border ? `<rect x="${strokeWidth / 2}" y="${strokeWidth / 2}" width="${size - strokeWidth}" height="${size - strokeWidth}" rx="${Math.round(size * 0.16)}" fill="none" stroke="${GOLD}" stroke-width="${strokeWidth}" />` : ""}
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, 'Playfair Display', serif" font-weight="700"
        font-size="${fontSize}" fill="#f7f4ec" letter-spacing="1">BMA</text>
    </svg>
  `);
}

async function renderIcon(size, outPath, { contentScale = 1, border = true, flatten = false } = {}) {
  const canvasSize = Math.round(size * contentScale);
  const svg = crestSvg(canvasSize, { border });

  let pipeline = sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  }).composite([{ input: await sharp(svg).png().toBuffer(), gravity: "center" }]);

  if (flatten) {
    pipeline = pipeline.flatten({ background: NAVY }).removeAlpha();
  }

  await pipeline.png().toFile(outPath);
}

async function renderFavicon(size, outPath) {
  const svg = crestSvg(size, { border: false });
  await sharp(svg).png().resize(size, size).toFile(outPath);
}

async function main() {
  await mkdir(publicDir, { recursive: true });

  await renderIcon(192, path.join(publicDir, "icon-192.png"), { contentScale: 1 });
  await renderIcon(512, path.join(publicDir, "icon-512.png"), { contentScale: 1 });

  // Maskable — smaller content scale so a circular OS crop doesn't clip the border.
  await renderIcon(192, path.join(publicDir, "icon-maskable-192.png"), { contentScale: 0.7 });
  await renderIcon(512, path.join(publicDir, "icon-maskable-512.png"), { contentScale: 0.7 });

  await renderIcon(180, path.join(publicDir, "apple-touch-icon.png"), { contentScale: 1, flatten: true });

  await renderFavicon(64, path.join(publicDir, "favicon.png"));

  console.log("Generated placeholder PWA icons (BMA monogram) in", publicDir);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

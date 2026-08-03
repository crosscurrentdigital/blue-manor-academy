// Generates PWA icons from Blue Manor Academy's real logo
// (src/assets/brand/logo.jpg — supplied directly by the client-side user,
// pulled from the live site's own header). The source is a circular seal
// badge with its own white/light-gray margin already baked in (a flattened
// JPEG, no alpha channel), so icons are built by containing it on a
// same-toned canvas rather than cropping — the whole seal stays intact and
// legible at every size.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "..", "public");
const logoPath = path.resolve(__dirname, "..", "src", "assets", "brand", "logo.jpg");

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

/**
 * Centers the source logo on a `size`x`size` white canvas. Full-bleed icons
 * use a high contentScale (the seal already has its own margin); maskable
 * icons use a lower one so a circular OS crop can't clip the outer ring.
 */
async function renderIcon(size, outPath, { contentScale = 0.92, flatten = false } = {}) {
  const contentSize = Math.round(size * contentScale);

  const logo = await sharp(logoPath)
    .resize(contentSize, contentSize, { fit: "contain", background: WHITE })
    .toBuffer();

  let pipeline = sharp({
    create: { width: size, height: size, channels: 4, background: WHITE },
  }).composite([{ input: logo, gravity: "center" }]);

  if (flatten) {
    // iOS apple-touch-icon must not have an alpha channel.
    pipeline = pipeline.flatten({ background: WHITE }).removeAlpha();
  }

  await pipeline.png().toFile(outPath);
}

async function main() {
  await mkdir(publicDir, { recursive: true });

  // Full-bleed icons ("any" purpose).
  await renderIcon(192, path.join(publicDir, "icon-192.png"), { contentScale: 0.94 });
  await renderIcon(512, path.join(publicDir, "icon-512.png"), { contentScale: 0.94 });

  // Maskable icons — smaller content scale so a circular OS crop can't clip the seal's own ring.
  await renderIcon(192, path.join(publicDir, "icon-maskable-192.png"), { contentScale: 0.72 });
  await renderIcon(512, path.join(publicDir, "icon-maskable-512.png"), { contentScale: 0.72 });

  // Apple touch icon — full-bleed, no alpha channel.
  await renderIcon(180, path.join(publicDir, "apple-touch-icon.png"), {
    contentScale: 0.94,
    flatten: true,
  });

  // Browser-tab favicon — the seal reads fine small since it's a simple, high-contrast badge.
  await renderIcon(64, path.join(publicDir, "favicon.png"), { contentScale: 1 });

  console.log("Generated PWA icons from the real logo in", publicDir);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

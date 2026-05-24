/**
 * Generate PWA icon PNGs from public/icons/icon.svg.
 *
 * Run once after the SVG changes. Output:
 *   public/icons/icon-192.png    (Android maskable)
 *   public/icons/icon-512.png    (Android maskable, splash)
 *   public/icons/icon-180.png    (iOS apple-touch-icon)
 *
 * Korean text inside the SVG may not render if the system lacks a CJK
 * font — that's fine, the book + heart icon stays correct and that's
 * what users actually see on the home screen.
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, '../public/icons/icon.svg');
const outDir = resolve(__dirname, '../public/icons');
const svg = readFileSync(svgPath);

const sizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'icon-180.png' },
];

for (const { size, name } of sizes) {
  const outPath = resolve(outDir, name);
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`✓ ${name} (${size}×${size})`);
}

console.log('Done.');

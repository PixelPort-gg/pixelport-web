// Renders public/og.png (1200×630), the sitewide default social/OG card.
// Social scrapers and Google Discover ignore SVG og:images, so this bakes the
// brand wordmark onto a branded background as a real PNG. Run once per brand
// change: node scripts/build-og.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const W = 1200;
const H = 630;

const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a0816"/>
      <stop offset="1" stop-color="#14111f"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.78" cy="0.22" r="0.55">
      <stop offset="0" stop-color="#3fd6ce" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#3fd6ce" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.16" cy="0.3" r="0.6">
      <stop offset="0" stop-color="#9268ff" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#9268ff" stop-opacity="0"/>
    </radialGradient>
    <pattern id="px" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  <rect width="${W}" height="${H}" fill="url(#px)"/>
  <text x="600" y="435" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="34" fill="#f5f5f7" opacity="0.92">Play Windows games on your Mac in one click</text>
  <text x="600" y="490" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="500" font-size="26" fill="#8f8ba3">No Wine setup&#160;&#160;·&#160;&#160;No VM&#160;&#160;·&#160;&#160;Built for Apple Silicon</text>
  <text x="600" y="580" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="24" fill="#3fd6ce" letter-spacing="2">pixelport.gg</text>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="2"/>
</svg>`;

const wordmark = await sharp(readFileSync(join(root, 'public/brand/wordmark.svg')))
  .resize({ width: 860 })
  .png()
  .toBuffer();
const { height: wmHeight } = await sharp(wordmark).metadata();

await sharp(Buffer.from(background))
  .composite([{ input: wordmark, left: Math.round((W - 860) / 2), top: Math.round(180 - wmHeight / 2) }])
  .png()
  .toFile(join(root, 'public/og.png'));

console.log('wrote public/og.png');

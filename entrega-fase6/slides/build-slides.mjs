// Gera Vitalis_Fase6_Slides.pdf e PNGs de cada slide.
// Uso: node build-slides.mjs [link-do-youtube]
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(new URL(import.meta.url).pathname);
const out = path.resolve(here, '..');
const video = process.argv[2];
const url = pathToFileURL(path.join(here, 'slides.html')).href + (video ? `?video=${encodeURIComponent(video)}` : '');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(url);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);

fs.mkdirSync(path.join(here, 'png'), { recursive: true });
const slides = await page.$$('section.slide');
for (let i = 0; i < slides.length; i++) {
  await slides[i].screenshot({ path: path.join(here, 'png', `slide-${String(i + 1).padStart(2, '0')}.png`) });
}
await page.pdf({ path: path.join(out, 'Vitalis_Fase6_Slides.pdf'), width: '1920px', height: '1080px', printBackground: true, pageRanges: `1-${slides.length}` });
await browser.close();
console.log(`${slides.length} slides -> ${path.join(out, 'Vitalis_Fase6_Slides.pdf')}`);

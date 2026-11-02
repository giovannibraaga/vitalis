// Gera o PDF dos slides da Fase 7 (1920x1080 por página).
//   node entrega/slides/build-pdf.mjs [link-do-video]
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = path.dirname(new URL(import.meta.url).pathname);
const video = process.argv.slice(2).find((a) => !a.startsWith('--')) || '';
const out = path.resolve(here, '..', 'Vitalis_Fase7_Slides.pdf');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(`file://${here}/index.html${video ? '?video=' + encodeURIComponent(video) : ''}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => document.fonts.check('24px "Material Symbols Rounded"') && document.fonts.check('600 24px Poppins'));
await page.waitForTimeout(500);
await page.pdf({ path: out, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
if (process.argv.includes('--png')) {
  const n = await page.locator('.slide').count();
  for (let i = 0; i < n; i++) await page.locator('.slide').nth(i).screenshot({ path: path.join(process.env.PNG_DIR || here, `slide-${String(i + 1).padStart(2, '0')}.png`) });
}
await browser.close();
console.log(out);

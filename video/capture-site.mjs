// Captura seções reais do website (o site usa WebGL e renderiza devagar no
// navegador headless, então gravamos quadros estáticos de cada seção).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

export const SITE_URL = 'https://vitalis-website-main.vercel.app';
// hero, benefícios (evidências), funcionalidades, IA HUB, CTA final.
// Seções com animação "presa" ao scroll: posição = topo + fração do trecho rolável.
const TARGETS = [{ y: 0 }, { id: 'beneficios', f: 0.2 }, { id: 'funcionalidades', f: 0.5 }, { id: 'hub', f: 0.85 }, { id: 'cta', f: 0.5 }];

export async function captureSite(outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  // 1440x730 com escala 1,2 = 1728x876, o tamanho exato da janela no slide.
  const page = await browser.newPage({ viewport: { width: 1440, height: 730 }, deviceScaleFactor: 1.2 });
  await page.goto(SITE_URL, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(4000);
  const files = [];
  const POSITIONS = await page.evaluate((targets) => targets.map((t) => {
    if (t.id === undefined) return t.y;
    const el = document.getElementById(t.id);
    const s = el.closest('section') || el;
    const r = s.getBoundingClientRect();
    return r.top + window.scrollY + t.f * Math.max(0, r.height - window.innerHeight);
  }), TARGETS);
  for (let i = 0; i < POSITIONS.length; i++) {
    // rola em etapas para disparar as animações de scroll do site
    const from = i ? POSITIONS[i - 1] : 0;
    for (let k = 1; k <= 6; k++) {
      await page.evaluate((y) => window.scrollTo(0, y), from + ((POSITIONS[i] - from) * k) / 6);
      await page.waitForTimeout(250);
    }
    await page.waitForTimeout(5000);
    const f = path.join(outDir, `site-${i}.png`);
    await page.screenshot({ path: f });
    files.push(f);
    console.log('site', i, POSITIONS[i]);
  }
  await browser.close();
  return files;
}

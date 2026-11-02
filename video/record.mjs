// Grava o palco (slides + app real rodando) em tempo real via CDP screencast,
// seguindo a linha do tempo da narração. Salva os quadros JPEG com o instante
// de cada um; o build.mjs monta o vídeo final com o ffmpeg.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { demoActions, makeDemoContext } from './demo.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function record({ timeline, framesDir, base = 'http://localhost:8090', siteShots = [] }) {
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`${base}/stage/index.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate((u) => window.setSiteShots(u), siteShots);
  await page.evaluate(() => window.showScene('intro'));
  // Carrega o app de antemão (splash -> boas-vindas) para a demonstração.
  await page.evaluate((b) => { const f = document.getElementById('app'); f.name = 'app'; f.src = b + '/'; }, base);
  await page.waitForTimeout(3500);
  if (siteShots.length) await page.waitForFunction(() => [...document.images].every((i) => i.complete));

  // Linha do tempo de eventos
  const events = [];
  for (const s of timeline.scenes) {
    events.push({ t: s.start, kind: 'scene', id: s.id });
    for (const c of s.cues) events.push({ t: c.t, kind: 'cue', id: s.id, key: c.key });
    for (const a of demoActions[s.id] || []) {
      const cue = typeof a.at === 'string' ? s.cues.find((c) => c.key === a.at) : null;
      const t = (cue ? cue.t : s.start + (a.at || 0)) + (a.dt || 0);
      events.push({ t, kind: 'action', id: s.id, run: a.run });
    }
  }
  events.sort((a, b) => a.t - b.t);

  const ctx = makeDemoContext(page);
  const frames = [];
  const cdp = await page.context().newCDPSession(page);
  let n = 0;
  cdp.on('Page.screencastFrame', async ({ data, sessionId }) => {
    const t = (Date.now() - t0) / 1000;
    const file = path.join(framesDir, `f${String(n++).padStart(6, '0')}.jpg`);
    fs.writeFileSync(file, Buffer.from(data, 'base64'));
    frames.push({ file, t });
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });

  let t0 = Date.now();
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
  t0 = Date.now();
  // Força um quadro inicial.
  await page.evaluate(() => document.getElementById('stage').classList.toggle('x'));

  let queue = Promise.resolve();
  for (const ev of events) {
    const wait = t0 + ev.t * 1000 - Date.now();
    if (wait > 0) await sleep(wait);
    if (ev.kind === 'scene') {
      page.evaluate((id) => window.showScene(id), ev.id).catch(() => {});
    } else if (ev.kind === 'cue') {
      page.evaluate(([id, k]) => window.cue(id, k), [ev.id, ev.key]).catch(() => {});
    } else {
      queue = queue.then(() => ev.run(ctx)).catch((e) => console.warn(`[demo] ${ev.id}: ${e.message.split('\n')[0]}`));
    }
  }
  const endWait = t0 + timeline.total * 1000 - Date.now();
  if (endWait > 0) await sleep(endWait);
  await cdp.send('Page.stopScreencast');
  await browser.close();

  fs.writeFileSync(path.join(framesDir, 'frames.json'), JSON.stringify({ total: timeline.total, frames }));
  return frames;
}

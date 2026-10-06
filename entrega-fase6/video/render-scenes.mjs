// Renderiza as cenas animadas (todas exceto a demonstração) quadro a quadro, de forma determinística.
// Saída: build/seg/<cena>.mp4 e build/timeline-<cena>.json
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BUILD = path.join(HERE, 'build');
const FPS = 30, GAP = 0.2, LEAD = 0.4, TAIL = 0.6;
const narration = JSON.parse(fs.readFileSync(path.join(HERE, 'narration.json')));
const durations = JSON.parse(fs.readFileSync(path.join(BUILD, 'tts', 'durations.json')));
const only = process.argv[2];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(pathToFileURL(path.join(HERE, 'scenes.html')).href);
await page.evaluate(() => document.fonts.ready);
fs.mkdirSync(path.join(BUILD, 'seg'), { recursive: true });

for (const scene of narration.scenes) {
  if (scene.id === 'demo' || (only && scene.id !== only)) continue;
  const beats = [];
  let t = LEAD;
  scene.beats.forEach((_, i) => { beats.push(t); t += durations[`${scene.id}-${i}`] + GAP; });
  const length = t + TAIL + (scene.id === 'encerramento' ? 2.8 : 0);

  const dir = path.join(BUILD, 'frames', scene.id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const list = [];
  let last = null, n = 0;
  const total = Math.round(length * FPS);
  for (let f = 0; f < total; f++) {
    const sig = await page.evaluate(([id, tt, b, l]) => window.renderScene(id, tt, b, l), [scene.id, f / FPS, beats, length]);
    if (sig !== last) {
      const file = path.join(dir, `${String(n++).padStart(5, '0')}.png`);
      await page.screenshot({ path: file });
      list.push({ file, frames: 1 });
      last = sig;
    } else list[list.length - 1].frames++;
  }
  const concat = list.map((e) => `file '${e.file}'\nduration ${(e.frames / FPS).toFixed(5)}`).join('\n') + `\nfile '${list[list.length - 1].file}'\n`;
  fs.writeFileSync(path.join(dir, 'list.txt'), concat);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'),
    '-vf', `fps=${FPS},format=yuv420p`, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-t', length.toFixed(3),
    path.join(BUILD, 'seg', `${scene.id}.mp4`)]);
  fs.writeFileSync(path.join(BUILD, `timeline-${scene.id}.json`), JSON.stringify({ length, beats }));
  console.log(`${scene.id}: ${length.toFixed(1)}s, ${n} quadros únicos`);
}
await browser.close();

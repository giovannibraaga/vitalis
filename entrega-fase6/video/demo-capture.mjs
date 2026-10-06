// Grava a demonstração REAL do app Vitalis (build web do repositório) dentro da moldura de demo.html.
// Uso: node demo-capture.mjs [url-do-app]   (padrão: http://localhost:8090, servido a partir de `npx expo export -p web`)
// Saída: build/seg/demo.mp4 e build/timeline-demo.json (instantes reais de início de cada trecho narrado)
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BUILD = path.join(HERE, 'build');
const APP = (process.argv[2] || 'http://localhost:8090').replace(/\/$/, '');
const durations = JSON.parse(fs.readFileSync(path.join(BUILD, 'tts', 'durations.json')));
const GAP = 0.4, TAIL = 0.6;

const dir = path.join(BUILD, 'frames', 'demo');
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });
fs.mkdirSync(path.join(BUILD, 'seg'), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(pathToFileURL(path.join(HERE, 'demo.html')).href);
await page.evaluate(() => document.fonts.ready);

// Captura via CDP screencast (quadros JPEG com timestamp real)
const cdp = await page.context().newCDPSession(page);
const frames = [];
let n = 0;
cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
  const file = path.join(dir, `${String(n++).padStart(5, '0')}.jpg`);
  fs.writeFileSync(file, Buffer.from(data, 'base64'));
  frames.push({ file, ts: metadata.timestamp });
  try { await cdp.send('Page.screencastFrameAck', { sessionId }); } catch {}
});

page.setDefaultTimeout(8000);
const wait = (ms) => page.waitForTimeout(ms);
const app = () => page.frameLocator('#app');
const frame = () => page.frames().find((f) => f.url().startsWith(APP));
async function tap(locator) {
  // telas anteriores da pilha continuam montadas: usa a ocorrência visível mais recente
  locator = locator.filter({ visible: true }).last();
  await locator.waitFor();
  // coordenadas do elemento dentro do iframe, convertidas para a página (o iframe está em escala 1,12)
  const r = await locator.evaluate((e) => { const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; });
  const f = await page.evaluate(() => { const b = document.getElementById('app').getBoundingClientRect(); return [b.x, b.y, b.width / 390]; });
  const x = f[0] + r[0] * f[2], y = f[1] + r[1] * f[2];
  await page.evaluate(([x, y]) => window.tap(x, y), [x, y]);
  await wait(220);
  await page.mouse.click(x, y);
}
async function scroll(dy, steps = 8) {
  await page.mouse.move(1450, 600);
  for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, dy / steps); await wait(45); }
}

// Ações executadas durante cada trecho da narração
const actions = [
  async () => { await page.evaluate((u) => { document.getElementById('app').src = u + '/'; }, APP); },
  async () => { await wait(1500); await scroll(260); await wait(1200); await scroll(-260); await wait(600); await tap(app().getByText('Entrar', { exact: true })); },
  async () => {
    await app().getByPlaceholder('voce@email.com').last().pressSequentially('marina@email.com', { delay: 45 });
    await app().locator('input[type=password]').last().pressSequentially('senha1234', { delay: 45 });
    await wait(300); await tap(app().getByText('Entrar', { exact: true }));
  },
  async () => {
    await tap(app().getByText('+ Medicamento'));
    await wait(500);
    await app().getByPlaceholder('Ex: Losartana').pressSequentially('Losartana', { delay: 55 });
    await app().getByPlaceholder('Ex: 50 mg').pressSequentially('50 mg', { delay: 55 });
    const plus = app().getByText('+', { exact: true });
    await tap(plus.first()); await wait(250); await tap(plus.first());
    await wait(300); await tap(app().getByText('A cada 12h'));
    await wait(700); await scroll(320);
  },
  async () => {
    await frame().evaluate(() => history.back());
    await wait(600); await tap(app().getByText('Monitorar', { exact: true }));
    await wait(900); await tap(app().getByText('30 dias', { exact: true }));
    await wait(900); await tap(app().getByText('7 dias', { exact: true }));
    await wait(500); await scroll(520, 12);
  },
  async () => {
    await tap(app().getByText('Historico', { exact: true }).last());
    await wait(2200); await tap(app().getByText('Perfil', { exact: true }));
    await wait(900); await tap(app().getByText('Ver analise de adesao'));
  },
  async () => { await wait(2200); await frame().evaluate(() => history.back()); await wait(700); await tap(app().getByText('Hoje', { exact: true })); },
];

await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
await wait(300);
const t0 = Date.now() / 1000;
const beats = [];
await wait(600);
for (let i = 0; i < actions.length; i++) {
  const start = Date.now() / 1000;
  beats.push(start - t0);
  await page.evaluate((k) => window.setStep(k), i);
  try { await actions[i](); } catch (e) { await page.screenshot({ path: path.join(BUILD, `fail-${i}.png`) }); throw e; }
  const target = start + durations[`demo-${i}`] + GAP;
  const left = target - Date.now() / 1000;
  if (left > 0) await wait(left * 1000);
}
await wait(TAIL * 1000);
const length = Date.now() / 1000 - t0;
// força um último quadro antes de parar
await page.evaluate(() => window.setStep(6));
await wait(200);
await cdp.send('Page.stopScreencast');
await browser.close();

// Monta o vídeo respeitando os tempos reais de cada quadro
const usable = frames.filter((f) => f.ts >= t0 - 1).sort((a, b) => a.ts - b.ts);
const lines = [];
for (let i = 0; i < usable.length; i++) {
  const from = Math.max(usable[i].ts, t0);
  const to = i + 1 < usable.length ? Math.max(usable[i + 1].ts, t0) : t0 + length;
  if (to - from <= 0) continue;
  lines.push(`file '${usable[i].file}'\nduration ${(to - from).toFixed(5)}`);
}
lines.push(`file '${usable[usable.length - 1].file}'`);
fs.writeFileSync(path.join(dir, 'list.txt'), lines.join('\n') + '\n');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'),
  '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-t', length.toFixed(3),
  path.join(BUILD, 'seg', 'demo.mp4')]);
fs.writeFileSync(path.join(BUILD, 'timeline-demo.json'), JSON.stringify({ length, beats }));
console.log(`demo: ${length.toFixed(1)}s, ${usable.length} quadros, trechos em ${beats.map((b) => b.toFixed(1)).join(', ')}`);

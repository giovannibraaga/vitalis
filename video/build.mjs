// Pipeline completo do vídeo da Fase 7.
//
//   node video/build.mjs             -> narração (ElevenLabs, 1 requisição) + gravação + vídeo final
//   node video/build.mjs --preview   -> prévia sem narração (tempos estimados), não usa a API
//   node video/build.mjs --reuse-audio  -> reaproveita out/narration.mp3 + out/alignment.json
//
// Requer: Node 18+, Playwright com Chromium, ffmpeg. Para a narração, a
// variável de ambiente ELEVENLABS_API_KEY.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { startServer } from './serve.mjs';
import { synthesize } from './tts.mjs';
import { buildTimeline } from './timeline.mjs';
import { captureSite } from './capture-site.mjs';
import { record } from './record.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const repo = path.resolve(here, '..');
const out = path.join(here, 'out');
const args = new Set(process.argv.slice(2));
const preview = args.has('--preview');
const log = (...a) => console.log('[build]', ...a);
fs.mkdirSync(out, { recursive: true });

// 1. Build web do app (o "sistema rodando" exibido no celular)
const appDir = path.join(out, 'app-web');
if (!fs.existsSync(path.join(appDir, 'index.html')) || args.has('--rebuild-app')) {
  log('exportando o app Expo para web...');
  execFileSync('npx', ['expo', 'export', '--platform', 'web', '--output-dir', appDir], {
    cwd: repo, stdio: 'inherit', env: { ...process.env, CI: '1' },
  });
}
const server = await startServer({ appDir, stageDir: path.join(here, 'stage'), outDir: out, port: 8090 });

try {
  // 2. Narração one shot
  let alignment = null;
  const audio = path.join(out, 'narration.mp3');
  let audioFinal = audio;
  if (!preview) {
    if (args.has('--reuse-audio') && fs.existsSync(audio)) log('reaproveitando narração existente');
    else { log('gerando narração no ElevenLabs (uma única requisição)...'); await synthesize(out); }
    alignment = JSON.parse(fs.readFileSync(path.join(out, 'alignment.json'), 'utf8')).alignment;

    // Limite de 5 min: se a fala passar de MAX_AUDIO, acelera levemente o
    // MESMO áudio (atempo preserva o tom) e reescala os timestamps, sem nova
    // requisição ao ElevenLabs.
    const MAX_AUDIO = 288;
    const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio]).toString());
    const tempo = dur > MAX_AUDIO ? dur / MAX_AUDIO : 1;
    if (tempo > 1) {
      log(`narração com ${dur.toFixed(1)} s; acelerando ${((tempo - 1) * 100).toFixed(1)}% para caber em 5 min`);
      const fast = path.join(out, 'narration_final.mp3');
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', audio, '-af', `atempo=${tempo.toFixed(5)}`, '-b:a', '192k', fast]);
      for (const k of ['character_start_times_seconds', 'character_end_times_seconds']) alignment[k] = alignment[k].map((t) => t / tempo);
      audioFinal = fast;
    }
  }

  // 3. Linha do tempo
  const timeline = buildTimeline(alignment);
  fs.writeFileSync(path.join(out, 'timeline.json'), JSON.stringify(timeline, null, 1));
  log(`duração total: ${timeline.total.toFixed(1)} s (${(timeline.total / 60).toFixed(2)} min)`);
  if (timeline.total > 299) log('ATENÇÃO: o vídeo passa de 5 minutos!');

  // 4. Capturas do website
  const siteDir = path.join(out, 'site');
  if (!fs.existsSync(path.join(siteDir, 'site-4.png')) || args.has('--recapture-site')) {
    log('capturando o website...');
    await captureSite(siteDir);
  }
  const siteShots = [0, 1, 2, 3, 4].map((i) => `/out/site/site-${i}.png`);

  // 5. Gravação em tempo real
  log('gravando (tempo real)...');
  const framesDir = path.join(out, 'frames');
  const frames = await record({ timeline, framesDir, siteShots });
  log(`${frames.length} quadros capturados`);

  // 6. Montagem com ffmpeg
  const list = [];
  const first = frames[0];
  if (first.t > 0) list.push(`file '${first.file}'`, `duration ${first.t.toFixed(4)}`);
  frames.forEach((f, i) => {
    const next = i + 1 < frames.length ? frames[i + 1].t : timeline.total;
    list.push(`file '${f.file}'`, `duration ${Math.max(0.001, next - f.t).toFixed(4)}`);
  });
  list.push(`file '${frames.at(-1).file}'`);
  const listFile = path.join(out, 'frames.txt');
  fs.writeFileSync(listFile, list.join('\n'));

  const name = preview ? 'Vitalis_Fase7_previa_sem_narracao.mp4' : 'Vitalis_Fase7_Video.mp4';
  const final = path.join(out, name);
  const ff = ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', listFile];
  if (!preview) {
    const ms = Math.round(timeline.lead * 1000);
    ff.push('-i', audioFinal, '-filter_complex', `[1:a]adelay=${ms}|${ms},apad[a]`, '-map', '0:v', '-map', '[a]', '-c:a', 'aac', '-b:a', '192k');
  }
  ff.push('-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
    '-movflags', '+faststart', '-t', timeline.total.toFixed(2), final);
  log('codificando', name, '...');
  execFileSync('ffmpeg', ff, { stdio: 'inherit' });
  log('pronto:', final);
} finally {
  server.close();
}

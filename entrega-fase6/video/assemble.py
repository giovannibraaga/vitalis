"""Junta os segmentos de vídeo, posiciona a narração, adiciona uma trilha ambiente discreta
e gera o MP4 final + legendas .srt.  Uso: python3 assemble.py [--no-music]"""
import json, subprocess, sys, wave
from pathlib import Path
import numpy as np

HERE = Path(__file__).parent
BUILD = HERE / 'build'
OUT = HERE.parent
ORDER = ['abertura', 'mvp', 'lgpd', 'governanca', 'seguranca', 'aquisicao', 'demo', 'encerramento']
SR = 48000

narration = {s['id']: s['beats'] for s in json.loads((HERE / 'narration.json').read_text())['scenes']}

def read_wav(p):
    with wave.open(str(p)) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        sr = w.getframerate()
    # reamostragem linear simples para 48 kHz
    t = np.arange(0, len(a) / sr, 1 / SR)
    return np.interp(t, np.arange(len(a)) / sr, a)

def probe(p):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(p)]))

# 1) linha do tempo
offset, cues = 0.0, []
seg_list = []
for sid in ORDER:
    tl = json.loads((BUILD / f'timeline-{sid}.json').read_text())
    seg = BUILD / 'seg' / f'{sid}.mp4'
    real = probe(seg)
    for i, b in enumerate(tl['beats']):
        cues.append((offset + b, sid, i))
    seg_list.append(f"file '{seg}'")
    offset += real
total = offset
print(f'duração total: {total:.1f}s ({int(total // 60)}:{total % 60:04.1f})')
if total > 300:
    sys.exit('ERRO: o vídeo passou de 5 minutos')

# 2) narração
voice = np.zeros(int(total * SR) + SR)
for start, sid, i in cues:
    a = read_wav(BUILD / 'tts' / f'{sid}-{i}.wav')
    k = int(start * SR)
    voice[k:k + len(a)] += a[: len(voice) - k]

# 3) trilha ambiente (acordes suaves sintetizados, sem direitos autorais)
mix = voice * 0.9
if '--no-music' not in sys.argv:
    t = np.arange(len(voice)) / SR
    chords = [[261.63, 329.63, 392.00, 493.88], [220.00, 261.63, 329.63, 392.00],
              [174.61, 220.00, 261.63, 329.63], [196.00, 246.94, 293.66, 392.00]]
    bar = 8.0
    pad = np.zeros_like(t)
    for c, notes in enumerate(chords * int(total // (bar * 4) + 2)):
        s, e = c * bar, (c + 1) * bar + 2.0
        m = (t >= s) & (t < e)
        if not m.any():
            break
        tt = t[m] - s
        env = np.minimum(1, tt / 2.0) * np.minimum(1, np.maximum(0, (e - s - tt) / 2.0))
        for f in notes:
            pad[m] += env * (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f / 2 * tt)) / len(notes)
    fade = np.minimum(1, t / 3) * np.minimum(1, np.maximum(0, (total - t) / 3))
    mix += pad * fade * 0.045

mix = mix / max(1e-6, np.abs(mix).max()) * 0.89
with wave.open(str(BUILD / 'audio.wav'), 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())

# 4) vídeo final
(BUILD / 'segments.txt').write_text('\n'.join(seg_list) + '\n')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', str(BUILD / 'segments.txt'),
                '-i', str(BUILD / 'audio.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                '-af', 'highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', '-ac', '2', '-c:a', 'aac', '-b:a', '192k',
                '-t', f'{total:.3f}', '-movflags', '+faststart', str(OUT / 'Vitalis_Fase6_Video.mp4')], check=True)

# 5) legendas
def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'
durs = json.loads((BUILD / 'tts' / 'durations.json').read_text())
srt = [f'{n}\n{ts(st)} --> {ts(st + durs[f"{sid}-{i}"])}\n{narration[sid][i]}\n' for n, (st, sid, i) in enumerate(cues, 1)]
(OUT / 'Vitalis_Fase6_Video.srt').write_text('\n'.join(srt), encoding='utf-8')
print('ok ->', OUT / 'Vitalis_Fase6_Video.mp4')

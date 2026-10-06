"""Define a linha do tempo do vídeo (duração de cada cena e início de cada trecho falado).
- Se existir build/tts/take.json (tomada única da ElevenLabs), o vídeo segue o ritmo dessa tomada.
- Senão, usa os trechos separados do Piper (build/tts/durations.json) com pausas fixas.
Saída: build/timing.json"""
import json
from pathlib import Path

HERE = Path(__file__).parent
BUILD = HERE / 'build'
FPS = 30
HOLD_END = 2.8          # tempo extra no cartão final
q = lambda x: round(x * FPS) / FPS   # alinha ao quadro

scenes = json.loads((HERE / 'narration.json').read_text())['scenes']
take = BUILD / 'tts' / 'take.json'
out = []

if take.exists():
    data = json.loads(take.read_text())
    b = data['beats']
    starts = []
    for k, s in enumerate(scenes):
        first = b[f"{s['id']}-0"][0]
        if k == 0:
            starts.append(0.0)
        else:
            prev_end = b[f"{scenes[k - 1]['id']}-{len(scenes[k - 1]['beats']) - 1}"][1]
            # a cena nova entra um pouco antes da fala, sem cortar a frase anterior
            starts.append(q(max(prev_end + 0.1, first - 0.5)))
    ends = starts[1:] + [q(data['duration'] + HOLD_END)]
    for s, a, z in zip(scenes, starts, ends):
        out.append({'id': s['id'], 'start': a, 'length': round(z - a, 4),
                    'beats': [round(b[f"{s['id']}-{i}"][0] - a, 3) for i in range(len(s['beats']))],
                    'ends': [round(b[f"{s['id']}-{i}"][1] - a, 3) for i in range(len(s['beats']))]})
    mode = 'take'
else:
    d = json.loads((BUILD / 'tts' / 'durations.json').read_text())
    t0 = 0.0
    for s in scenes:
        demo = s['id'] == 'demo'
        lead, gap, tail = (0.6, 0.4, 0.6) if demo else (0.4, 0.2, 0.6)
        t, beats, ends = lead, [], []
        for i in range(len(s['beats'])):
            beats.append(round(t, 3)); ends.append(round(t + d[f"{s['id']}-{i}"], 3))
            t += d[f"{s['id']}-{i}"] + gap
        length = q(t + tail + (HOLD_END if s['id'] == 'encerramento' else 0))
        out.append({'id': s['id'], 'start': round(t0, 4), 'length': length, 'beats': beats, 'ends': ends})
        t0 += length
    mode = 'beats'

total = sum(s['length'] for s in out)
(BUILD / 'timing.json').write_text(json.dumps({'mode': mode, 'total': total, 'scenes': out}, indent=1))
for s in out:
    print(f"{s['id']:13s} {s['start']:6.1f}s  +{s['length']:5.1f}s")
print(f'modo {mode}: total {total:.1f}s ({int(total // 60)}:{total % 60:04.1f})')
if total > 300:
    raise SystemExit('ERRO: passou de 5 minutos')

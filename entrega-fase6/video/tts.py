"""Gera um .wav por trecho de narração (Piper, offline) e grava as durações em build/tts/durations.json.
Uso: python3 tts.py <modelo.onnx> [length_scale]"""
import json, re, sys, wave
from pathlib import Path
from piper import PiperVoice, SynthesisConfig

HERE = Path(__file__).parent
OUT = HERE / 'build' / 'tts'
OUT.mkdir(parents=True, exist_ok=True)

# Grafia fonética para siglas/termos em inglês que a voz lê mal
PRON = [
    (r'ISO IEC 38500', 'ízo, i é cê, trinta e oito mil e quinhentos'),
    (r'ISO 27001 e 27002', 'ízo vinte e sete mil e um, e vinte e sete mil e dois'),
    (r'OWASP Top 10', 'ôuásp tóp ten'),
    (r'IA HUB', 'iá râb'),
    (r'Row Level Security', 'rôu lével secúriti'),
    (r'HTTPS', 'agá tê tê pê ésse'),
    (r'\bMVP\b', 'ême vê pê'),
    (r'\bSEO\b', 'ésse é ó'),
    (r'\bCAC\b', 'cê a cê'),
    (r'\bchurn\b', 'tchârn'),
    (r'Premium', 'prêmium'),
    (r'e-mail', 'iméiu'),
    (r'\blogs\b', 'lógues'),
]

def spoken(text):
    for pat, rep in PRON:
        text = re.sub(pat, rep, text)
    return text

voice = PiperVoice.load(sys.argv[1])
cfg = SynthesisConfig(length_scale=float(sys.argv[2]) if len(sys.argv) > 2 else 1.0)
data = json.loads((HERE / 'narration.json').read_text())
durations = {}
for scene in data['scenes']:
    for i, text in enumerate(scene['beats']):
        name = f"{scene['id']}-{i}"
        with wave.open(str(OUT / f'{name}.wav'), 'wb') as wf:
            voice.synthesize_wav(spoken(text), wf, syn_config=cfg)
        with wave.open(str(OUT / f'{name}.wav')) as wf:
            durations[name] = wf.getnframes() / wf.getframerate()
(OUT / 'durations.json').write_text(json.dumps(durations, indent=1))
total = sum(durations.values())
for sid in dict.fromkeys(k.rsplit('-', 1)[0] for k in durations):
    print(f"{sid:13s} {sum(v for k, v in durations.items() if k.startswith(sid + '-')):6.1f}s")
print(f"total narração: {total:.1f}s")

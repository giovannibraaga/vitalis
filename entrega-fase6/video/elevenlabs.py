"""Gera a narração inteira em UMA única chamada à ElevenLabs (texto completo, para manter a
entonação e a emoção contínuas) e usa o alinhamento por caractere para descobrir onde cada
trecho começa e termina dentro da tomada.

Variáveis de ambiente:
  ELEVENLABS_API_KEY   (obrigatória)
  ELEVENLABS_VOICE_ID  (opcional, padrão: Ngh50DOYwTlTknff8kRk, a voz escolhida pelo grupo)
  ELEVENLABS_MODEL     (opcional, padrão: eleven_v4)

Uso: python3 elevenlabs.py [--voice ID] [--model ID] [--speed 1.0] [--list-models]
Saída: build/tts/take.mp3 e build/tts/take.json
"""
import argparse, base64, json, os, sys, urllib.request, urllib.error
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / 'build' / 'tts'
API = 'https://api.elevenlabs.io/v1'


def call(method, url, key, body=None):
    req = urllib.request.Request(url, method=method, headers={'xi-api-key': key, 'Content-Type': 'application/json'},
                                 data=json.dumps(body).encode() if body else None)
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        sys.exit(f'ElevenLabs respondeu {e.code}: {e.read().decode(errors="replace")[:800]}')


ap = argparse.ArgumentParser()
ap.add_argument('--voice', default=os.environ.get('ELEVENLABS_VOICE_ID', 'Ngh50DOYwTlTknff8kRk'))
ap.add_argument('--model', default=os.environ.get('ELEVENLABS_MODEL', 'eleven_v4'))
ap.add_argument('--speed', type=float, default=None, help='0.7 a 1.2; use para caber em 5 minutos')
ap.add_argument('--list-models', action='store_true')
args = ap.parse_args()
key = os.environ.get('ELEVENLABS_API_KEY') or sys.exit('Defina ELEVENLABS_API_KEY no ambiente.')

if args.list_models:
    for m in call('GET', f'{API}/models', key):
        print(m['model_id'], '-', m.get('name'), '| max chars:', m.get('maximum_text_length_per_request'))
    sys.exit()
if not args.voice:
    sys.exit('Informe a voz com --voice ou ELEVENLABS_VOICE_ID.')

# Texto completo: trechos da mesma cena separados por espaço, cenas separadas por parágrafo,
# para a voz fazer pausas naturais nas mudanças de assunto.
scenes = json.loads((HERE / 'narration.json').read_text())['scenes']
text, spans = '', {}
for s, scene in enumerate(scenes):
    if s:
        text += '\n\n'
    for i, beat in enumerate(scene['beats']):
        if i:
            text += ' '
        spans[f"{scene['id']}-{i}"] = (len(text), len(text) + len(beat))
        text += beat
print(f'{len(text)} caracteres, modelo {args.model}, voz {args.voice}')

body = {'text': text, 'model_id': args.model, 'language_code': 'pt'}
if args.speed:
    body['voice_settings'] = {'speed': args.speed}
res = call('POST', f'{API}/text-to-speech/{args.voice}/with-timestamps?output_format=mp3_44100_192', key, body)

OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'take.mp3').write_bytes(base64.b64decode(res['audio_base64']))
al = res.get('alignment') or res.get('normalized_alignment')
chars, starts, ends = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
if len(chars) != len(text):
    print(f'aviso: alinhamento com {len(chars)} caracteres para {len(text)} enviados; usando o mais próximo')
scale = (len(chars) - 1) / max(1, len(text) - 1)
beats = {k: [starts[min(len(chars) - 1, round(a * scale))], ends[min(len(chars) - 1, round((b - 1) * scale))]]
         for k, (a, b) in spans.items()}
duration = max(ends)
(OUT / 'take.json').write_text(json.dumps({'model': args.model, 'voice': args.voice, 'duration': duration, 'beats': beats}, indent=1))
print(f'tomada única: {duration:.1f}s -> {OUT / "take.mp3"}')
if duration > 290:
    print('ATENÇÃO: a fala passou de ~4:50; rode de novo com --speed 1.08 (ou maior) para o vídeo caber em 5 minutos.')

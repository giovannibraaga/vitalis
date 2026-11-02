// Narração "one shot": o roteiro inteiro vai em UMA única requisição ao
// ElevenLabs (texto corrido), usando o endpoint com timestamps para
// sincronizar o vídeo com a fala.
import fs from 'node:fs';
import path from 'node:path';
import { fullText, VOICE_ID, MODEL_ID } from './script.mjs';

export async function synthesize(outDir) {
  const key = process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_LABS_API_KEY;
  if (!key) throw new Error('Defina ELEVENLABS_API_KEY (ou ELEVEN_LABS_API_KEY) para gerar a narração.');

  const text = fullText();
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      language_code: 'pt',
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true, speed: 1.03 },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  const data = await res.json();

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'narration.mp3'), Buffer.from(data.audio_base64, 'base64'));
  fs.writeFileSync(
    path.join(outDir, 'alignment.json'),
    JSON.stringify({ text, alignment: data.alignment, normalized_alignment: data.normalized_alignment }, null, 1),
  );
  fs.writeFileSync(path.join(outDir, 'narration.txt'), text);
  return path.join(outDir, 'narration.mp3');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const here = path.dirname(new URL(import.meta.url).pathname);
  synthesize(path.join(here, 'out')).then((f) => console.log('ok', f));
}

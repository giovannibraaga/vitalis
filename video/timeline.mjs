// Converte o roteiro (+ timestamps do ElevenLabs, se houver) em uma linha do
// tempo: quando cada cena começa e quando cada cue é falado.
import { scenes, fullText, sceneOffsets } from './script.mjs';

// Tempo (s) de início de cada caractere do texto corrido.
function charTimes(alignment, text) {
  if (!alignment) {
    // Prévia sem áudio: estimativa de ~15,5 caracteres por segundo.
    return { times: [...text].map((_, i) => i / 15.5), duration: text.length / 15.5 };
  }
  const chars = alignment.characters;
  const starts = alignment.character_start_times_seconds;
  const ends = alignment.character_end_times_seconds;
  const duration = ends[ends.length - 1];
  if (chars.join('') === text) return { times: starts, duration };
  // Alinhamento guloso caso a API normalize algum caractere.
  const times = new Array(text.length);
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    let k = j;
    while (k < chars.length && k < j + 8 && chars[k] !== text[i]) k++;
    if (k < chars.length && chars[k] === text[i]) {
      times[i] = starts[k];
      j = k + 1;
    } else {
      times[i] = starts[Math.min(j, starts.length - 1)];
    }
  }
  return { times, duration };
}

export function buildTimeline(alignment, { lead = 0.8, tail = 2.0 } = {}) {
  const text = fullText();
  const { times, duration } = charTimes(alignment, text);
  const offsets = sceneOffsets();
  const out = { lead, audioDuration: duration, total: lead + duration + tail, scenes: [] };

  scenes.forEach((s, idx) => {
    // A cena entra um pouco antes da fala, para a transição não atrasar.
    const start = idx === 0 ? 0 : Math.max(0, lead + times[offsets[idx]] - 0.35);
    const cues = s.cues.map(([key, phrase]) => {
      const at = s.text.indexOf(phrase);
      return { key, phrase, t: at < 0 ? start : lead + times[offsets[idx] + at] };
    });
    out.scenes.push({ id: s.id, start, cues });
  });
  out.scenes.forEach((s, i) => (s.end = i + 1 < out.scenes.length ? out.scenes[i + 1].start : out.total));
  return out;
}

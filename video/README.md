# Vídeo da Fase 7: Vitalis

Pipeline que gera o vídeo de apresentação da Fase 7 (até 5 minutos). O vídeo reúne:

- **Sistema rodando:** o app real (este repositório, exportado com `expo export --platform web`) aparece dentro de um celular. O roteiro clica, digita e rola as telas: boas-vindas, cadastro, agenda, novo medicamento, monitoramento, análise, histórico e perfil.
- **Website / landing page:** capturas reais de https://vitalis-website-main.vercel.app.
- **Etapa 1:** inbound marketing, storytelling e transmídia, influenciadores.
- **Etapa 2:** investimento em mídia, funil, estimativa de ROI, protocolo de segurança em redes sociais.
- **Narração:** ElevenLabs, voz `Ngh50DOYwTlTknff8kRk`, gerada em **uma única requisição** com o texto corrido. As marcações de tempo da própria resposta sincronizam slides, animações e ações no app.

## Como gerar

Pré-requisitos: Node 18 ou mais recente, `ffmpeg` e as dependências abaixo instaladas na raiz do repositório:

```bash
npm install
npm install --no-save playwright
npx playwright install chromium
```

```bash
export ELEVENLABS_API_KEY=...   # chave da sua conta ElevenLabs
node video/build.mjs
```

Saída: `video/out/Vitalis_Fase7_Video.mp4` (1920x1080, H.264 + AAC).

Outras opções:

| Comando | O que faz |
|---|---|
| `node video/build.mjs --preview` | Prévia **sem narração**, com tempos estimados. Não chama a API. |
| `node video/build.mjs --reuse-audio` | Regrava o vídeo reaproveitando `out/narration.mp3` e `out/alignment.json`, sem gastar créditos de novo. |
| `--recapture-site` / `--rebuild-app` | Força nova captura do site ou novo build web do app. |

## Arquivos

| Arquivo | Função |
|---|---|
| `script.mjs` | Roteiro da narração por cena, com os *cues* (palavras que disparam animações e ações). |
| `tts.mjs` | Chamada única ao ElevenLabs (`/with-timestamps`, `eleven_multilingual_v2`). |
| `timeline.mjs` | Converte os timestamps da fala em linha do tempo de cenas e cues. |
| `stage/` | Slides em HTML/CSS com a identidade visual da Vitalis. |
| `demo.mjs` | Interações com o app real (toques, digitação, rolagem). |
| `capture-site.mjs` | Capturas das seções do website. |
| `record.mjs` | Gravação em tempo real (CDP screencast). |
| `build.mjs` | Orquestra tudo e monta o MP4 com o ffmpeg. |
| `roteiro.md` | Texto da narração para leitura e revisão. |

# Vitalis — Entrega Fase 6 (slides e vídeo)

Material de apoio ao pitch da Fase 6 (Governança, Segurança e Crescimento).

| Arquivo | O que é |
|---|---|
| `Vitalis_Fase6_Slides.pdf` | Apresentação, 8 slides 16:9 (1920×1080) |
| `Vitalis_Fase6_Video.mp4` | Vídeo do pitch, **4:52**, Full HD, H.264 + AAC, pronto para o YouTube (não listado) |
| `Vitalis_Fase6_Video.srt` | Legendas em pt-BR (podem ser enviadas ao YouTube) |
| `slides/png/` | Cada slide em PNG (útil para colar no documento Word) |

## Conteúdo

Todo o texto vem da documentação da Fase 6 e do roteiro do grupo. Nenhum número de usuários, receita ou resultado foi criado.

**Demonstração (3:22–4:25 do vídeo):** é uma gravação real deste repositório (`vitalis-mobile`, Expo/React Native) rodando na versão web.
O fluxo mostrado é: abertura → tela inicial → login → agenda do dia → cadastro de medicamento (cálculo das próximas tomas) → monitoramento → histórico → análise.
Os dados que aparecem são os dados de exemplo do protótipo, e o vídeo informa isso.
**O IA HUB não aparece na demonstração** porque não faz parte desta versão do app. Se a versão do site tiver o IA HUB funcionando, grave a tela e troque o segmento (veja abaixo).

**Narração:** gerada com TTS offline (Piper, voz pt-BR `edresson-low`). A qualidade é de voz sintética. Para uma apresentação mais pessoal, o ideal é o grupo gravar a própria voz usando o roteiro abaixo, que já tem os tempos certos.

## Roteiro cronometrado

| Início | Fala |
|---|---|
| 00:00 | Gerenciar medicamentos parece uma tarefa simples, mas, para quem possui diferentes tratamentos, horários e dosagens, manter a rotina organizada pode se tornar um desafio. |
| 00:10 | A Vitalis nasceu para simplificar esse processo por meio da tecnologia. |
| 00:17 | Nosso MVP já permite organizar a rotina medicamentosa por meio do cadastro de medicamentos, dosagens e horários. |
| 00:23 | O usuário pode acompanhar doses tomadas ou ignoradas, consultar seu histórico e indicadores de adesão e interagir com a plataforma pelo IA HUB. |
| 00:32 | Nesta fase, o desafio deixou de ser apenas desenvolver funcionalidades. Nosso objetivo passou a ser preparar a Vitalis para um cenário mais próximo do mercado. |
| 00:44 | Por lidar com informações que podem revelar dados relacionados à saúde, privacidade é uma preocupação central da Vitalis. Cada dado coletado possui uma finalidade definida. |
| 00:54 | Nome e e-mail são utilizados para identificação da conta. Medicamentos, dosagens, horários e histórico permitem organizar e acompanhar o tratamento. |
| 01:03 | Para dados relacionados à saúde, adotamos como base o consentimento específico e destacado do usuário. |
| 01:10 | Também planejamos mecanismos para que o titular possa acessar, corrigir ou excluir suas informações e revogar seu consentimento. |
| 01:19 | Entre os controles previstos estão autenticação individual, Row Level Security, comunicação HTTPS, proteção de credenciais, backups, registros para auditoria e princípio do menor privilégio. |
| 01:34 | Para orientar a evolução tecnológica da Vitalis, utilizamos os princípios da ISO IEC 38500. |
| 01:44 | Isso significa definir responsabilidades claras, garantir que a tecnologia esteja alinhada à estratégia da startup, avaliar fornecedores e custos, monitorar desempenho, manter conformidade e considerar o comportamento humano nas decisões de tecnologia. |
| 02:01 | O modelo é contínuo: avaliamos necessidades e riscos, direcionamos as ações necessárias e monitoramos seus resultados. |
| 02:11 | Também analisamos a Vitalis utilizando conceitos do OWASP Top 10. |
| 02:15 | Entre os principais riscos estão acessos indevidos, falhas de autenticação, políticas incorretas de Row Level Security, entradas maliciosas, exposição de credenciais, dependências vulneráveis e ausência de logs suficientes. |
| 02:34 | Para reduzir esses riscos, utilizamos controles de acesso, validação de entradas, proteção de segredos, atualização das dependências, HTTPS e registros de eventos críticos. |
| 02:48 | Essas práticas também se relacionam aos princípios das normas ISO 27001 e 27002. |
| 02:56 | Para a aquisição inicial de usuários, a estratégia da Vitalis será principalmente digital. O público inicial inclui pacientes crônicos, idosos, familiares e cuidadores. |
| 03:07 | A estratégia combina SEO, conteúdo educativo, mídias sociais e campanhas digitais, levando o usuário até o cadastro gratuito e, posteriormente, a uma possível assinatura Premium. |
| 03:22 | Agora podemos visualizar a Vitalis funcionando, nesta gravação real do MVP em execução. |
| 03:30 | Na tela inicial, o usuário vê um resumo da rotina e pode criar uma conta ou entrar na plataforma. |
| 03:37 | Após o acesso, a agenda do dia reúne o próximo horário, os medicamentos ativos, as doses confirmadas e os atrasos. |
| 03:45 | No cadastro de medicamento, o usuário informa nome, dosagem, horário de início e periodicidade, e a Vitalis calcula automaticamente as próximas tomas. |
| 03:55 | Na aba de monitoramento, acompanhamos a adesão média, as doses em atraso e as confirmações por dia. |
| 04:03 | O histórico registra doses confirmadas, esquecimentos e alterações da rotina, e a análise destaca os pontos críticos de adesão. |
| 04:13 | Dessa forma, buscamos reduzir a complexidade da organização dos medicamentos e concentrar as principais informações da rotina em uma única experiência. |
| 04:25 | A Vitalis começou como uma solução para organização da rotina medicamentosa e agora evolui também em segurança, privacidade, governança e confiabilidade. |
| 04:37 | Nosso objetivo é construir uma plataforma que seja simples para o usuário e, ao mesmo tempo, preparada para crescer de forma responsável. |
| 04:46 | Essa é a Vitalis. |

## Antes de entregar

1. Publique o vídeo no YouTube como **não listado**.
2. Gere o PDF dos slides com o link do vídeo no slide 8:
   ```bash
   cd entrega-fase6/slides && node build-slides.mjs "https://youtu.be/SEU_LINK"
   ```
3. Acrescente o mesmo link no documento (PDF da documentação).

## Como regerar

Pré-requisitos: Node 18+ com `playwright` (Chromium), Python 3 com `piper-tts`, `numpy` e `pillow`, e `ffmpeg`.

```bash
# 1. App web para a demonstração (na raiz do repositório)
npx expo export -p web --output-dir /tmp/vitalis-web && npx serve -s /tmp/vitalis-web -l 8090 &

# 2. Narração (modelo pt-br-edresson-low.onnx de https://github.com/rhasspy/piper/releases/tag/v0.0.2)
cd entrega-fase6/video
python3 tts.py caminho/para/pt-br-edresson-low.onnx 0.8

# 3. Cenas animadas, gravação real da demo e montagem final
node render-scenes.mjs
node demo-capture.mjs http://localhost:8090
python3 assemble.py            # --no-music remove a trilha ambiente
```

- O texto falado fica em `video/narration.json`, e a duração de cada cena acompanha automaticamente o áudio.
- As cenas ficam em `video/scenes.html` e os slides em `slides/slides.html`. A identidade visual está em `assets/vitalis.css` (fontes Inter, Poppins e Material Symbols, todas locais).
- Para trocar a demonstração por outra gravação, substitua `video/build/seg/demo.mp4` (1920×1080, 30 fps, H.264), ajuste `video/build/timeline-demo.json` e rode `python3 assemble.py`.

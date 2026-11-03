// Roteiro da narração do vídeo da Fase 7 (Vitalis).
// Cada cena tem um texto; os textos são concatenados em UM ÚNICO texto corrido
// e enviados de uma vez ("one shot") ao ElevenLabs. As marcações de tempo
// devolvidas pela API sincronizam cenas, animações e ações da demonstração.
//
// `cues`: palavras/trechos do texto da cena que disparam algo na tela no
// momento em que são falados (revelar um elemento do slide ou executar uma
// ação no app rodando).

export const VOICE_ID = 'Ngh50DOYwTlTknff8kRk';
export const MODEL_ID = 'eleven_multilingual_v2';

export const scenes = [
  {
    id: 'intro',
    text:
      'Olá! Eu sou o Giovanni e, junto com meus colegas Renato, Victor e Thiago, criamos a Vitalis. ' +
      'Neste vídeo, vamos apresentar a solução, mostrar o sistema funcionando e contar o nosso plano de lançamento e crescimento.',
    cues: [['team', 'Giovanni'], ['agenda', 'Neste vídeo']],
  },
  {
    id: 'problem',
    text:
      'A Vitalis nasceu de um problema cotidiano: pacientes crônicos, idosos e cuidadores lidam com vários medicamentos e horários, ' +
      'e quase tudo depende da memória. A Vitalis organiza o cadastro de medicamentos, a agenda diária, a confirmação de doses, ' +
      'o histórico e os indicadores de adesão, em um modelo freemium.',
    cues: [['audience', 'pacientes'], ['quote', 'memória'], ['f1', 'cadastro'], ['f2', 'agenda'], ['f3', 'confirmação'], ['f4', 'histórico'], ['f5', 'indicadores'], ['freemium', 'freemium']],
  },
  {
    id: 'demo-welcome',
    text:
      'Vamos ver o aplicativo rodando. Na tela de boas-vindas, a rotina do dia aparece logo de cara: o próximo horário, ' +
      'o medicamento e os lembretes restantes.',
    cues: [['b1', 'próximo horário'], ['b2', 'o medicamento'], ['b3', 'lembretes']],
  },
  {
    id: 'demo-signup',
    text: 'O cadastro é simples: nome, e-mail, senha e o aceite dos termos de uso e da política de privacidade.',
    cues: [['b1', 'nome'], ['b2', 'senha'], ['b3', 'termos']],
  },
  {
    id: 'demo-home',
    text:
      'Na agenda de hoje, o usuário vê a adesão semanal, a próxima dose, os medicamentos ativos, as confirmações e os atrasos, ' +
      'com atalhos rápidos.',
    cues: [['b1', 'adesão semanal'], ['b2', 'próxima dose'], ['b3', 'atalhos']],
  },
  {
    id: 'demo-medication',
    text:
      'Para cadastrar um medicamento, basta informar o nome, a dosagem, o horário da primeira dose e a periodicidade. ' +
      'A Vitalis calcula automaticamente as próximas tomas, sem preencher cada horário à mão.',
    cues: [['b1', 'o nome'], ['b2', 'horário da primeira'], ['b3', 'periodicidade'], ['b4', 'calcula']],
  },
  {
    id: 'demo-monitoring',
    text:
      'No monitoramento, paciente e cuidador acompanham a adesão média, as doses em atraso, o horário crítico e as confirmações por dia, ' +
      'com alertas e o desempenho de cada medicamento.',
    cues: [['b1', 'adesão média'], ['b2', 'confirmações por dia'], ['b3', 'alertas']],
  },
  {
    id: 'demo-analysis',
    text:
      'A análise da rotina mostra o nível de adesão e os pontos críticos, sugere próximos passos e permite compartilhar com um ' +
      'profissional de saúde, sem substituir a avaliação médica.',
    cues: [['b1', 'nível de adesão'], ['b2', 'próximos passos'], ['b3', 'compartilhar']],
  },
  {
    id: 'demo-history',
    text:
      'Por fim, o histórico registra doses confirmadas, esquecimentos e ajustes de horário, e o perfil reúne dados pessoais, ' +
      'notificações e privacidade.',
    cues: [['b1', 'histórico'], ['b2', 'perfil']],
  },
  {
    id: 'site',
    text:
      'O website funciona como a nossa landing page: apresenta a proposta de valor, as funcionalidades e o IA HUB, ' +
      'e leva o visitante ao cadastro gratuito.',
    cues: [['scroll1', 'proposta'], ['scroll2', 'funcionalidades'], ['scroll3', 'IA HUB'], ['scroll4', 'cadastro gratuito']],
  },
  {
    id: 'inbound',
    text:
      'Agora, a estratégia de lançamento. No inbound marketing, a jornada tem três etapas. Na atração, conteúdo educativo no Instagram, ' +
      'Facebook e Google sobre horários e cuidado com idosos. Na conversão, esse conteúdo leva à landing page e ao cadastro gratuito. ' +
      'E no encantamento, agenda, histórico e IA HUB estimulam o uso recorrente, a indicação e o Premium.',
    cues: [['c1', 'Na atração'], ['c2', 'Na conversão'], ['c3', 'no encantamento']],
  },
  {
    id: 'story',
    text:
      'Nossa narrativa central: organizar a rotina de medicamentos não deveria depender da memória. A campanha acompanha quem ajuda ' +
      'um familiar idoso a coordenar doses e horários. Os posts apresentam o problema, os Reels mostram demonstrações curtas, ' +
      'a landing page explica os benefícios e o YouTube detalha o funcionamento, com a mesma mensagem em todos os canais.',
    cues: [['journey', 'A campanha'], ['ch1', 'Os posts'], ['ch2', 'os Reels'], ['ch3', 'a landing page'], ['ch4', 'o YouTube'], ['same', 'mesma mensagem']],
  },
  {
    id: 'influencers',
    text:
      'Para os influenciadores, escolhemos perfis aderentes ao público, ainda sem contratação. ' +
      'A gerontóloga Tássia Chiarelli, com a campanha "Cuidar também é organizar", traz credibilidade. Maria Helena e Tarcísio Cabral, ' +
      'do Sessenta Demais, com "Tecnologia que facilita o cuidado", mostram a simplicidade do app ao público sessenta mais. ' +
      'Tudo será medido com links UTM, cadastros e custo por aquisição.',
    cues: [['i1', 'Tássia'], ['i2', 'Maria Helena'], ['metrics', 'Tudo será medido']],
  },
  {
    id: 'media',
    text:
      'Na mídia digital, o investimento pago inicial é de oitocentos reais por mês: quatrocentos em Google Ads, trezentos em Meta Ads ' +
      'e cem em remarketing, com consentimento. SEO e conteúdo orgânico são produção interna, e o LinkedIn apoia parcerias com clínicas ' +
      'e farmácias. Dados de saúde jamais são usados para segmentação. No funil, o topo gera descoberta com anúncios e vídeos curtos, ' +
      'o meio gera compreensão com a landing page, e o fundo leva ao cadastro gratuito e ao Premium.',
    cues: [['g', 'quatrocentos'], ['m', 'trezentos'], ['r', 'cem em'], ['org', 'SEO'], ['privacy', 'Dados de saúde'], ['top', 'o topo'], ['mid', 'o meio'], ['bot', 'e o fundo']],
  },
  {
    id: 'roi',
    text:
      'Na estimativa de retorno, os oitocentos reais, a um custo de aquisição de quarenta reais, trazem vinte assinantes Premium ' +
      'a dezenove e noventa. Com margem de dezessete e quarenta por assinante e churn mensal de oito por cento, a coorte gera cerca de ' +
      'mil setecentos e doze reais em seis meses: um ROI estimado de cento e catorze por cento, em um cenário acadêmico que exclui custos fixos.',
    cues: [['s1', 'oitocentos'], ['s2', 'vinte assinantes'], ['s3', 'margem'], ['chart', 'churn'], ['s4', 'mil setecentos'], ['s5', 'ROI'], ['note', 'cenário acadêmico']],
  },
  {
    id: 'security',
    text:
      'Como HealthTech, definimos um protocolo de segurança para as redes sociais em quatro frentes. Prevenção, com autenticação ' +
      'multifator, permissões individuais e gestor de senhas. Monitoramento de menções, perfis falsos e acessos suspeitos. Resposta a ataques, ' +
      'revogando sessões, trocando credenciais e comunicando incidentes conforme a LGPD. E gestão de crises e fake news, checando fatos ' +
      'e esclarecendo nos canais oficiais, sem expor dados pessoais.',
    cues: [['p1', 'Prevenção'], ['p2', 'Monitoramento'], ['p3', 'Resposta'], ['p4', 'gestão de crises']],
  },
  {
    id: 'closing',
    text:
      'Com posicionamento claro, canais coerentes, aquisição mensurável e proteção da marca, a Vitalis tem uma rota estruturada ' +
      'para entrar no mercado e crescer com responsabilidade. Obrigado!',
    cues: [['links', 'rota'], ['thanks', 'Obrigado']],
  },
];

// Separador entre cenas no texto corrido: quebra de parágrafo, que gera uma
// pausa natural na fala sem precisar de tags especiais.
export const SEPARATOR = '\n\n';

export function fullText() {
  return scenes.map((s) => s.text).join(SEPARATOR);
}

// Offset (em caracteres) do início de cada cena dentro do texto corrido.
export function sceneOffsets() {
  const out = [];
  let pos = 0;
  for (const s of scenes) {
    out.push(pos);
    pos += s.text.length + SEPARATOR.length;
  }
  return out;
}

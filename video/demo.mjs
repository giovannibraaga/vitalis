// Roteiro de interações com o app REAL (build web do Expo) dentro do celular.
// `at`: segundos após o início da cena (número) ou o nome de um cue do roteiro;
// `dt`: deslocamento extra em segundos.

export const demoActions = {
  'demo-welcome': [
    { at: 'b3', dt: 0.3, run: (c) => c.scroll(260) },
  ],
  'demo-signup': [
    { at: 0.2, run: (c) => c.tapText('Criar conta') },
    { at: 'b1', run: (c) => c.type('Seu nome', 'Marina Barbosa') },
    { at: 'b1', dt: 1.1, run: (c) => c.type('voce@email.com', 'marina@email.com') },
    { at: 'b2', run: (c) => c.typeNth('••••••••', 0, 'vitalis26') },
    { at: 'b2', dt: 0.7, run: (c) => c.typeNth('••••••••', 1, 'vitalis26') },
    { at: 'b3', run: (c) => c.tapRole('switch') },
    { at: 'b3', dt: 0.8, run: (c) => c.tapRole('switch') },
  ],
  'demo-home': [
    { at: 0, run: (c) => c.ensure('/home', 'Cadastrar') },
    { at: 'b3', run: (c) => c.highlightText('+ Medicamento') },
  ],
  'demo-medication': [
    { at: 0.1, run: (c) => c.tapText('+ Medicamento') },
    { at: 'b1', run: (c) => c.type('Ex: Losartana', 'Losartana') },
    { at: 'b1', dt: 1.0, run: (c) => c.type('Ex: 50 mg', '50 mg') },
    { at: 'b2', run: (c) => c.tapNth('+', 0) },
    { at: 'b2', dt: 0.45, run: (c) => c.tapNth('+', 0) },
    { at: 'b3', run: (c) => c.tapText('A cada 12h') },
    { at: 'b4', run: (c) => c.scroll(330) },
    { at: 'b4', dt: 1.2, run: (c) => c.type('Ex: tomar apos o almoco', 'Tomar após o almoço') },
  ],
  'demo-monitoring': [
    { at: 0, run: (c) => c.back() },
    { at: 0.7, run: (c) => c.tapText('Monitorar') },
    { at: 'b1', run: (c) => c.tapText('30 dias') },
    { at: 'b2', run: (c) => c.scroll(470) },
    { at: 'b3', run: (c) => c.scroll(560) },
  ],
  'demo-analysis': [
    { at: 0, run: (c) => c.scroll(900) },
    { at: 0.8, run: (c) => c.tapText('Ajustar lembretes') },
    { at: 'b3', run: (c) => c.highlightText('Compartilhar com profissional') },
  ],
  'demo-history': [
    { at: 0, run: (c) => c.back() },
    { at: 0.7, run: (c) => c.tapTab('Historico') },
    { at: 'b2', run: (c) => c.tapTab('Perfil') },
  ],
};

// Contexto de ações sobre o iframe do app.
export function makeDemoContext(page) {
  const frame = () => page.frame({ name: 'app' });
  const fl0 = () => page.frameLocator('#app');
  // Só elementos visíveis (telas anteriores da pilha continuam no DOM, ocultas).
  const fl = () => ({
    getByText: (t, o) => fl0().getByText(t, o).filter({ visible: true }),
    getByRole: (r, o) => fl0().getByRole(r, o).filter({ visible: true }),
    getByPlaceholder: (t) => fl0().getByPlaceholder(t).filter({ visible: true }),
  });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function ripple(loc) {
    const box = await loc.boundingBox();
    if (box) await page.evaluate(([x, y]) => window.tap(x, y), [box.x + box.width / 2, box.y + box.height / 2]);
    await sleep(160);
  }
  async function tap(loc) {
    await loc.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
    await ripple(loc);
    await loc.click({ timeout: 3000 });
  }

  return {
    tapText: (t) => tap(fl().getByText(t, { exact: true }).last()),
    tapNth: (t, n) => tap(fl().getByText(t, { exact: true }).nth(n)),
    tapRole: (role) => tap(fl().getByRole(role).first()),
    tapTab: (name) => tap(fl().getByText(name, { exact: true }).last()),
    highlightText: (t) => ripple(fl().getByText(t, { exact: true }).last()),
    async type(placeholder, text) {
      const loc = fl().getByPlaceholder(placeholder).first();
      await tap(loc);
      await loc.pressSequentially(text, { delay: 55 });
    },
    async typeNth(placeholder, n, text) {
      const loc = fl().getByPlaceholder(placeholder).nth(n);
      await tap(loc);
      await loc.pressSequentially(text, { delay: 55 });
    },
    async scroll(dy) {
      const phone = await page.locator('.screen').boundingBox();
      await page.mouse.move(phone.x + phone.width / 2, phone.y + phone.height * 0.45);
      const steps = Math.ceil(Math.abs(dy) / 22);
      for (let i = 0; i < steps; i++) {
        await page.mouse.wheel(0, Math.sign(dy) * 22);
        await sleep(14);
      }
    },
    async back() {
      await frame().evaluate(() => history.back());
      await sleep(400);
    },
    async ensure(route, buttonText) {
      const url = frame().url();
      if (!url.endsWith(route)) {
        const btn = fl().getByText(buttonText, { exact: true });
        if (await btn.count()) await tap(btn.last());
        else await frame().goto('http://localhost:8090' + route);
      }
    },
  };
}

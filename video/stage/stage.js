// API do palco, chamada pelo gravador (record.mjs) via page.evaluate.
(function () {
  const DEMO = ['demo-welcome', 'demo-signup', 'demo-home', 'demo-medication', 'demo-monitoring', 'demo-analysis', 'demo-history'];
  const sectionOf = (id) => (DEMO.includes(id) ? 's-demo' : 's-' + id);
  let current = null;

  function scope(id) {
    const sec = document.getElementById(sectionOf(id));
    if (!sec) return null;
    return DEMO.includes(id) ? sec.querySelector(`.step[data-step="${id}"]`) : sec;
  }

  window.showScene = function (id) {
    const secId = sectionOf(id);
    document.querySelectorAll('.scene').forEach((s) => s.classList.toggle('active', s.id === secId));
    const sec = document.getElementById(secId);
    const chapter = document.getElementById('chapter');
    chapter.textContent = sec.dataset.chapter || '';
    document.getElementById('chrome').classList.toggle('hidden', id === 'intro' || id === 'closing');
    if (DEMO.includes(id)) {
      sec.querySelectorAll('.step').forEach((st) => st.classList.toggle('active', st.dataset.step === id));
    }
    current = id;
  };

  window.cue = function (id, key) {
    const root = scope(id);
    if (!root) return;
    root.querySelectorAll(`[data-cue="${key}"]`).forEach((el) => el.classList.add('on'));
    if (id === 'site' && key.startsWith('scroll')) siteShot(Number(key.slice(6)));
  };

  // Revela tudo de uma cena (fallback quando um cue não tem tempo).
  window.cueAll = function (id) {
    const root = scope(id);
    if (root) root.querySelectorAll('[data-cue]').forEach((el) => el.classList.add('on'));
  };

  window.tap = function (x, y) {
    const t = document.getElementById('tap');
    t.style.left = x + 'px';
    t.style.top = y + 'px';
    t.classList.remove('go');
    void t.offsetWidth;
    t.classList.add('go');
  };

  // ---- Website: capturas reais das seções, com transição e leve rolagem ----
  window.setSiteShots = function (urls) {
    const vp = document.querySelector('#s-site .viewport');
    vp.innerHTML = '';
    urls.forEach((u, i) => {
      const img = document.createElement('img');
      img.src = u;
      img.className = 'shot' + (i === 0 ? ' on' : '');
      vp.appendChild(img);
    });
  };
  function siteShot(i) {
    const imgs = document.querySelectorAll('#s-site .viewport .shot');
    imgs.forEach((im, k) => im.classList.toggle('on', k === i));
  }

  // ---- Gráfico do ROI (dados do documento: 20 × R$ 17,40 × 0,92^m) ----
  (function chart() {
    const svg = document.getElementById('roi-chart');
    const months = [0, 1, 2, 3, 4, 5].map((m) => 20 * 17.4 * Math.pow(0.92, m));
    const acc = months.reduce((a, v) => (a.push((a.at(-1) || 0) + v), a), []);
    const W = 640, H = 380, L = 64, R = 20, T = 20, B = 46;
    const max = 1800;
    const x = (i) => L + (i + 0.5) * ((W - L - R) / 6);
    const y = (v) => T + (H - T - B) * (1 - v / max);
    let out = '';
    [0, 400, 800, 1200, 1600].forEach((v) => {
      out += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="#E3EAF4"/>`;
      out += `<text x="${L - 10}" y="${y(v) + 6}" text-anchor="end" font-size="16" fill="#54708A">${v}</text>`;
    });
    const bw = 44;
    months.forEach((v, i) => {
      out += `<rect class="b" style="transition-delay:${i * 0.12}s" x="${x(i) - bw / 2}" y="${y(v)}" width="${bw}" height="${y(0) - y(v)}" rx="8" fill="#1565D8"/>`;
      out += `<text x="${x(i)}" y="${H - 16}" text-anchor="middle" font-size="17" fill="#54708A">Mês ${i + 1}</text>`;
    });
    out += `<line x1="${L}" x2="${W - R}" y1="${y(800)}" y2="${y(800)}" stroke="#E0745F" stroke-width="3" stroke-dasharray="8 7"/>`;
    const pts = acc.map((v, i) => `${x(i)},${y(v)}`).join(' ');
    out += `<polyline class="acc" points="${pts}" fill="none" stroke="#1F9D67" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
    out += `<text x="${x(5) - 6}" y="${y(acc[5]) - 14}" text-anchor="end" font-size="20" font-weight="800" fill="#1F9D67">R$ 1.712</text>`;
    out += `<circle cx="${x(2)}" cy="${y(acc[2])}" r="7" fill="#1F9D67"/>`;
    out += `<text x="${x(2) - 16}" y="${y(acc[2]) - 14}" text-anchor="end" font-size="17" font-weight="700" fill="#136B46">payback no mês 3</text>`;
    svg.innerHTML = out;
  })();
})();

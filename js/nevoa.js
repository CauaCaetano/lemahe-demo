// LEMAHE · abertura em névoa. Um céu de névoa desenhado no canvas fica parado na tela; a rolagem move a câmera:
// o símbolo surge e passa, a Dra. Marina e os quatro pilares aparecem na névoa e o céu escurece até o verde-oliva.
(function () {
  var sec = document.querySelector('.nevoa'); if (!sec) return;
  var calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calmo) { sec.classList.add('parada'); return; }
  var $ = function (s) { return sec.querySelector(s); }, $$ = function (s) { return [].slice.call(sec.querySelectorAll(s)); };
  var canvas = $('.nevoa-ceu'), ctx = canvas.getContext('2d');
  var simbolo = $('.nevoa-simbolo'), guia = $('.nevoa-guia span'), topo = document.querySelector('.topo');
  var cenas = $$('.cena').map(function (el) { return { el: el, de: +el.dataset.de, ate: +el.dataset.ate }; });
  var midias = [['.nm-dra', .25, .4], ['.nm-p1', .4, .53], ['.nm-p2', .53, .66], ['.nm-p3', .66, .79], ['.nm-p4', .79, .92]].map(function (m) { return { el: $(m[0]), de: m[1], ate: m[2], v: $(m[0] + ' video') }; });
  var cel = matchMedia('(max-width: 860px)').matches;

  // textura de névoa: ruído suave que se repete sem emenda
  var N = 256, tex = document.createElement('canvas'), sombra = document.createElement('canvas'); tex.width = tex.height = sombra.width = sombra.height = N;
  (function () {
    var t = tex.getContext('2d'), img = t.createImageData(N, N), g = [];
    var rnd = (function (s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; })(7);
    function grade(n) { var a = []; for (var i = 0; i < n * n; i++) a.push(rnd()); return a; }
    var oit = [[4, .5], [8, .27], [16, .15], [32, .08]].map(function (o) { return { n: o[0], a: o[1], v: grade(o[0]) }; });
    var liso = function (x) { return x * x * (3 - 2 * x); };
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var s = 0;
      oit.forEach(function (o) { var fx = x / N * o.n, fy = y / N * o.n, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = liso(fx - x0), ty = liso(fy - y0), q = function (i, j) { return o.v[((j % o.n) * o.n) + (i % o.n)]; };
        s += o.a * ((q(x0, y0) * (1 - tx) + q(x0 + 1, y0) * tx) * (1 - ty) + (q(x0, y0 + 1) * (1 - tx) + q(x0 + 1, y0 + 1) * tx) * ty); });
      var a = Math.max(0, Math.min(1, (s - .38) * 1.9)), k = (y * N + x) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = 255; img.data[k + 3] = a * 255;
    }
    t.putImageData(img, 0, 0);
    var s2 = sombra.getContext('2d'); s2.drawImage(tex, 0, 0); s2.globalCompositeOperation = 'source-in'; s2.fillStyle = 'rgb(120,116,96)'; s2.fillRect(0, 0, N, N);
  })();

  var W = 0, H = 0, ESC = .5;
  function tamanho() { W = Math.ceil(innerWidth * ESC); H = Math.ceil(innerHeight * ESC); canvas.width = W; canvas.height = H; cel = matchMedia('(max-width: 860px)').matches; }
  tamanho(); addEventListener('resize', tamanho);

  // cor do céu ao longo da rolagem: creme → creme rosado → sálvia → oliva
  var PAL = [[0, [243, 236, 224]], [.38, [236, 228, 213]], [.62, [196, 202, 182]], [.86, [104, 118, 88]], [1, [70, 84, 58]]];
  function cor(p) { for (var i = 1; i < PAL.length; i++) if (p <= PAL[i][0]) { var a = PAL[i - 1], b = PAL[i], t = (p - a[0]) / (b[0] - a[0]); return a[1].map(function (c, k) { return Math.round(c + (b[1][k] - c) * t); }); } return PAL[PAL.length - 1][1]; }

  var alvo = 0, p = 0, tempo = 0;
  function progresso() { var r = sec.getBoundingClientRect(), total = sec.offsetHeight - innerHeight; return Math.max(0, Math.min(1, -r.top / total)); }
  var curva = function (t) { return t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t); };
  function janela(p, de, ate, fade) { var f = fade || .22, t = (p - de) / (ate - de); if (t < 0 || t > 1) return 0; return Math.min(curva(t / f), curva((1 - t) / f)); }

  function desenha(ts) {
    tempo = ts / 1000; alvo = progresso(); p += (alvo - p) * .09;
    var c = cor(p);
    ctx.fillStyle = 'rgb(' + c.join(',') + ')'; ctx.fillRect(0, 0, W, H);
    // três camadas de névoa em velocidades diferentes; a câmera "atravessa" a névoa conforme a rolagem
    var claro = p < .8 ? 1 : 1 - (p - .8) * 2.2;
    [[2.6, .010, .55, 0], [1.8, .016, .45, .33], [1.25, .024, .35, .66]].forEach(function (L, i) {
      var esc = L[0] * (1 + p * (1.2 + i * .4)), w = N * esc * (H / N) * .9, h = w;
      var ox = ((tempo * L[1] * 60 + L[3] * w + p * W * (.3 + i * .25)) % w), oy = ((p * H * (1.6 + i * .7)) % h);
      var d = w * .045;
      ctx.globalAlpha = (L[2] * .34) * claro + (1 - claro) * .1;
      for (var x = -ox; x < W; x += w) for (var y = -oy - h; y < H + h; y += h) ctx.drawImage(sombra, x + d, y + d * 1.4, w, h);
      ctx.globalAlpha = L[2] * claro + (1 - claro) * .16;
      for (x = -ox; x < W; x += w) for (y = -oy - h; y < H + h; y += h) ctx.drawImage(tex, x, y, w, h);
    });
    ctx.globalAlpha = 1;
    // véu claro no centro, como a luz atrás das nuvens
    var g = ctx.createRadialGradient(W * .62, H * .38, 0, W * .62, H * .38, Math.max(W, H) * .7);
    g.addColorStop(0, 'rgba(255,252,245,' + (.55 * claro) + ')'); g.addColorStop(1, 'rgba(255,252,245,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // o símbolo: aparece grande e a câmera passa por ele (sobe, cresce e some na névoa)
    var ps = Math.min(1, p / .16), sOp = Math.max(0, 1 - curva(ps * 1.05));
    simbolo.style.opacity = (.95 * sOp).toFixed(3);
    simbolo.style.transform = (cel ? 'translate(-50%,-96%)' : 'translate(-28%,-56%)') + ' translateY(' + (-ps * 26) + 'vh) scale(' + (1 + ps * .9) + ')';

    cenas.forEach(function (c, i) {
      var op = i === 0 ? (p < c.ate ? 1 - curva((p - c.ate * .45) / (c.ate * .55)) : 0) : i === cenas.length - 1 ? curva((p - c.de) / .04) : janela(p, c.de, c.ate);
      var t = (p - c.de) / (c.ate - c.de);
      c.el.style.opacity = op.toFixed(3); c.el.style.transform = 'translateY(' + ((.5 - Math.max(0, Math.min(1, t))) * 60).toFixed(1) + 'px)';
      c.el.classList.toggle('ativa', op > .5);
    });
    midias.forEach(function (m, i) {
      var op = janela(p, m.de, m.ate, .18), t = (p - m.de) / (m.ate - m.de);
      m.el.style.opacity = op.toFixed(3);
      var dx = cel ? 0 : (.5 - t) * 8, dy = (.5 - t) * (cel ? 6 : 10);
      m.el.style.transform = (cel ? 'translateX(50%) ' : '') + 'translate(' + dx.toFixed(2) + 'vw,' + dy.toFixed(2) + 'vh) scale(' + (.92 + t * .12).toFixed(3) + ')';
      if (m.v) { if (op > .05) { if (!m.v.src) m.v.src = m.v.dataset.src; if (m.v.paused) { var pr = m.v.play(); if (pr && pr.catch) pr.catch(function () {}); } } else if (!m.v.paused) m.v.pause(); }
    });
    sec.classList.toggle('escuro', p > .8);
    if (guia) guia.style.transform = 'translateY(' + (p * 102).toFixed(1) + 'px)';
    if (topo) topo.classList.toggle('sobre-nevoa', sec.getBoundingClientRect().bottom > 90);
    requestAnimationFrame(desenha);
  }
  requestAnimationFrame(desenha);
})();

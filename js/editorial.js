// LEMAHE · linha editorial: fotos da abertura que se empilham com a rolagem, "Por que a LEMAHE" que se abre, vídeo do método em paralaxe e entradas suaves.
(function () {
  var calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var limite = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; }, curva = function (t) { return 1 - Math.pow(1 - t, 3); };
  var toca = function (v) { if (!v) return; if (!v.src && v.dataset.src) v.src = v.dataset.src; if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } };

  // entradas: cada bloco aparece uma vez
  var rv = $$('.revela');
  if (calmo || !('IntersectionObserver' in window)) rv.forEach(function (e) { e.classList.add('visto'); });
  else { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }); }, { threshold: .15 }); rv.forEach(function (e) { io.observe(e); }); }

  // abertura: cada foto sobe por cima da anterior
  var pilha = $('.pilha');
  if (pilha) {
    var figs = $$('.pilha-midias figure', pilha), n = figs.length, num = $('.pi-num', pilha), nome = $('.pi-nome', pilha), linha = $('.pi-linha i', pilha), atual = -1;
    if (calmo) pilha.classList.add('parada');
    else {
      var quadro = function () {
        var r = pilha.getBoundingClientRect(), total = pilha.offsetHeight - innerHeight, p = limite(-r.top / total), x = p * (n - 1);
        figs.forEach(function (f, k) {
          var entra = k === 0 ? 1 : curva(limite(x - k + 1)), sai = k < n - 1 ? curva(limite(x - k)) : 0;
          if (k) f.style.clipPath = 'inset(' + ((1 - entra) * 100).toFixed(2) + '% 0 0 0)';
          var m = f.firstElementChild; m.style.transform = 'translateY(' + (-sai * 8).toFixed(2) + '%) scale(' + (1.18 - entra * .12 + sai * .04).toFixed(4) + ')';
          var v = f.querySelector('video'); if (v) { if (entra > 0 && sai < 1) toca(v); else if (!v.paused) v.pause(); }
        });
        var i = Math.min(n - 1, Math.round(x));
        if (i !== atual) { atual = i; num.textContent = (i + 1) + ' / ' + n; nome.textContent = figs[i].dataset.nome; }
        linha.style.transform = 'scaleX(' + ((x + 1) / n).toFixed(3) + ')';
      };
      var pedido = false, agenda = function () { if (!pedido) { pedido = true; requestAnimationFrame(function () { pedido = false; quadro(); }); } };
      addEventListener('scroll', agenda, { passive: true }); addEventListener('resize', agenda); quadro();
    }
  }

  // por que a LEMAHE: abre ao passar o mouse ou tocar; troca sozinho enquanto ninguém mexe
  var lista = $('.porque-lista');
  if (lista) {
    var itens = $$('.pq', lista), pn = $('.porque-num'), pl = $('.porque-linha i'), ativo = 0, parado = false, t0 = performance.now(), visivel = false, DUR = 5200;
    var abre = function (i) { ativo = i; itens.forEach(function (it, k) { it.classList.toggle('ativo', k === i); }); pn.textContent = (i + 1) + ' / ' + itens.length; t0 = performance.now(); };
    itens.forEach(function (it, k) {
      it.addEventListener('mouseenter', function () { if (matchMedia('(hover: hover)').matches) { parado = true; abre(k); } });
      it.addEventListener('click', function () { parado = true; abre(k); });
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; }, { threshold: .3 }).observe(lista);
    if (!calmo) (function gira(ts) {
      if (visivel && !parado && !document.hidden) { var f = (ts - t0) / DUR; if (f >= 1) abre((ativo + 1) % itens.length); else pl.style.transform = 'scaleX(' + f.toFixed(3) + ')'; }
      else if (parado) pl.style.transform = 'scaleX(1)';
      else t0 = ts - 0;
      requestAnimationFrame(gira);
    })(performance.now());
  }

  // método: o vídeo grande corre um pouco mais devagar que a página
  var mg = $('.metodo-grande');
  if (mg && !calmo) {
    var vg = $('video', mg);
    var desloca = function () { var r = mg.getBoundingClientRect(), t = limite((innerHeight - r.top) / (innerHeight + r.height)); vg.style.transform = 'translateY(' + (-t * 15).toFixed(2) + '%)'; if (t > 0 && t < 1) toca(vg); else if (!vg.paused) vg.pause(); };
    addEventListener('scroll', desloca, { passive: true }); desloca();
  }

  // elipse: os cartões e as folhas flutuam em velocidades diferentes; a fita dourada se desenha ao aparecer
  var el = $('.elipse');
  if (el) {
    var soltos = $$('[data-vel]', el);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { if (es[0].isIntersecting) el.classList.add('visto'); }, { threshold: .25 }).observe(el); else el.classList.add('visto');
    if (!calmo) { var flutua = function () { var r = el.getBoundingClientRect(), d = (r.top + r.height / 2) - innerHeight / 2; soltos.forEach(function (s) { s.style.translate = '0 ' + (d * +s.dataset.vel).toFixed(1) + 'px'; }); }; addEventListener('scroll', flutua, { passive: true }); flutua(); }
  }
})();

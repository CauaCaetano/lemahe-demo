// Clínica LEMAHE · topo que encolhe, menu suspenso de tratamentos, menu do celular, aparecer ao rolar, carrossel "na clínica",
// processo com foto presa, seletor "o que está te incomodando", vídeos do Instagram em janela e folhas caindo no convite final.
(function () {
  'use strict';
  var d = document, $ = function (s, el) { return (el || d).querySelector(s); }, $$ = function (s, el) { return [].slice.call((el || d).querySelectorAll(s)); };
  var calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // topo
  var topo = $('.topo');
  function rolar() { topo.classList.toggle('rolou', scrollY > 40); }
  addEventListener('scroll', rolar, { passive: true }); rolar();

  // menu suspenso
  var dds = $$('.dd');
  function fechaDd(ex) { dds.forEach(function (x) { if (x !== ex) { x.classList.remove('aberto'); $('.dd-bt', x).setAttribute('aria-expanded', 'false'); } }); }
  dds.forEach(function (dd) {
    var bt = $('.dd-bt', dd), t;
    function abre(v) { fechaDd(dd); dd.classList.toggle('aberto', v); bt.setAttribute('aria-expanded', String(v)); }
    bt.addEventListener('click', function () { abre(!dd.classList.contains('aberto')); });
    dd.addEventListener('mouseenter', function () { if (matchMedia('(hover: hover)').matches) { clearTimeout(t); abre(true); } });
    dd.addEventListener('mouseleave', function () { t = setTimeout(function () { abre(false); }, 180); });
  });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechaDd(null); });
  d.addEventListener('click', function (e) { if (!e.target.closest('.dd')) fechaDd(null); });

  // menu do celular
  var hamb = $('.hamb'), mc = $('#menu-cel');
  if (hamb && mc) {
    hamb.addEventListener('click', function () { var v = mc.hidden; mc.hidden = !v; hamb.setAttribute('aria-expanded', String(v)); hamb.setAttribute('aria-label', v ? 'Fechar o menu' : 'Abrir o menu'); d.body.style.overflow = v ? 'hidden' : ''; });
    $$('a', mc).forEach(function (a) { a.addEventListener('click', function () { mc.hidden = true; hamb.setAttribute('aria-expanded', 'false'); d.body.style.overflow = ''; }); });
  }

  // vídeos de fundo: tocam só quando aparecem e param com movimento reduzido
  var vids = $$('video[data-auto]');
  if (calmo) vids.forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); });
  else {
    var iov = new IntersectionObserver(function (es) { es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }); }, { threshold: .15 });
    vids.forEach(function (v) { v.muted = true; iov.observe(v); });
  }

  // aparecer ao rolar
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('ver'); io.unobserve(e.target); } }); }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
  $$('.anima').forEach(function (el) { io.observe(el); });

  // carrossel
  var car = $('[data-car]');
  if (car) (function () {
    var trilho = $('.car-trilho', car), casos = $$('.caso', car), ci = 0, x0 = null;
    function pos() {
      var c = casos[ci], meio = car.clientWidth / 2;
      trilho.style.transform = 'translateX(' + (meio - c.offsetLeft - c.offsetWidth / 2) + 'px)';
      casos.forEach(function (x, k) {
        x.classList.toggle('ativo', k === ci); x.setAttribute('aria-hidden', String(k !== ci));
        $$('a', x).forEach(function (a) { a.tabIndex = k === ci ? 0 : -1; });
        var v = $('video', x); if (v) { if (k === ci && !calmo) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }
      });
    }
    function vai(n) { ci = (n + casos.length) % casos.length; pos(); }
    $('.car-ant').addEventListener('click', function () { vai(ci - 1); });
    $('.car-prox').addEventListener('click', function () { vai(ci + 1); });
    casos.forEach(function (c, k) { c.addEventListener('click', function (e) { if (k !== ci) { e.preventDefault(); vai(k); } }); });
    trilho.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    addEventListener('pointerup', function (e) { if (x0 === null) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) vai(ci + (dx < 0 ? 1 : -1)); });
    addEventListener('resize', pos); addEventListener('load', pos); pos();
  })();

  // processo: a rolagem troca a foto presa
  var pFotos = $$('.pr-fotos img'), pPassos = $$('.pr-passo');
  if (pFotos.length && pPassos.length) {
    var ioP = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; var i = pPassos.indexOf(e.target);
        pFotos.forEach(function (f, k) { f.classList.toggle('on', k === Math.min(i, pFotos.length - 1)); });
        pPassos.forEach(function (x, k) { x.classList.toggle('on', k === i); });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    pPassos.forEach(function (x) { ioP.observe(x); });
  }

  // o que está te incomodando
  var aj = $('[data-ajuda]');
  if (aj) (function () {
    var dados = JSON.parse($('#ajuda-dados').textContent), atual = $('.aj-atual', aj), lista = $('.aj-lista', aj), info = $('.aj-info', aj), media = $('.aj-media', aj);
    var check = '<svg viewBox="0 0 30 30" class="ic" aria-hidden="true"><circle cx="13" cy="16" r="10"/><path d="m8 16 4 4 14-16"/></svg>';
    function abre(v) { lista.hidden = !v; atual.setAttribute('aria-expanded', String(v)); }
    function mostra(i) {
      var x = dados[i];
      $('.aj-nome', aj).textContent = x.q;
      info.innerHTML = '<p>' + x.a + '</p><ul>' + x.l.map(function (t) { return '<li>' + check + '<span>' + t + '</span></li>'; }).join('') + '</ul><div class="bts"><a class="pilula pilula-cheia" href="agendar.html?t=' + x.t + '">Agendar avaliação</a>' + (x.p ? '<a class="pilula" href="' + x.p + '">Ver tratamento</a>' : '') + '</div>';
      info.classList.remove('troca'); void info.offsetWidth; info.classList.add('troca');
      media.innerHTML = '<video muted loop playsinline preload="metadata" poster="' + x.poster + '"' + (calmo ? '' : ' autoplay') + '><source src="' + x.v + '" type="video/mp4"></video><figcaption>' + x.cap + '</figcaption>';
    }
    atual.addEventListener('click', function () { abre(lista.hidden); });
    $$('button', lista).forEach(function (b, i) { b.addEventListener('click', function () { mostra(i); abre(false); atual.focus(); }); });
    mostra(0);
  })();

  // vídeos do Instagram em janela
  var jan = $('#janela');
  if (jan) {
    var jv = $('video', jan);
    $$('.reel').forEach(function (r) {
      r.addEventListener('click', function () {
        jv.src = r.dataset.v; jv.poster = r.dataset.poster || '';
        $('h2', jan).textContent = r.dataset.t; $('[data-jn-tx]', jan).textContent = r.dataset.tx;
        $('[data-jn-link]', jan).href = r.dataset.link;
        jan.showModal(); if (!calmo) { var p = jv.play(); if (p && p.catch) p.catch(function () {}); }
      });
    });
    function fecha() { jv.pause(); jan.close(); }
    $('.fechar', jan).addEventListener('click', fecha);
    jan.addEventListener('click', function (e) { if (e.target === jan) fecha(); });
    jan.addEventListener('close', function () { jv.pause(); });
  }

  // folhas caindo no convite final
  $$('.folhas').forEach(function (c) {
    if (calmo) return;
    for (var i = 0; i < 14; i++) {
      var f = d.createElement('i'); f.className = 'folha';
      f.style.left = (Math.random() * 100) + '%'; f.style.animationDuration = (9 + Math.random() * 9) + 's'; f.style.animationDelay = (-Math.random() * 14) + 's';
      f.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px'); f.style.setProperty('--r', (Math.random() * 500 - 250) + 'deg'); f.style.transform = 'scale(' + (.6 + Math.random() * .7) + ')';
      c.appendChild(f);
    }
  });

  // contato: monta a mensagem e abre o WhatsApp
  var fc = $('#form-contato');
  if (fc) fc.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = $('#c-nome').value.trim(), msg = $('#c-msg').value.trim(), assunto = $('#c-assunto').value, erro = $('#c-erro');
    erro.textContent = nome.length < 2 ? 'Escreva o seu nome.' : msg.length < 3 ? 'Escreva a sua mensagem.' : '';
    if (erro.textContent) return;
    window.open('https://wa.me/' + fc.dataset.zap + '?text=' + encodeURIComponent('Olá! Vim pelo site da Clínica LEMAHE.\n\nNome: ' + nome + '\nAssunto: ' + assunto + '\n\n' + msg), '_blank', 'noopener');
  });

  $$('[data-ano]').forEach(function (s) { s.textContent = new Date().getFullYear(); });
})();

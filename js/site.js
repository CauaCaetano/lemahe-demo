// Clínica LEMAHE (molde Bianca Moraes) · topo que encolhe, menus suspensos, fotos da abertura em fusão, ondas, carrosséis, corpo com pontos,
// vaso que se desenha, contadores, pétalas, dicas em vídeo e janela de agendamento que chama o WhatsApp.
// Nas páginas internas: pedido de avaliação em 3 passos e formulário de contato (tudo abre o WhatsApp).
(function () {
  'use strict';
  var d = document, $ = function (s, el) { return (el || d).querySelector(s); }, $$ = function (s, el) { return [].slice.call((el || d).querySelectorAll(s)); };
  var calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ZAP = d.body.dataset.zap || '5516992884458';
  window.BR_WA = function (msg) { window.open('https://wa.me/' + ZAP + '?text=' + encodeURIComponent(msg), '_blank', 'noopener'); };
  $$('[data-wa]').forEach(function (a) { a.href = 'https://wa.me/' + ZAP + '?text=' + encodeURIComponent(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });

  // ---------- topo e coluna lateral ----------
  var topo = $('#topo'), lateral = $('.lateral');
  function rolar() {
    var y = scrollY;
    topo.classList.toggle('rolou', y > 40);
    d.documentElement.style.setProperty('--topo-a', topo.offsetHeight + 'px');
    if (lateral) lateral.classList.toggle('ver', y > innerHeight * .8);
  }
  addEventListener('scroll', rolar, { passive: true }); addEventListener('resize', rolar); rolar();

  // ---------- menus suspensos ----------
  var dds = $$('.dd');
  function fechaDd(ex) { dds.forEach(function (x) { if (x !== ex) { x.classList.remove('aberto'); $('.dd-bt', x).setAttribute('aria-expanded', 'false'); } }); }
  dds.forEach(function (dd) {
    var bt = $('.dd-bt', dd), t;
    function abre(v) { fechaDd(dd); dd.classList.toggle('aberto', v); bt.setAttribute('aria-expanded', String(v)); }
    bt.addEventListener('click', function () { abre(!dd.classList.contains('aberto')); });
    dd.addEventListener('mouseenter', function () { if (matchMedia('(hover: hover)').matches) { clearTimeout(t); abre(true); } });
    dd.addEventListener('mouseleave', function () { t = setTimeout(function () { abre(false); }, 180); });
    $$('a', dd).forEach(function (a) { a.addEventListener('click', function () { abre(false); }); });
  });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechaDd(null); });
  d.addEventListener('click', function (e) { if (!e.target.closest('.dd')) fechaDd(null); });

  // menu do celular
  var hamb = $('.hamb'), mc = $('#menu-cel');
  hamb.addEventListener('click', function () { var v = mc.hidden; mc.hidden = !v; hamb.setAttribute('aria-expanded', String(v)); hamb.setAttribute('aria-label', v ? 'Fechar menu' : 'Abrir menu'); });
  $$('a, button', mc).forEach(function (a) { a.addEventListener('click', function () { mc.hidden = true; hamb.setAttribute('aria-expanded', 'false'); }); });

  // ---------- abertura: fotos em fusão e ondas ----------
  var fotos = $$('.heroi-fotos img'), fi = 0;
  if (!calmo && fotos.length > 1) addEventListener('load', function () { fotos.forEach(function (im) { im.loading = 'eager'; }); }); if (!calmo && fotos.length > 1) setInterval(function () { fotos[fi].classList.remove('ativa'); fi = (fi + 1) % fotos.length; fotos[fi].classList.add('ativa'); }, 5200);
  var ondas = $('.ondas'), NS = 'http://www.w3.org/2000/svg', linhas = [];
  if (ondas) for (var i = 0; i < 16; i++) { var p = d.createElementNS(NS, 'path'); ondas.appendChild(p); linhas.push(p); }
  var fase = 0;
  function desenhaOndas() {
    linhas.forEach(function (p, k) {
      var y0 = 30 + k * 31, a = 10 + (k % 4) * 3, s = '';
      for (var x = 0; x <= 1440; x += 40) {
        var y = y0 + Math.sin(x / 210 + k * .7 + fase) * a + Math.sin(x / 90 + k) * 3;
        s += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1);
      }
      p.setAttribute('d', s);
    });
  }
  desenhaOndas();
  if (!calmo && ondas) { var vivo = true; new IntersectionObserver(function (e) { vivo = e[0].isIntersecting; }).observe(ondas); (function anda() { if (vivo) { fase += .006; desenhaOndas(); } requestAnimationFrame(anda); })(); }

  // ---------- flores do vaso: cada círculo do desenho vira uma coroa de pétalas ----------
  $$('.v-flor').forEach(function (g, gi) {
    var rs = $$('circle', g).map(function (c) { return +c.getAttribute('r'); }), cores = gi % 2 ? ['#fff', '#e9dabc', '#dabd8f'] : ['#ede1c8', '#ddc399', '#fbf8f3'];
    g.innerHTML = '';
    rs.forEach(function (r, k) {
      if (k === rs.length - 1) { var c = d.createElementNS(NS, 'circle'); c.setAttribute('r', r * .8); c.setAttribute('fill', cores[2]); c.setAttribute('stroke', '#dabf91'); c.setAttribute('stroke-width', '1'); g.appendChild(c); return; }
      var n = k === 0 ? 14 : 10;
      for (var q = 0; q < n; q++) {
        var e = d.createElementNS(NS, 'ellipse');
        e.setAttribute('cx', 0); e.setAttribute('cy', -r * .55); e.setAttribute('rx', r * (k === 0 ? .26 : .3)); e.setAttribute('ry', r * .5);
        e.setAttribute('transform', 'rotate(' + (q * 360 / n + k * 12) + ')');
        e.setAttribute('fill', cores[k]); e.setAttribute('stroke', k === 0 ? '#e7d7b8' : '#fff'); e.setAttribute('stroke-width', '1');
        g.appendChild(e);
      }
    });
  });

  // ---------- do espelho ao resultado: a rolagem conta o processo e troca a foto presa ao lado ----------
  var proc = $('.processo');
  if (proc && 'IntersectionObserver' in window) {
    var pFotos = $$('.pr-fotos img', proc), pPassos = $$('.pr-passo', proc);
    var ioP = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = +e.target.dataset.i;
        pFotos.forEach(function (f, k) { f.classList.toggle('on', k === i); });
        pPassos.forEach(function (x, k) { x.classList.toggle('on', k === i); });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    pPassos.forEach(function (x) { ioP.observe(x); });
  }

  // ---------- tabelas: o nome da coluna vai em cada célula (no celular a linha vira cartão) ----------
  $$('.tabela').forEach(function (t) {
    var cab = [].map.call(t.querySelectorAll('thead th'), function (th) { return th.textContent.trim(); });
    [].forEach.call(t.querySelectorAll('tbody tr'), function (tr) {
      [].forEach.call(tr.children, function (c, i) { if (c.tagName === 'TD' && cab[i]) c.setAttribute('data-rotulo', cab[i]); });
    });
  });

  // ---------- aparecer ao rolar ----------
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('ver'); io.unobserve(e.target); } }); }, { threshold: .18 });
  // títulos (h1/h2) ficam parados: bloco com título não sobe inteiro, só as partes sem título
  $$('.anima').forEach(function (el) {
    if (el.matches('h1, h2')) { el.classList.remove('anima'); return; }
    if (!el.querySelector('h1, h2')) return;
    el.classList.remove('anima');
    [].forEach.call(el.children, function (f) { if (!f.matches('h1, h2') && !f.querySelector('h1, h2')) f.classList.add('anima'); });
  });
  $$('.anima, .ajuda, .numeros').forEach(function (el) { io.observe(el); });

  // ---------- carrossel de casos ----------
  var car = $('[data-car]');
  if (car) (function () {
  var trilho = $('.car-trilho', car), casos = $$('.caso', car), ci = 1;
  function posCar() {
    var c = casos[ci], larg = car.clientWidth;
    trilho.style.transform = 'translateX(' + (larg / 2 - (c.offsetLeft + c.offsetWidth / 2)) + 'px)';
    casos.forEach(function (x, k) { x.classList.toggle('ativo', k === ci); x.setAttribute('aria-hidden', String(k !== ci)); });
  }
  function vaiCar(n) { ci = (n + casos.length) % casos.length; posCar(); }
  $('.car-ant').addEventListener('click', function () { vaiCar(ci - 1); });
  $('.car-prox').addEventListener('click', function () { vaiCar(ci + 1); });
  casos.forEach(function (c, k) { c.addEventListener('click', function () { if (k !== ci) vaiCar(k); }); });
  var x0 = null;
  trilho.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
  addEventListener('pointerup', function (e) { if (x0 === null) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) vaiCar(ci + (dx < 0 ? 1 : -1)); });
  addEventListener('resize', posCar); addEventListener('load', posCar); posCar();
  })();

  // ---------- como podemos ajudar: rosto com pontos ----------
  var Z = JSON.parse((d.getElementById('corpo-dados') || { textContent: '{}' }).textContent);
  var atual = 'abdomen', camada = $('.pontos-corpo'), fig = $('.aj-corpo');
  if (camada) (function () {
  var CHAVES = Object.keys(Z), info = $('.aj-info'), nome = $('.aj-nome'), selBt = $('.aj-atual'), selLista = $('#aj-lista');
  CHAVES.forEach(function (k) {
    var z = Z[k], b = d.createElement('button');
    b.type = 'button'; b.className = 'ponto' + (z.x > 310 ? ' esq' : '') + (z.lado === 'fora' ? ' ponto-casa' : ''); b.dataset.z = k; b.dataset.lado = z.lado; b.setAttribute('aria-label', z.n + (z.lado === 'costas' ? ' (costas)' : ''));
    b.style.left = (z.x / 600 * 100) + '%'; b.style.top = (z.y / 900 * 100) + '%';
    b.innerHTML = (z.lado === 'fora' ? '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 22 24 7l18 15"/><path d="M11 18v22h26V18"/><path d="M20 40V29h8v11"/></svg>' : '') + '<span>' + z.n + '</span>'; camada.appendChild(b);
    var li = d.createElement('li'); li.innerHTML = '<button type="button" data-z="' + k + '">' + z.n + '</button>'; selLista.appendChild(li);
  });
  var CHECK = '<svg viewBox="0 0 30 30" aria-hidden="true"><use href="#i-check"/></svg>';
  function mostra(k, foco) {
    atual = k; var z = Z[k];
    nome.textContent = z.n;
    info.innerHTML = '<p>' + z.t + '</p><ul>' + z.l.map(function (x) { return '<li>' + CHECK + '<span>' + x + '</span></li>'; }).join('') + '</ul>' +
      '<dl><div><dt>formato</dt><dd>' + z.v[0] + '</dd></div><div><dt>onde</dt><dd>' + z.v[1] + '</dd></div><div><dt>indicação</dt><dd>' + z.v[2] + '</dd></div></dl>' +
      '<div class="aj-bts"><button type="button" class="pilula" data-abrir-agenda data-int="' + z.p + '">Avaliar ' + z.n.toLowerCase() + '</button><a class="pilula" href="' + z.u + '">Ver tratamento</a></div>';
    info.classList.remove('troca'); void info.offsetWidth; info.classList.add('troca');
    if (fig && (z.lado === 'frente' || z.lado === 'costas')) lado(z.lado);
    $$('.ponto').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.z === k)); });
    abreLista(false); faq(false);
    if (foco) selBt.focus();
  }
  function lado(l) {
    fig.dataset.lado = l;
    $$('.ponto', camada).forEach(function (b) { b.hidden = !(b.dataset.lado === l || b.dataset.lado === 'fora'); });
    var vb = $('.vira-corpo'); if (vb) { vb.textContent = l === 'frente' ? 'Ver as costas' : 'Ver a frente'; vb.setAttribute('aria-pressed', String(l === 'costas')); }
  }
  var vira = $('.vira-corpo'); if (vira) vira.addEventListener('click', function () { lado(fig.dataset.lado === 'frente' ? 'costas' : 'frente'); });
  lado('frente');
  function abreLista(v) { selLista.hidden = !v; selBt.setAttribute('aria-expanded', String(v)); }
  selBt.addEventListener('click', function () { abreLista(selLista.hidden); });
  selLista.addEventListener('click', function (e) { var b = e.target.closest('[data-z]'); if (b) mostra(b.dataset.z, true); });
  camada.addEventListener('click', function (e) { var b = e.target.closest('[data-z]'); if (b) mostra(b.dataset.z); });
  var faqBt = $('.aj-faq-bt'), faqEl = $('#aj-faq'), area = $('.aj-area');
  function faq(v) { faqEl.hidden = !v; area.hidden = v; faqBt.setAttribute('aria-expanded', String(v)); faqBt.textContent = v ? 'Áreas do corpo' : 'Dúvidas'; }
  faqBt.addEventListener('click', function () { faq(faqEl.hidden); });
  mostra('abdomen');
  })();

  // ---------- contadores ----------
  var ioN = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; ioN.unobserve(e.target);
      var el = e.target, fim = parseFloat(el.dataset.conta), dec = 'dec' in el.dataset, mil = 'mil' in el.dataset, t0 = performance.now(), dur = calmo ? 1 : 1600;
      function fmt(v) { return dec ? v.toFixed(1).replace('.', ',') : mil ? Math.round(v).toLocaleString('pt-BR') : String(Math.round(v)); }
      (function passo(t) { var q = Math.min(1, (t - t0) / dur); el.textContent = fmt(fim * (1 - Math.pow(1 - q, 3))); if (q < 1) requestAnimationFrame(passo); })(t0);
    });
  }, { threshold: .6 });
  $$('[data-conta]').forEach(function (el) { ioN.observe(el); });

  // ---------- pétalas caindo na faixa escura ----------
  var pet = $('.petalas');
  if (!calmo && pet) for (var j = 0; j < 14; j++) {
    var s = d.createElement('span'); s.className = 'petala';
    s.style.left = (Math.random() * 100) + '%';
    s.style.animationDuration = (9 + Math.random() * 9) + 's'; s.style.animationDelay = (-Math.random() * 16) + 's';
    s.style.setProperty('--dx', (Math.random() * 160 - 60) + 'px'); s.style.setProperty('--r', (180 + Math.random() * 360) + 'deg');
    s.style.transform = 'scale(' + (.6 + Math.random() * .7) + ')'; s.style.opacity = (.4 + Math.random() * .5).toFixed(2);
    pet.appendChild(s);
  }

  // ---------- dicas em vídeo: prévia no hover (computador) e janela com o vídeo ao clicar no play ----------
  var dj = $('#dica-janela'), djv = dj && $('.dj-video', dj);
  var passa = matchMedia('(hover: hover) and (pointer: fine)').matches;
  function toca(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  $$('.reel').forEach(function (r) {
    var v = $('video', r);
    if (v && passa && !calmo) {
      r.addEventListener('mouseenter', function () { r.classList.add('tocando'); toca(v); });
      r.addEventListener('mouseleave', function () { r.classList.remove('tocando'); v.pause(); });
    }
    r.addEventListener('click', function () {
      if (!dj || !v) return;
      v.pause(); r.classList.remove('tocando');
      var tit = $('.reel-tit', r).cloneNode(true), sm = $('small', tit); if (sm) sm.remove();
      $('#dj-t', dj).textContent = tit.textContent.trim();
      $('.dj-dica', dj).textContent = $('.reel-dica', r).textContent;
      var src = $('source', v).getAttribute('src');
      if (djv.getAttribute('data-src') !== src) { djv.setAttribute('data-src', src); djv.poster = v.getAttribute('poster'); djv.src = src; }
      if (dj.showModal) dj.showModal(); else dj.setAttribute('open', '');
      djv.currentTime = 0; toca(djv);
    });
  });
  if (dj) {
    var fechaDica = function () { djv.pause(); if (dj.open) { if (dj.close) dj.close(); else dj.removeAttribute('open'); } };
    $('.dj-fechar', dj).addEventListener('click', fechaDica);
    dj.addEventListener('click', function (e) { if (e.target === dj) fechaDica(); });
    dj.addEventListener('close', function () { djv.pause(); });
    $('[data-abrir-agenda]', dj).addEventListener('click', function () { fechaDica(); });
  }

  // ---------- vídeos de fundo: tocam só quando aparecem na tela (com movimento reduzido fica o pôster) ----------
  if (!calmo && 'IntersectionObserver' in window) $$('video[data-auto]').forEach(function (v) {
    new IntersectionObserver(function (e) { if (e[0].isIntersecting) toca(v); else v.pause(); }, { threshold: .25 }).observe(v);
  });

  // ---------- pedido de avaliação em 3 passos (agendar.html) ----------
  var pf = $('[data-passos]');
  if (pf) (function () {
    var ps = $$('.pf-passo', pf), et = $$('.pf-etapas li', pf), n = 0;
    function vai(k) {
      n = Math.max(0, Math.min(ps.length - 1, k));
      ps.forEach(function (x, i) { x.hidden = i !== n; });
      et.forEach(function (x, i) { x.classList.toggle('on', i <= n); });
      var f = $('input:checked, input:not([type=radio])', ps[n]); if (f) f.focus();
    }
    pf.addEventListener('click', function (e) { if (e.target.closest('[data-prox]')) vai(n + 1); else if (e.target.closest('[data-volta]')) vai(n - 1); });
    pf.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = pf.nome.value.trim(), tel = pf.tel.value.replace(/\D/g, ''), er = $('.erro', pf);
      pf.nome.classList.toggle('ruim', nome.length < 2); pf.tel.classList.toggle('ruim', tel.length < 10);
      er.textContent = nome.length < 2 ? 'Escreva seu nome.' : tel.length < 10 ? 'Confira o WhatsApp com DDD.' : !pf.aceite.checked ? 'Marque que concorda com a política de privacidade.' : '';
      if (er.textContent) return;
      var int = pf.querySelector('[name=pint]:checked').value, dia = pf.querySelector('[name=pdia]:checked'), hora = pf.querySelector('[name=phora]:checked'), local = pf.querySelector('[name=plocal]:checked').value;
      hora = (dia ? dia.value : 'dia a combinar') + (hora ? ', às ' + hora.value : '');
      if (window.BR_WA) window.BR_WA('Olá, Dra. Marina! Sou ' + nome + ' e quero agendar uma avaliação na Clínica LEMAHE.\n• Interesse: ' + int + '\n• Onde: ' + local + '\n• Dia e horário: ' + hora + '\n• WhatsApp: ' + pf.tel.value.trim());
      pf.innerHTML = '<p class="pf-ok">Obrigada, ' + nome.split(' ')[0].replace(/[<>&"]/g, '') + '. A mensagem abriu no seu WhatsApp: é só enviar, e a clínica confirma o horário.</p>';
    });
  })();

  // ---------- mensagem pelo formulário de contato ----------
  var fc = $('#f-contato');
  if (fc) fc.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = fc.nome.value.trim(), tel = fc.tel.value.replace(/\D/g, ''), msg = fc.msg.value.trim(), er = $('.erro', fc);
    fc.nome.classList.toggle('ruim', nome.length < 2); fc.tel.classList.toggle('ruim', tel.length < 10); fc.msg.classList.toggle('ruim', msg.length < 3);
    er.textContent = nome.length < 2 ? 'Escreva seu nome.' : tel.length < 10 ? 'Confira o WhatsApp com DDD.' : msg.length < 3 ? 'Escreva a sua mensagem.' : !fc.aceite.checked ? 'Marque que concorda com a política de privacidade.' : '';
    if (er.textContent) return;
    if (window.BR_WA) window.BR_WA('Olá, Clínica LEMAHE! Sou ' + nome + ' (WhatsApp ' + fc.tel.value.trim() + (fc.email.value.trim() ? ', e-mail ' + fc.email.value.trim() : '') + '). ' + msg);
    fc.innerHTML = '<p class="pf-ok">Mensagem pronta, ' + nome.split(' ')[0].replace(/[<>&"]/g, '') + '. A mensagem abriu no seu WhatsApp: é só enviar.</p>';
  });

  // ---------- janela de agendamento ----------
  // painel lateral em passos: interesse → período → dados → confirmação com resumo (envio simulado na demonstração)
  var dlg = $('#agenda');
  var INTS = [].map.call($$('#ag-int option'), function (o) { return o.text; });
  var GRADE = { semana: ['08:00', '09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30'], sabado: ['08:00', '09:00', '10:00', '11:00'] };
  var SEM = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  var isoD = function (x) { return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
  var ocup = function (x, h) { var t = isoD(x) + h, n = 0; for (var i = 0; i < t.length; i++) n = (n * 31 + t.charCodeAt(i)) % 997; return n % 3 === 0; };
  var DIAS = (function () { var l = [], x = new Date(); x.setHours(12, 0, 0, 0); while (l.length < 6) { x.setDate(x.getDate() + 1); if (x.getDay() !== 0) l.push(new Date(x)); } return l; })();
  var horasDe = function (x) { return x.getDay() === 6 ? GRADE.sabado : GRADE.semana; };
  var fmtD = function (x) { return x.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }); };
  window.LEMAHE_AGENDA = { DIAS: DIAS, horasDe: horasDe, ocup: ocup, SEM: SEM, fmtD: fmtD };
  var ag = { int: '', per: '', dia: -1, hora: '', nome: '', tel: '', passo: 0 };
  var escH = function (t) { return String(t).replace(/[<>&"]/g, function (m) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[m]; }); };
  var corpoAg = $('.ag-corpo', dlg);
  dlg.classList.add('ag-painel');
  function msgAg() { return 'Olá, Dra. Marina! Sou ' + ag.nome + ' e quero agendar uma avaliação na Clínica LEMAHE.\n• Interesse: ' + ag.int + '\n• Dia e horário: ' + ag.per + '\n• WhatsApp: ' + ag.tel; }
  function chips(lista, atual, nome) {
    return '<div class="ag-chips" role="radiogroup">' + lista.map(function (t) { return '<button type="button" role="radio" class="ag-chip" data-' + nome + '="' + escH(t) + '" aria-checked="' + (t === atual) + '">' + escH(t) + '</button>'; }).join('') + '</div>';
  }
  function telaAg() {
    var p = ag.passo, h = '<ol class="ag-prog" aria-label="Etapas">' + ['Interesse', 'Dia e horário', 'Seus dados', 'Confirmar'].map(function (n, i) { return '<li class="' + (i < p ? 'feito' : i === p ? 'agora' : '') + '"' + (i === p ? ' aria-current="step"' : '') + '><span>' + n + '</span></li>'; }).join('') + '</ol>';
    if (p === 0) h += '<p class="ag-olho">Passo 1 de 4</p><h2 id="ag-t" tabindex="-1">O que avaliar?</h2><p class="ag-sub">Se não souber, a Dra. Marina indica na avaliação individual.</p>' + chips(INTS, ag.int, 'int');
    if (p === 1) h += '<p class="ag-olho">Passo 2 de 4</p><h2 id="ag-t" tabindex="-1">Dia e horário</h2><p class="ag-sub">Escolha um horário livre. A clínica confirma pelo WhatsApp.</p><div class="ag-dias">' + DIAS.map(function (x, i) { return '<button type="button" class="ag-dia" data-dia="' + i + '" aria-pressed="' + (ag.dia === i) + '">' + SEM[x.getDay()] + '<b>' + x.getDate() + '</b></button>'; }).join('') + '</div><div class="ag-horas">' + (ag.dia > -1 ? horasDe(DIAS[ag.dia]).map(function (hh) { var o = ocup(DIAS[ag.dia], hh); return '<button type="button" class="ag-hora" data-hora="' + hh + '" aria-pressed="' + (ag.hora === hh) + '"' + (o ? ' disabled aria-label="' + hh + ', ocupado"' : '') + '>' + hh + '</button>'; }).join('') : '<p class="ag-sub" style="grid-column:1/-1">Escolha o dia.</p>') + '</div><p class="ag-demo-mini">Demonstração: horários de exemplo até a agenda da clínica ser ligada.</p>';
    if (p === 2) h += '<p class="ag-olho">Passo 3 de 4</p><h2 id="ag-t" tabindex="-1">Seus dados</h2><p class="ag-sub">Só para a recepção confirmar com você.</p><form class="ag ag-dados" novalidate><label for="ag-nome">Seu nome</label><input id="ag-nome" name="nome" autocomplete="name" value="' + escH(ag.nome) + '"><label for="ag-tel">WhatsApp com DDD</label><input id="ag-tel" name="tel" inputmode="tel" autocomplete="tel" placeholder="(16) 99999-9999" value="' + escH(ag.tel) + '"><p class="erro" aria-live="polite"></p><div class="ag-pe"><button type="button" class="pilula" data-ag-volta>Voltar</button><button type="submit" class="pilula pilula-cheia">Ver resumo</button></div></form>';
    if (p === 3) h += '<p class="ag-olho">Passo 4 de 4</p><h2 id="ag-t" tabindex="-1">Confira</h2><dl class="ag-resumo"><div><dt>Interesse</dt><dd>' + escH(ag.int) + '</dd></div><div><dt>Dia e horário</dt><dd>' + escH(ag.per) + '</dd></div><div><dt>Nome</dt><dd>' + escH(ag.nome) + '</dd></div><div><dt>WhatsApp</dt><dd>' + escH(ag.tel) + '</dd></div><div><dt>Avaliação</dt><dd>Individual, com a Dra. Marina</dd></div></dl><div class="ag-pe"><button type="button" class="pilula" data-ag-volta>Voltar</button><button type="button" class="pilula pilula-cheia" data-ag-ok>Enviar pelo WhatsApp</button></div>';
    if (p === 4) h += '<p class="ag-olho">Pedido feito</p><h2 id="ag-t" tabindex="-1">Tudo certo, ' + escH(ag.nome.split(' ')[0]) + '</h2><p class="ag-sub">A mensagem abriu no seu WhatsApp. É só enviar: a clínica confirma o horário.</p><dl class="ag-resumo"><div><dt>Interesse</dt><dd>' + escH(ag.int) + '</dd></div><div><dt>Dia e horário</dt><dd>' + escH(ag.per) + '</dd></div></dl><div class="ag-pe"><button type="button" class="pilula" data-ag-fecha>Fechar</button><button type="button" class="pilula pilula-cheia" data-ag-wa>Abrir de novo</button></div>';
    if (p < 2) h += '<div class="ag-pe">' + (p ? '<button type="button" class="pilula" data-ag-volta>Voltar</button>' : '<span></span>') + '<button type="button" class="pilula pilula-cheia" data-ag-segue' + ((p === 0 ? ag.int : ag.hora) ? '' : ' disabled') + '>Continuar</button></div>';
    corpoAg.innerHTML = h;
    var t = $('#ag-t', corpoAg); if (t && telaAg.foco) t.focus({ preventScroll: true });
    telaAg.foco = true; corpoAg.scrollTop = 0;
  }
  function abreAgenda(int) {
    ag = { int: INTS.indexOf(int) > -1 ? int : '', per: '', dia: -1, hora: '', nome: ag.nome, tel: ag.tel, passo: 0 };
    telaAg.foco = false; telaAg();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    setTimeout(function () { var c = $('.ag-chip[aria-checked="true"]', dlg) || $('.ag-chip', dlg); if (c) c.focus(); }, 80);
  }
  function fechaAgenda() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
  d.addEventListener('click', function (e) { var b = e.target.closest('[data-abrir-agenda]'); if (!b) return; e.preventDefault(); fechaDd(null); abreAgenda(b.dataset.int || (Z[atual] && b.closest('.aj-info') ? Z[atual].p : '')); });
  $('.ag-fechar').addEventListener('click', fechaAgenda);
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) { fechaAgenda(); return; }
    var c = e.target.closest('.ag-chip');
    if (c) { if (c.dataset.int) ag.int = c.dataset.int; ag.passo++; telaAg(); return; }
    var dd = e.target.closest('.ag-dia'); if (dd) { ag.dia = +dd.dataset.dia; ag.hora = ''; telaAg(); return; }
    var hb = e.target.closest('.ag-hora'); if (hb && !hb.disabled) { ag.hora = hb.dataset.hora; ag.per = fmtD(DIAS[ag.dia]) + ', às ' + ag.hora; telaAg(); return; }
    if (e.target.closest('[data-ag-segue]')) { ag.passo++; telaAg(); return; }
    if (e.target.closest('[data-ag-volta]')) { ag.passo = Math.max(0, ag.passo - 1); telaAg(); return; }
    if (e.target.closest('[data-ag-ok]')) { ag.passo = 4; telaAg(); if (window.BR_WA) window.BR_WA(msgAg()); return; }
    if (e.target.closest('[data-ag-fecha]')) { fechaAgenda(); return; }
    if (e.target.closest('[data-ag-wa]')) { fechaAgenda(); if (window.BR_WA) window.BR_WA(msgAg()); }
  });
  dlg.addEventListener('submit', function (e) {
    var fd = e.target.closest('.ag-dados'); if (!fd) return;
    e.preventDefault();
    var n = fd.nome.value.trim(), t = fd.tel.value.replace(/\D/g, ''), er = $('.erro', fd);
    fd.nome.classList.toggle('ruim', n.length < 2); fd.tel.classList.toggle('ruim', t.length < 10 || t.length > 11);
    er.textContent = n.length < 2 ? 'Escreva seu nome.' : (t.length < 10 || t.length > 11) ? 'Confira o WhatsApp com DDD.' : '';
    if (er.textContent) { (n.length < 2 ? fd.nome : fd.tel).focus(); return; }
    ag.nome = n; ag.tel = fd.tel.value.trim(); ag.passo = 3; telaAg();
  });
})();

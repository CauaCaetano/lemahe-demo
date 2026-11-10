// Clínica LEMAHE · agendar em 3 passos: o que avaliar → dia e horário → seus dados, terminando num resumo que abre o WhatsApp da clínica.
// Com o link da Agenda Google da clínica (clinica.json → agenda_google) mostra a agenda real no lugar da demonstração.
// Os horários da demonstração são de exemplo e estáveis por data; nada é gravado no site.
(function () {
  'use strict';
  var sec = document.getElementById('agenda'); if (!sec) return;
  var $ = function (s, r) { return (r || sec).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || sec).querySelectorAll(s)); };
  var ZAP = sec.dataset.zap;
  var google = (sec.dataset.google || '').trim();
  if (/^https:\/\/calendar\.google\.com\//.test(google)) {
    $('[data-demo]').hidden = true; var area = $('[data-google-area]'); area.hidden = false;
    var fr = document.createElement('iframe'); fr.className = 'google-agenda'; fr.src = google; fr.title = 'Agenda da Clínica LEMAHE'; fr.loading = 'lazy';
    area.prepend(fr); return;
  }
  var GRADE = { semana: ['08:00', '09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30'], sabado: ['08:00', '09:00', '10:00', '11:00'] };
  var SEM = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  var hoje = new Date(); hoje.setHours(12, 0, 0, 0);
  var iso = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  var ocupado = function (d, h) { var s = iso(d) + h, n = 0; for (var i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) % 997; return n % 3 === 0; };
  var horas = function (d) { return d.getDay() === 6 ? GRADE.sabado : GRADE.semana; };
  var fmt = function (d) { return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }); };
  var todos = (function () { var l = [], d = new Date(hoje); while (l.length < 18) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) l.push(new Date(d)); } return l; })();

  var passo = 0, trat = null, local = 'Na clínica', dia = null, hora = null, semana = 0;
  var passos = $$('.ag-passo'), prog = $$('.ag-prog li');
  function vai(n) {
    passo = n;
    passos.forEach(function (p, k) { p.hidden = k !== n; });
    prog.forEach(function (li, k) { li.className = k < n ? 'feito' : k === n ? 'agora' : ''; });
    if (n === 1) desenha(); if (n === 3) resumo();
    var h = $('h2', passos[n]); if (h && document.activeElement && sec.contains(document.activeElement)) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  }

  // passo 1: o que avaliar
  var chips = $$('[data-trat]');
  function marca(b) { chips.forEach(function (c) { c.setAttribute('aria-checked', String(c === b)); }); trat = b.dataset.trat; $('[data-ir="1"]').disabled = false; }
  chips.forEach(function (b) { b.addEventListener('click', function () { marca(b); }); });
  var q = new URLSearchParams(location.search), pre = q.get('t');
  if (pre) { var achado = chips.filter(function (c) { return c.dataset.slug === pre; })[0]; if (achado) marca(achado); }
  $$('[name=local]').forEach(function (r) { r.addEventListener('change', function () { local = r.value; }); });
  if (pre === 'fisioterapia-domiciliar') { var rc = $('[name=local][value="Em casa"]'); if (rc) { rc.checked = true; local = 'Em casa'; } }

  // passo 2: dia e horário
  function desenha() {
    var lista = todos.slice(semana * 6, semana * 6 + 6);
    $('[data-mes]').textContent = lista[0].toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^./, function (c) { return c.toUpperCase(); });
    $('[data-semana="-1"]').disabled = semana === 0; $('[data-semana="1"]').disabled = semana >= 2;
    $('[data-dias]').innerHTML = lista.map(function (d) {
      var livres = horas(d).filter(function (h) { return !ocupado(d, h); }).length;
      return '<button type="button" class="dia" data-d="' + iso(d) + '" aria-pressed="' + (!!dia && iso(dia) === iso(d)) + '"' + (livres ? '' : ' disabled') + ' aria-label="' + fmt(d) + ', ' + (livres ? livres + ' horários livres' : 'sem horários') + '">' + SEM[d.getDay()] + '<b>' + d.getDate() + '</b><small>' + (livres ? livres + ' livres' : 'lotado') + '</small></button>';
    }).join('');
    var d = dia && lista.some(function (x) { return iso(x) === iso(dia); }) ? dia : null;
    $('[data-horas]').innerHTML = d ? horas(d).map(function (h) { var oc = ocupado(d, h); return '<button type="button" class="hora" data-h="' + h + '" aria-pressed="' + (h === hora) + '"' + (oc ? ' disabled aria-label="' + h + ', ocupado"' : '') + '>' + h + '</button>'; }).join('') : '<p class="miudo" style="grid-column:1/-1;margin:0">Escolha um dia para ver os horários.</p>';
    $('[data-escolha]').innerHTML = dia && hora ? 'Escolhido: <b>' + fmt(dia) + ', às ' + hora + '</b>' : dia ? '<b>' + fmt(dia) + '</b>: escolha o horário.' : 'Escolha o dia e o horário.';
    $('[data-ir="2"]').disabled = !(dia && hora);
  }
  sec.addEventListener('click', function (e) {
    var s = e.target.closest('[data-semana]'); if (s && !s.disabled) { semana += +s.dataset.semana; desenha(); return; }
    var b = e.target.closest('.dia'); if (b && !b.disabled) { dia = todos.filter(function (d) { return iso(d) === b.dataset.d; })[0]; hora = null; desenha(); return; }
    var h = e.target.closest('.hora'); if (h && !h.disabled) { hora = h.dataset.h; desenha(); }
  });
  dia = todos.slice(0, 6).filter(function (d) { return horas(d).some(function (h) { return !ocupado(d, h); }); })[0] || null;

  // navegação
  $$('[data-ir]').forEach(function (b) { b.addEventListener('click', function () {
    var n = +b.dataset.ir;
    if (n === 3) { // valida os dados
      var nome = $('#a-nome'), tel = $('#a-tel'), end = $('#a-end'), erro = $('#a-erro'), digitos = tel.value.replace(/\D/g, '');
      nome.classList.toggle('ruim', nome.value.trim().length < 3); tel.classList.toggle('ruim', digitos.length < 10);
      var precisaEnd = local === 'Em casa' && end.value.trim().length < 5; end.classList.toggle('ruim', precisaEnd);
      erro.textContent = nome.value.trim().length < 3 ? 'Escreva o seu nome completo.' : digitos.length < 10 ? 'Informe o telefone com DDD.' : precisaEnd ? 'Para atendimento em casa, informe o endereço.' : '';
      if (erro.textContent) return;
    }
    vai(n);
  }); });
  $$('[data-volta]').forEach(function (b) { b.addEventListener('click', function () { vai(+b.dataset.volta); }); });
  $$('[name=local]').forEach(function (r) { r.addEventListener('change', function () { $('[data-end]').hidden = local !== 'Em casa'; }); });
  $('[data-end]').hidden = local !== 'Em casa';

  function resumo() {
    var linhas = [['Avaliar', trat], ['Onde', local], ['Dia', fmt(dia)], ['Horário', hora], ['Nome', $('#a-nome').value.trim()], ['Telefone', $('#a-tel').value.trim()]];
    if (local === 'Em casa') linhas.push(['Endereço', $('#a-end').value.trim()]);
    var obs = $('#a-obs').value.trim(); if (obs) linhas.push(['Observação', obs]);
    $('[data-resumo]').innerHTML = linhas.map(function (l) { var dl = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = l[0]; dd.textContent = l[1]; dl.append(dt, dd); return dl.outerHTML; }).join('');
    var txt = 'Olá, Dra. Marina! Quero agendar uma avaliação na Clínica LEMAHE.\n\n' + linhas.map(function (l) { return l[0] + ': ' + l[1]; }).join('\n');
    $('[data-enviar]').href = 'https://wa.me/' + ZAP + '?text=' + encodeURIComponent(txt);
  }
  vai(0);
})();

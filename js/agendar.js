// LEMAHE · página Agendar: preenche o passo "Dia e horário" do pedido com os próximos dias e horários (exemplo até a Agenda Google entrar),
// e troca o pedido pela Agenda Google quando clinica.json tiver agenda_google.
(function () {
  'use strict';
  var A = window.LEMAHE_AGENDA, pf = document.getElementById('pf'); if (!A || !pf) return;
  var g = (pf.dataset.google || '').trim(), area = document.getElementById('ag-google');
  if (/^https:\/\/calendar\.google\.com\//.test(g) && area) {
    var fr = document.createElement('iframe'); fr.className = 'google-agenda'; fr.src = g; fr.title = 'Agenda da Clínica LEMAHE'; fr.loading = 'lazy';
    area.hidden = false; area.appendChild(fr);
  }
  var dias = pf.querySelector('[data-pf-dias]'), horas = pf.querySelector('[data-pf-horas]');
  dias.innerHTML = A.DIAS.map(function (x, i) { return '<label class="op"><input type="radio" name="pdia" value="' + A.fmtD(x) + '" data-i="' + i + '"' + (i ? '' : ' checked') + '><span>' + A.SEM[x.getDay()] + ', ' + x.getDate() + '/' + (x.getMonth() + 1) + '</span></label>'; }).join('');
  function poeHoras() {
    var i = +pf.querySelector('[name=pdia]:checked').dataset.i, x = A.DIAS[i], prim = true;
    horas.innerHTML = A.horasDe(x).map(function (h) { var o = A.ocup(x, h), c = !o && prim; if (c) prim = false; return '<label class="op' + (o ? ' op-oc' : '') + '"><input type="radio" name="phora" value="' + h + '"' + (o ? ' disabled' : '') + (c ? ' checked' : '') + '><span>' + h + (o ? ' · ocupado' : '') + '</span></label>'; }).join('');
  }
  dias.addEventListener('change', poeHoras); poeHoras();
  var q = new URLSearchParams(location.search).get('t');
  if (q) { var r = pf.querySelector('[name=pint][data-slug="' + q + '"]'); if (r) r.checked = true; if (q === 'fisioterapia-domiciliar') { var c = pf.querySelector('[name=plocal][value="Em casa"]'); if (c) c.checked = true; } }
})();

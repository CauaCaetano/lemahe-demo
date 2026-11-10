// Monte o seu pacote: junta tratamentos, sessões e local numa mensagem pronta para o WhatsApp da clínica.
// Sem preços: a clínica responde com o orçamento, e a quantidade de sessões é ajustada na avaliação.
(function () {
  'use strict';
  var f = document.querySelector('[data-pacote]'); if (!f) return;
  var lista = f.querySelector('[data-pac-lista]'), erro = f.querySelector('[data-pac-erro]'), zap = f.dataset.zap;
  function dados() {
    return {
      t: [].map.call(f.querySelectorAll('[name=trat]:checked'), function (i) { return i.value; }),
      s: (f.querySelector('[name=sessoes]:checked') || {}).value, l: (f.querySelector('[name=local]:checked') || {}).value
    };
  }
  function atualiza() {
    var d = dados(); erro.textContent = '';
    lista.innerHTML = '';
    if (!d.t.length) { var li = document.createElement('li'); li.className = 'vazio'; li.textContent = 'Nenhum tratamento escolhido ainda.'; lista.append(li); }
    d.t.concat(['Sessões: ' + d.s, 'Onde: ' + d.l]).forEach(function (t) { var li = document.createElement('li'); li.textContent = t; lista.append(li); });
  }
  f.addEventListener('change', atualiza);
  var q = new URLSearchParams(location.search).get('t');
  if (q) { var c = f.querySelector('[data-slug="' + q + '"]'); if (c) c.checked = true; }
  atualiza();
  f.addEventListener('submit', function (e) {
    e.preventDefault(); var d = dados();
    if (!d.t.length) { erro.textContent = 'Escolha pelo menos um tratamento para pedir o orçamento.'; return; }
    var msg = 'Olá! Montei um pacote no site da Clínica LEMAHE e quero um orçamento:\n' + d.t.map(function (x) { return '• ' + x; }).join('\n') + '\nSessões: ' + d.s + '\nAtendimento: ' + d.l + '\n\nSei que o plano final é definido na avaliação individual.';
    window.open('https://wa.me/' + zap + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });
})();

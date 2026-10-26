// Monte o seu pacote: junta tratamentos, sessões e local numa mensagem pronta para o WhatsApp da clínica. Sem preços: a clínica responde o valor.
(function () {
  var f = document.querySelector('[data-pacote]'); if (!f) return;
  var resumo = f.querySelector('[data-pacote-resumo]'), erro = f.querySelector('[data-pacote-erro]');
  var zap = (document.querySelector('.zap') || {}).href || '';
  var numero = (zap.match(/wa\.me\/(\d+)/) || [])[1];
  function dados() {
    var t = [].map.call(f.querySelectorAll('.pacote-itens input:checked'), function (i) { return i.value; });
    return { t: t, s: f.querySelector('[name=sessoes]:checked').value, l: f.querySelector('[name=local]:checked').value };
  }
  function atualiza() {
    var d = dados(); erro.textContent = '';
    resumo.textContent = d.t.length ? d.t.length + (d.t.length > 1 ? ' tratamentos' : ' tratamento') + ' · ' + d.s + ' · ' + d.l : 'Escolha pelo menos um tratamento.';
  }
  f.addEventListener('change', atualiza);
  f.addEventListener('submit', function (e) {
    e.preventDefault(); var d = dados();
    if (!d.t.length) { erro.textContent = 'Escolha pelo menos um tratamento para pedir o orçamento.'; return; }
    var msg = 'Olá! Montei um pacote pelo site e quero um orçamento:\n' + d.t.map(function (x) { return '• ' + x; }).join('\n') + '\nSessões: ' + d.s + '\nAtendimento: ' + d.l;
    window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });
})();

// Clínica LEMAHE · menu do celular, ano do rodapé, pedido de horário e pacote pelo WhatsApp (nada é gravado no site).
(function () {
  var ZAP = '5516992884458';
  // horários oferecidos no pedido; a clínica confirma pelo WhatsApp. Domingo fechado.
  var HORARIOS = { semana: ['08:00', '09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30', '17:30'], sabado: ['08:00', '09:00', '10:00', '11:00'] };
  var DIAS_A_FRENTE = 21;
  var $ = function (s) { return document.querySelector(s); };
  var abreZap = function (txt) { window.open('https://wa.me/' + ZAP + '?text=' + encodeURIComponent(txt), '_blank', 'noopener'); };

  var bt = $('.abre-menu'), menu = $('#menu');
  if (bt) bt.addEventListener('click', function () { var a = menu.classList.toggle('aberto'); bt.setAttribute('aria-expanded', a); bt.setAttribute('aria-label', a ? 'Fechar o menu' : 'Abrir o menu'); });
  document.querySelectorAll('[data-ano]').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  // ------------------------------------------------ pedido de horário
  var form = $('#form-agenda');
  if (form) {
    var dia = null, hora = null, diasEl = $('#ag-dias'), horasEl = $('#ag-horas');
    var SEM = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
    var t = new URLSearchParams(location.search).get('t');
    if (t) { var op = form.querySelector('option[data-t="' + t + '"]'); if (op) op.selected = true; }
    var dias = [];
    for (var i = 1; dias.length < DIAS_A_FRENTE && i < 40; i++) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + i); if (d.getDay() !== 0) dias.push(d); }
    diasEl.innerHTML = dias.map(function (d, k) { return '<button type="button" aria-pressed="false" data-k="' + k + '">' + SEM[d.getDay()] + '<small>' + d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + '</small></button>'; }).join('');
    var horas = function () {
      if (!dia) { horasEl.innerHTML = '<small>Escolha o dia primeiro.</small>'; return; }
      var l = dia.getDay() === 6 ? HORARIOS.sabado : HORARIOS.semana;
      horasEl.innerHTML = l.map(function (h) { return '<button type="button" aria-pressed="' + (h === hora) + '" data-h="' + h + '">' + h + '</button>'; }).join('');
    };
    diasEl.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; dia = dias[b.dataset.k]; hora = null; diasEl.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); horas(); });
    horasEl.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; hora = b.dataset.h; horasEl.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); });
    horas();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var erro = $('#ag-erro'), nome = $('#ag-nome').value.trim();
      erro.textContent = !dia ? 'Escolha o dia.' : !hora ? 'Escolha o horário.' : nome.length < 2 ? 'Escreva o seu nome.' : '';
      if (erro.textContent) return;
      var quando = dia.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
      var obs = $('#ag-obs').value.trim();
      abreZap('Olá, Dra. Marina! Sou ' + nome + ' e quero agendar pelo site da Clínica LEMAHE.\n\nTratamento: ' + $('#ag-trat').value + '\nDia: ' + quando + '\nHorário: ' + hora + (obs ? '\n\n' + obs : '') + '\n\nEsse horário está livre?');
    });
  }

  // ------------------------------------------------ monte seu pacote
  var pac = $('#form-pacote');
  if (pac) {
    var ITENS = ['Diástase abdominal', 'Lipedema e drenagem linfática', 'Flacidez e contorno corporal', 'Gordura localizada (Gelo X / TikaIce)', 'HidroHot 360°', 'LipoDetox', 'Laser para dor e artrose', 'Terapia capilar com laser', 'Auriculoterapia', 'Ventosaterapia e massagem'];
    var box = $('#pac-itens');
    box.innerHTML = ITENS.map(function (n, k) { return '<label><input type="checkbox" data-k="' + k + '"><span>' + n + '</span><select data-s="' + k + '" aria-label="Sessões de ' + n + '">' + [5, 10, 15, 20].map(function (s) { return '<option value="' + s + '"' + (s === 10 ? ' selected' : '') + '>' + s + ' sessões</option>'; }).join('') + '</select></label>'; }).join('');
    var escolhidos = function () { return [].map.call(box.querySelectorAll('input:checked'), function (c) { var k = c.dataset.k; return ITENS[k] + ': ' + box.querySelector('[data-s="' + k + '"]').value + ' sessões'; }); };
    var resumo = function () { var l = escolhidos(); $('#pac-resumo').textContent = l.length ? l.length + ' tratamento(s) no pacote.' : 'Nenhum tratamento escolhido.'; };
    box.addEventListener('change', resumo);
    pac.addEventListener('submit', function (e) {
      e.preventDefault();
      var l = escolhidos(); $('#pac-erro').textContent = l.length ? '' : 'Escolha pelo menos um tratamento.';
      if (l.length) abreZap('Olá, Dra. Marina! Montei um pacote no site da Clínica LEMAHE e queria saber o valor:\n\n- ' + l.join('\n- ') + '\n\nTem condição de pagamento?');
    });
  }
})();

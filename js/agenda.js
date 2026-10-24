// LEMAHE · agenda. Com o link da Agenda Google da clínica (clinica.json → agenda_google) mostra a agenda real;
// sem ele, mostra a demonstração: horários de exemplo, escolha do horário e confirmação pelo WhatsApp (nada é gravado).
(function () {
  var ZAP = '5516992884458';
  // horários de atendimento da demonstração; a agenda real vem da Agenda Google
  var GRADE = { semana: ['08:00', '09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30'], sabado: ['08:00', '09:00', '10:00', '11:00'] };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var hoje = new Date(); hoje.setHours(12, 0, 0, 0);
  var iso = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  var ocupado = function (d, h) { var s = iso(d) + h, n = 0; for (var i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) % 997; return n % 3 === 0; }; // exemplo estável por data
  var diasUteis = function (desde, qtd) { var l = [], d = new Date(desde); while (l.length < qtd) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) l.push(new Date(d)); } return l; };
  var horas = function (d) { return d.getDay() === 6 ? GRADE.sabado : GRADE.semana; };
  var SEM = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  var fmt = function (d) { return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }); };

  // faixa de próximos horários (página inicial)
  var faixa = $('[data-slots]');
  if (faixa) {
    var l = [];
    diasUteis(hoje, 8).forEach(function (d) { var n = 0; horas(d).forEach(function (h) { if (l.length < 5 && n < 2 && !ocupado(d, h) && (n === 0 || h > '12')) { l.push([d, h]); n++; } }); });
    faixa.innerHTML = l.map(function (x) { return '<a class="slot" href="agendar.html?d=' + iso(x[0]) + '&h=' + x[1] + '"><span>' + SEM[x[0].getDay()] + ', ' + x[0].getDate() + '/' + (x[0].getMonth() + 1) + '</span><b>' + x[1] + '</b></a>'; }).join('');
  }

  var sec = $('#agenda'); if (!sec) return;
  var google = (sec.dataset.google || '').trim();
  if (/^https:\/\/calendar\.google\.com\//.test(google)) {
    $('[data-demo]').hidden = true; var area = $('[data-google-area]'); area.hidden = false;
    area.innerHTML = '<iframe class="google-agenda" src="' + google.replace(/"/g, '') + '" title="Agenda da Clínica LEMAHE" loading="lazy"></iframe>';
    return;
  }

  var q = new URLSearchParams(location.search), semana = 0, dia = null, hora = null;
  var t = q.get('t'); if (t) { var op = $('#r-trat option[data-t="' + t + '"]'); if (op) op.selected = true; }
  var todos = diasUteis(hoje, 18);
  if (q.get('d')) { var achou = todos.findIndex(function (d) { return iso(d) === q.get('d'); }); if (achou >= 0) { dia = todos[achou]; semana = Math.floor(achou / 6); hora = q.get('h'); } }
  var escolha = $('[data-escolha]');
  var marca = function () { escolha.innerHTML = dia && hora ? '<b>' + fmt(dia) + '</b>, às <b>' + hora + '</b>' : dia ? '<b>' + fmt(dia) + '</b>. Escolha o horário.' : 'Nenhum horário escolhido.'; };
  var desenha = function () {
    var lista = todos.slice(semana * 6, semana * 6 + 6);
    $('[data-mes]').textContent = lista[0].toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^./, function (c) { return c.toUpperCase(); });
    $('[data-semana="-1"]').disabled = semana === 0; $('[data-semana="1"]').disabled = semana >= 2;
    $('[data-dias]').innerHTML = lista.map(function (d) { var livres = horas(d).filter(function (h) { return !ocupado(d, h); }).length; return '<button type="button" class="dia" data-d="' + iso(d) + '" aria-pressed="' + (dia && iso(dia) === iso(d)) + '"' + (livres ? '' : ' disabled') + '>' + SEM[d.getDay()] + '<b>' + d.getDate() + '</b><small>' + (livres ? livres + ' livres' : 'lotado') + '</small></button>'; }).join('');
    var d = dia && lista.some(function (x) { return iso(x) === iso(dia); }) ? dia : null;
    $('[data-horas]').innerHTML = d ? horas(d).map(function (h) { var oc = ocupado(d, h); return '<button type="button" class="hora" data-h="' + h + '" aria-pressed="' + (h === hora) + '"' + (oc ? ' disabled' : '') + '>' + h + '<small>' + (oc ? 'ocupado' : 'livre') + '</small></button>'; }).join('') : '<p class="miudo" style="grid-column:1/-1;margin:0">Escolha um dia para ver os horários.</p>';
    marca();
  };
  sec.addEventListener('click', function (e) {
    var s = e.target.closest('[data-semana]'); if (s && !s.disabled) { semana += +s.dataset.semana; desenha(); return; }
    var b = e.target.closest('.dia'); if (b && !b.disabled) { dia = todos.find(function (d) { return iso(d) === b.dataset.d; }); hora = null; desenha(); return; }
    var h = e.target.closest('.hora'); if (h && !h.disabled) { hora = h.dataset.h; desenha(); }
  });
  if (!dia) dia = todos.slice(0, 6).find(function (d) { return horas(d).some(function (h) { return !ocupado(d, h); }); }) || null;
  desenha();
  $('#form-reserva').addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = $('#r-nome').value.trim(), tel = $('#r-tel').value.replace(/\D/g, ''), erro = $('#r-erro');
    erro.textContent = !dia || !hora ? 'Escolha o dia e o horário na agenda.' : nome.length < 3 ? 'Informe o seu nome completo.' : tel.length < 10 ? 'Informe o telefone com DDD.' : '';
    if (erro.textContent) return;
    var obs = $('#r-obs').value.trim();
    window.open('https://wa.me/' + ZAP + '?text=' + encodeURIComponent('Olá. Gostaria de confirmar um agendamento na Clínica LEMAHE.\n\nNome: ' + nome + '\nTelefone: ' + $('#r-tel').value.trim() + '\nTratamento: ' + $('#r-trat').value + '\nData: ' + fmt(dia) + ', às ' + hora + (obs ? '\nObservação: ' + obs : '')), '_blank', 'noopener');
  });
})();

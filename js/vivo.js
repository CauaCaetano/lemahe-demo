// LEMAHE · movimento da página: revelar ao rolar, vídeos que tocam quando aparecem, seletor de incômodos, foto ampliada e barra do celular.
(function () {
  var calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  // revelar ao entrar na tela
  var vistos = $$('.surge, .titulo-hero, .hero-palco');
  if (calmo || !('IntersectionObserver' in window)) vistos.forEach(function (e) { e.classList.add('visto'); });
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    vistos.forEach(function (e) { io.observe(e); });
  }

  // vídeo: carrega e toca só quando aparece; pausa quando sai
  var liga = function (v) { if (!v.src && v.dataset.src) v.src = v.dataset.src; var p = v.play(); if (p && p.catch) p.catch(function () {}); };
  if (!calmo && 'IntersectionObserver' in window) {
    var iv = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) liga(e.target); else e.target.pause(); }); }, { threshold: .35 });
    $$('.reel video, .trat video').forEach(function (v) { iv.observe(v); });
  }

  // o círculo da abertura troca de vídeo a cada 7 segundos
  var hv = $$('.hero-video');
  if (hv.length && !calmo) {
    var k = 0; liga(hv[0]);
    setInterval(function () { if (document.hidden) return; var a = hv[k]; k = (k + 1) % hv.length; var b = hv[k]; liga(b); b.classList.add('ativo'); a.classList.remove('ativo'); setTimeout(function () { a.pause(); }, 1500); }, 7000);
  }

  // o que está te incomodando?
  var INC = [
    { rot: 'Fisioterapia', t: 'Diástase abdominal', d: 'Depois da gestação, os músculos do abdômen podem ficar afastados, e a barriga não volta mesmo com dieta e exercício. Com avaliação e fisioterapia dá para recuperar a função, a postura e o contorno da cintura.', l: ['Avaliação da distância entre os músculos', 'Protocolo de fisioterapia para o abdômen'], img: 'img/fotos/diastase-antes-depois.webp', ag: 'diastase' },
    { rot: 'Fisioterapia dermatofuncional', t: 'Lipedema e drenagem', d: 'Pernas que incham, pesam e doem precisam de um tratamento próprio, que cuida do inchaço, da dor e da firmeza da pele.', l: ['Drenagem linfática manual', 'Recursos escolhidos para o seu caso'], video: 'video/drenagem', ag: 'lipedema' },
    { rot: 'Estética avançada', t: 'Método Gelo X · TikaIce', d: 'O Método Gelo X usa baixa temperatura para reduzir gordura localizada e melhorar a flacidez. A Dra. Marina foi a primeira profissional habilitada no método em Orlândia e região.', l: ['Protocolo TikaIce', 'HidroHot 360°', 'LipoDetox'], img: 'img/fotos/tikaice-1.webp', ag: 'gordura' },
    { rot: 'Fisioterapia dermatofuncional', t: 'Flacidez e contorno', d: 'Mais firmeza para a pele e um contorno mais definido, com protocolo montado pela região do corpo e pela sua avaliação.', l: ['Pode ser associado ao Gelo X e ao tratamento de lipedema'], img: 'img/fotos/lipedema-flacidez.webp', ag: 'flacidez' },
    { rot: 'Fisioterapia', t: 'Laser e reabilitação', d: 'Laser para artrose de joelho, facilitação neuromuscular associada ao exercício e treinamento funcional para voltar a se mexer sem dor.', l: ['Laser para artrose', 'Facilitação neuromuscular', 'Treinamento funcional'], video: 'video/laser-joelho', ag: 'dor' },
    { rot: 'Estética', t: 'Terapia capilar com laser', d: 'Laser para fortalecer os fios e cuidar da queda de cabelo.', l: ['Sessões na clínica, com acompanhamento'], video: 'video/terapia-capilar', ag: 'capilar' },
    { rot: 'Terapia integrativa', t: 'Auriculoterapia, ventosaterapia e laser ILIB', d: 'Cuidado para o corpo e para as emoções: auriculoterapia para disfunções energéticas, emocionais e físicas, ventosaterapia para aliviar a tensão e laser ILIB.', l: ['Auriculoterapia', 'Ventosaterapia', 'Laser ILIB', 'Massagem'], video: 'video/auriculoterapia', ag: 'integrativa' },
    { rot: 'Fisioterapia', t: 'Fisioterapia em casa', d: 'A Dra. Marina vai até você para a reabilitação e a fisioterapia respiratória de quem não pode ir até a clínica.', l: ['Reabilitação', 'Fisioterapia respiratória', 'Pacientes acamados ou com pouca mobilidade'], video: 'video/domiciliar', ag: 'domiciliar' }
  ];
  var lista = $('.inc-lista');
  if (lista) {
    var midia = $('.inc-midia'), texto = $('.inc-texto');
    var mostra = function (i) {
      var x = INC[i];
      $$('button', lista).forEach(function (b) { b.setAttribute('aria-selected', b.dataset.i == i); });
      midia.innerHTML = x.video ? '<video muted playsinline loop autoplay poster="' + x.video + '.jpg" src="' + x.video + '.mp4"></video>' : '<img src="' + x.img + '" alt="' + x.t + '">';
      var v = $('video', midia); if (v && calmo) v.removeAttribute('autoplay');
      var novo = texto.cloneNode(false);
      novo.innerHTML = '<p class="rot">' + x.rot + '</p><h3>' + x.t + '</h3><p class="inc-desc">' + x.d + '</p><ul>' + x.l.map(function (y) { return '<li>' + y + '</li>'; }).join('') + '</ul><a class="bt" href="agendar.html?t=' + x.ag + '">Agendar avaliação</a>';
      texto.replaceWith(novo); texto = novo;
    };
    lista.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) mostra(+b.dataset.i); });
    lista.addEventListener('keydown', function (e) { if (!/Arrow(Up|Down|Left|Right)/.test(e.key)) return; e.preventDefault(); var bs = $$('button', lista), i = bs.indexOf(document.activeElement), n = (i + (/Down|Right/.test(e.key) ? 1 : -1) + bs.length) % bs.length; bs[n].focus(); mostra(n); });
    mostra(0);
  }

  // foto ampliada
  document.addEventListener('click', function (e) {
    var f = e.target.closest('[data-zoom]'); if (!f) return;
    var z = document.createElement('div'); z.className = 'zoom'; z.setAttribute('role', 'dialog'); z.setAttribute('aria-label', 'Foto ampliada');
    z.innerHTML = '<img src="' + f.dataset.zoom + '" alt="' + ($('img', f).alt || '') + '">';
    var fecha = function () { z.remove(); document.removeEventListener('keydown', esc); f.focus(); }, esc = function (k) { if (k.key === 'Escape') fecha(); };
    z.addEventListener('click', fecha); document.addEventListener('keydown', esc); document.body.appendChild(z);
  });

  // topo com sombra e barra de agendar no celular depois da abertura
  var topo = $('.topo'), barra = $('.barra-cel');
  var rola = function () { var y = scrollY; if (topo) topo.classList.toggle('rolou', y > 10); if (barra) barra.classList.toggle('mostra', y > 520 && (innerHeight + y) < document.documentElement.scrollHeight - 140); };
  addEventListener('scroll', rola, { passive: true }); rola();
})();

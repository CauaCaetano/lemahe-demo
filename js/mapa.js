// LEMAHE · mapa do corpo: a pessoa toca onde incomoda e vê o tratamento, o vídeo ou o resultado e o botão de agendar.
(function () {
  var sec = document.querySelector('.mapa'); if (!sec) return;
  var calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s) { return sec.querySelector(s); }, $$ = function (s) { return [].slice.call(sec.querySelectorAll(s)); };

  var AREAS = {
    cabelo: { nome: 'Cabelo', cx: 150, cy: 40, r: 46, itens: [
      { t: 'Terapia capilar com laser', d: 'Sessões de laser para fortalecer os fios e cuidar da queda de cabelo, com acompanhamento da evolução.', v: 'terapia-capilar', ag: 'capilar', id: 'capilar' }] },
    emocoes: { nome: 'Ansiedade, tensão e cansaço', cx: 121, cy: 76, r: 44, itens: [
      { t: 'Auriculoterapia', d: 'A “acupuntura na orelha”: pontos estimulados para disfunções energéticas, emocionais e físicas, como ansiedade, tensão e insônia.', v: 'auriculoterapia', ag: 'integrativa', id: 'integrativa' },
      { t: 'Laser ILIB', d: 'Laserterapia sistêmica, aplicada no pulso, usada como apoio no cuidado do corpo como um todo.', v: 'ilib', ag: 'integrativa', id: 'dor' }] },
    corpo: { nome: 'Corpo inchado, tenso ou pesado', cx: 150, cy: 200, r: 90, itens: [
      { t: 'Drenagem linfática manual', d: 'Ajuda a reduzir o inchaço e a sensação de peso, e acompanha os tratamentos de contorno e de lipedema.', v: 'drenagem', ag: 'lipedema', id: 'lipedema' },
      { t: 'LipoDetox', d: 'Protocolo para a retenção de líquido e a sensação de corpo inchado e pesado.', v: 'lipodetox', ag: 'lipodetox', id: 'lipodetox' },
      { t: 'Ventosaterapia', d: 'Ventosas para aliviar a tensão muscular e soltar as costas e os ombros.', v: 'ventosaterapia', ag: 'integrativa', id: 'integrativa' }] },
    abdomen: { nome: 'Barriga', cx: 150, cy: 262, r: 62, itens: [
      { t: 'Diástase abdominal', d: 'Depois da gestação, os músculos do abdômen podem ficar afastados e a barriga não volta mesmo com dieta e exercício. A fisioterapia recupera a função, a postura e o contorno da cintura.', img: 'img/fotos/diastase-antes-depois.webp', leg: 'Antes e depois de 3 sessões', ag: 'diastase', id: 'diastase' },
      { t: 'Método Gelo X · TikaIce', d: 'Baixa temperatura para reduzir gordura localizada e melhorar a flacidez. A Dra. Marina foi a primeira profissional habilitada no método em Orlândia e região.', img: 'img/fotos/tikaice-1.webp', leg: 'Protocolo TikaIce', ag: 'gordura', id: 'gordura' },
      { t: 'HidroHot 360°', d: 'Protocolo para gordura localizada e flacidez, pensado para mais firmeza e contorno. A clínica faz dias especiais com vagas limitadas.', img: 'img/fotos/hidrohot-resultado.webp', leg: 'Resultado do HidroHot', ag: 'gordura', id: 'gordura' },
      { t: 'LipoTika', d: 'Protocolo da clínica para o contorno abdominal, montado na avaliação.', img: 'img/fotos/lipotika-2.webp', leg: 'Protocolo LipoTika', ag: 'gordura', id: 'gordura' }] },
    pernas: { nome: 'Pernas', cx: 170, cy: 400, r: 80, itens: [
      { t: 'Lipedema', d: 'Pernas que incham, pesam e doem precisam de um tratamento próprio, que cuida do inchaço, da dor e da firmeza da pele.', img: 'img/fotos/lipedema-flacidez.webp', leg: 'Lipedema e flacidez em tratamento', ag: 'lipedema', id: 'lipedema' },
      { t: 'Flacidez e contorno', d: 'Mais firmeza para a pele e um contorno mais definido, com protocolo montado pela região do corpo.', img: 'img/fotos/diastase-2.webp', leg: 'Contorno corporal', ag: 'flacidez', id: 'flacidez' }] },
    joelho: { nome: 'Joelho e articulações', cx: 112, cy: 466, r: 46, itens: [
      { t: 'Laser para artrose de joelho', d: 'Laser como parte do tratamento da dor da artrose, junto com exercícios para voltar a se mexer.', v: 'laser-joelho', ag: 'dor', id: 'dor' },
      { t: 'Facilitação neuromuscular', d: 'Técnica associada ao exercício para recuperar força, controle e movimento.', v: 'neuromuscular', ag: 'dor', id: 'dor' },
      { t: 'Treinamento funcional', d: 'Exercícios na clínica para ganhar força e equilíbrio no dia a dia.', v: 'funcional', ag: 'dor', id: 'dor' }] },
    casa: { nome: 'Não posso ir à clínica', cx: 150, cy: 330, r: 0, itens: [
      { t: 'Fisioterapia em casa', d: 'A Dra. Marina vai até você para a reabilitação, a fisioterapia respiratória e o cuidado de pacientes acamados ou com pouca mobilidade, em qualquer idade.', v: 'domiciliar', ag: 'domiciliar', id: 'domiciliar' }] }
  };

  var aura = $('.aura'), area = $('.mp-area'), midia = $('.mp-midia'), tit = $('.mp-titulo'), txt = $('.mp-texto'), chips = $('.mp-chips'), ag = $('.mp-agendar'), mais = $('.mp-mais'), painel = $('.mapa-painel');
  var atual = null;

  function mostra(chave, i) {
    var A = AREAS[chave], x = A.itens[i || 0]; atual = chave;
    $$('[data-area]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.area === chave); });
    aura.style.cx = A.cx + 'px'; aura.style.cy = A.cy + 'px'; aura.style.r = (A.r || 1) + 'px'; aura.style.opacity = A.r ? 1 : 0;
    painel.classList.remove('entra'); void painel.offsetWidth; painel.classList.add('entra');
    area.textContent = A.nome;
    midia.innerHTML = x.v ? '<video muted playsinline loop ' + (calmo ? '' : 'autoplay ') + 'poster="video/' + x.v + '.jpg" src="video/' + x.v + '.mp4"></video>'
      : '<img src="' + x.img + '" alt="' + x.leg + '"><figcaption>' + x.leg + '</figcaption>';
    tit.textContent = x.t; txt.textContent = x.d;
    chips.innerHTML = A.itens.length > 1 ? A.itens.map(function (y, k) { return '<button type="button" data-i="' + k + '" aria-pressed="' + (k === (i || 0)) + '">' + y.t + '</button>'; }).join('') : '';
    ag.href = 'agendar.html?t=' + x.ag; mais.href = 'tratamentos.html#' + x.id;
  }

  sec.addEventListener('click', function (e) {
    var b = e.target.closest('[data-area]'); if (b) { mostra(b.dataset.area); if (innerWidth < 861 && b.classList.contains('ponto')) painel.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth', block: 'nearest' }); return; }
    var c = e.target.closest('.mp-chips button'); if (c) mostra(atual, +c.dataset.i);
  });
  mostra('abdomen');
  requestAnimationFrame(function () { sec.classList.add('pronto'); });
})();

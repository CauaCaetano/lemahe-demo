// LEMAHE · animações dos procedimentos: abas, pausar e seguir sozinho para o próximo procedimento a cada ciclo.
(function () {
  var a = document.querySelector('.anima'); if (!a) return;
  var abas = [].slice.call(a.querySelectorAll('.anima-abas button')), cenas = [].slice.call(a.querySelectorAll('.cena')), barra = a.querySelector('.anima-barra i'), atual = 0, mexeu = false;
  function mostra(i) {
    atual = (i + cenas.length) % cenas.length;
    abas.forEach(function (b, k) { b.setAttribute('aria-selected', k === atual); });
    cenas.forEach(function (c, k) { c.classList.toggle('ativa', k === atual); });
    barra.style.animation = 'none'; void barra.offsetWidth; barra.style.animation = '';
  }
  abas.forEach(function (b, k) { b.addEventListener('click', function () { mexeu = true; mostra(k); }); });
  a.querySelector('.anima-play').addEventListener('click', function () { var p = a.classList.toggle('pausada'); this.setAttribute('aria-label', p ? 'Continuar animação' : 'Pausar animação'); });
  barra.addEventListener('animationiteration', function () { if (!mexeu) mostra(atual + 1); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { a.classList.toggle('fora', !es[0].isIntersecting); }, {}).observe(a);
})();

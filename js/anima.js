// LEMAHE · procedimentos em vídeo: abas, passos sincronizados com o tempo do vídeo e o próximo procedimento quando um termina.
(function () {
  var a = document.querySelector('.anima'); if (!a) return;
  var calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var abas = [].slice.call(a.querySelectorAll('.anima-abas button')), cenas = [].slice.call(a.querySelectorAll('.cena')), barra = a.querySelector('.anima-barra i');
  var atual = 0, visivel = false, pausado = false;
  function video(c) { return c.querySelector('video'); }
  function mostra(i) {
    var velho = video(cenas[atual]); velho.pause();
    atual = (i + cenas.length) % cenas.length;
    abas.forEach(function (b, k) { b.setAttribute('aria-selected', k === atual); });
    cenas.forEach(function (c, k) { c.classList.toggle('ativa', k === atual); c.classList.remove('f1', 'f2', 'f3'); });
    var v = video(cenas[atual]); if (!v.src) v.src = v.dataset.src; v.currentTime = 0; passo(cenas[atual], 0); toca();
  }
  function toca() { var v = video(cenas[atual]); if (!v.src) v.src = v.dataset.src; if (visivel && !pausado && !calmo) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
  function passo(c, k) {
    if (c.dataset.passo == k) return; c.dataset.passo = k;
    c.classList.remove('f1', 'f2', 'f3'); c.classList.add('f' + (k + 1));
    var ps = [].slice.call(c.querySelectorAll('.passo')); ps.forEach(function (p, j) { p.classList.toggle('ativo', j === k); });
    var t = c.querySelector('.cena-passo-tela'); t.textContent = ps[k].textContent.replace(/^\d/, ''); t.classList.remove('troca'); void t.offsetWidth; t.classList.add('troca');
  }
  cenas.forEach(function (c, i) {
    var v = video(c);
    v.addEventListener('timeupdate', function () { if (i !== atual || !v.duration) return; var f = v.currentTime / v.duration; barra.style.transform = 'scaleX(' + f.toFixed(3) + ')'; passo(c, Math.min(2, Math.floor(f * 3))); });
    v.addEventListener('ended', function () { if (i === atual) mostra(atual + 1); });
  });
  abas.forEach(function (b, k) { b.addEventListener('click', function () { mostra(k); }); });
  a.querySelector('.anima-play').addEventListener('click', function () { pausado = !pausado; a.classList.toggle('pausada', pausado); this.setAttribute('aria-label', pausado ? 'Continuar vídeo' : 'Pausar vídeo'); var v = video(cenas[atual]); if (pausado) v.pause(); else toca(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; if (visivel) toca(); else video(cenas[atual]).pause(); }, { threshold: .3 }).observe(a);
  else { visivel = true; }
  passo(cenas[0], 0); toca();
})();

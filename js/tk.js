// LEMAHE · linha Truekind: vídeos que tocam só quando aparecem, setas das coleções e a curva do manifesto que se desenha.
(function () {
  var calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  var vids = $$('video.tk-auto');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { var v = e.target; if (e.isIntersecting && !calmo && v.offsetParent) { if (!v.src) v.src = v.dataset.src; var p = v.play(); if (p && p.catch) p.catch(function () {}); } else if (!v.paused) v.pause(); }); }, { threshold: .2 });
    vids.forEach(function (v) { io.observe(v); });
    var man = document.querySelector('.tk-manifesto');
    if (man) new IntersectionObserver(function (es) { if (es[0].isIntersecting) man.classList.add('visto'); }, { threshold: .3 }).observe(man);
  }

  $$('.tk-colecao').forEach(function (c) {
    var t = c.querySelector('.tk-trilho'), passo = function () { var k = t.querySelector('.tk-card'); return k ? k.offsetWidth + 12 : 240; };
    c.querySelector('.tk-seta:not(.tk-volta)').addEventListener('click', function () { t.scrollBy({ left: passo(), behavior: calmo ? 'auto' : 'smooth' }); });
    c.querySelector('.tk-volta').addEventListener('click', function () { t.scrollBy({ left: -passo(), behavior: calmo ? 'auto' : 'smooth' }); });
  });
})();

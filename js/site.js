// Clínica LEMAHE · menu do celular, ano do rodapé e vídeos que tocam só quando aparecem na tela.
(function () {
  var bt = document.querySelector('.abre-menu'), menu = document.getElementById('menu');
  if (bt) bt.addEventListener('click', function () { var a = menu.classList.toggle('aberto'); bt.setAttribute('aria-expanded', a); bt.setAttribute('aria-label', a ? 'Fechar o menu' : 'Abrir o menu'); });
  document.querySelectorAll('[data-ano]').forEach(function (e) { e.textContent = new Date().getFullYear(); });
  var calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vs = document.querySelectorAll('video[data-src]');
  if (!vs.length || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; if (!calmo) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } } else v.pause(); });
  }, { threshold: .3 });
  vs.forEach(function (v) { io.observe(v); });
})();

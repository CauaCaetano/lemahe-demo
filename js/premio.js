// LEMAHE · movimento premium: abertura de entrada, rolagem macia (Lenis), linhas que sobem, manifesto que acende,
// tratamentos na horizontal, parallax, cursor e botões magnéticos. Sem GSAP (ou com movimento reduzido) a página fica parada e completa.
(function () {
  var calmo = matchMedia('(prefers-reduced-motion: reduce)').matches, mouse = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var intro = $('.intro');
  var tiraIntro = function () { if (intro) intro.remove(); intro = null; };
  if (!window.gsap || !window.ScrollTrigger || calmo) { document.documentElement.classList.add('no-motion', 'no-pin'); tiraIntro(); return; }
  gsap.registerPlugin(ScrollTrigger);

  // rolagem macia
  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', function (e) { var a = e.target.closest('a[href^="#"]'); if (a && a.getAttribute('href').length > 1) { var alvo = $(a.getAttribute('href')); if (alvo) { e.preventDefault(); lenis.scrollTo(alvo, { offset: -70 }); } } });
  }

  // abertura de entrada (só na primeira visita da sessão)
  var entrada = gsap.timeline({ paused: true });
  $$('.h3ro .linha > span').forEach(function (s) { gsap.set(s, { yPercent: 110 }); });
  if ($('.h3ro')) {
    gsap.set('.h3ro-palco .anel circle', { strokeDashoffset: 1194 }); gsap.set('.h3ro-palco .janela', { clipPath: 'circle(0% at 50% 50%)' }); gsap.set('.selo-caixa', { scale: 0, rotate: -40 });
    entrada.to('.h3ro .linha > span', { yPercent: 0, duration: 1.1, stagger: .09, ease: 'expo.out' })
      .to('.h3ro-palco .anel circle', { strokeDashoffset: 0, duration: 2, ease: 'power3.inOut' }, 0)
      .to('.h3ro-palco .janela', { clipPath: 'circle(50% at 50% 50%)', duration: 1.5, ease: 'expo.inOut' }, .35)
      .from('.hero-foto', { scale: 1.3, duration: 2, ease: 'expo.out' }, .35)
      .to('.selo-caixa', { scale: 1, rotate: 0, duration: 1, ease: 'back.out(1.6)' }, 1.1);
  }
  var visto = false; try { visto = sessionStorage.getItem('lemahe-intro') === '1'; } catch (e) { /* sem armazenamento */ }
  if (intro && !visto) {
    try { sessionStorage.setItem('lemahe-intro', '1'); } catch (e) { /* sem armazenamento */ }
    if (lenis) lenis.stop();
    var n = { v: 0 }, num = $('.intro-num span');
    gsap.timeline({ onComplete: function () { tiraIntro(); if (lenis) lenis.start(); } })
      .to('.intro-anel circle', { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' })
      .to(n, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: function () { num.textContent = Math.round(n.v); } }, 0)
      .to('.intro-centro img', { opacity: 1, duration: .6 }, .4)
      .to('.intro-centro', { scale: .8, opacity: 0, duration: .5, ease: 'power2.in' }, 1.55)
      .to('.intro', { yPercent: -100, duration: 1, ease: 'expo.inOut' }, 1.8)
      .add(function () { entrada.play(); }, 2.05);
  } else { tiraIntro(); entrada.play(); }

  // parallax da foto da abertura e saída suave
  if ($('.h3ro')) {
    gsap.to('.hero-foto', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.h3ro', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.h3ro-texto', { y: -60, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.h3ro', start: 'center top', end: 'bottom top', scrub: true } });
  }

  // manifesto: cada palavra acende com a rolagem
  $$('[data-palavras]').forEach(function (p) {
    p.innerHTML = p.textContent.split(/(\s+)/).map(function (w) { return /\s+/.test(w) ? w : '<span class="p">' + w + '</span>'; }).join('');
    p.classList.add('pronto');
    gsap.to($$('.p', p), { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  });

  // letreiro grande anda conforme a rolagem
  var tr = $('.letreiro-trilho');
  if (tr) gsap.fromTo(tr, { xPercent: 0 }, { xPercent: -50, ease: 'none', scrollTrigger: { trigger: '.letreiro', start: 'top bottom', end: 'bottom top', scrub: 1 } });

  // tratamentos na horizontal (computador e tablet); no celular vira carrossel de deslizar
  var mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', function () {
    var trilho = $('.horizontal-trilho'), sec = $('.horizontal'); if (!trilho) return;
    var distancia = function () { return trilho.scrollWidth - innerWidth; };
    var cartoes = $$('.cartao-t:not(.cartao-fim)', trilho), atual = $('.c-atual');
    gsap.to(trilho, { x: function () { return -distancia(); }, ease: 'none', scrollTrigger: { trigger: sec, pin: '.horizontal-pin', start: 'top top', end: function () { return '+=' + distancia(); }, scrub: 1, invalidateOnRefresh: true,
      onUpdate: function (st) { var i = Math.min(cartoes.length, Math.max(1, Math.ceil(st.progress * cartoes.length + .01))); if (atual) atual.textContent = String(i).padStart(2, '0'); } } });
    cartoes.forEach(function (c) { var m = $('.ct-midia img, .ct-midia video', c); if (m) gsap.fromTo(m, { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: function () { return '+=' + distancia(); }, scrub: true } }); });
  });
  mm.add('(max-width: 860px)', function () { document.documentElement.classList.add('no-pin'); return function () { document.documentElement.classList.remove('no-pin'); }; });

  // vídeos dos cartões tocam quando aparecem
  if ('IntersectionObserver' in window) {
    var iv = new IntersectionObserver(function (es) { es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { if (!v.src && v.dataset.src) v.src = v.dataset.src; var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }); }, { threshold: .25 });
    $$('.cartao-t video').forEach(function (v) { iv.observe(v); });
  }

  // blocos que sobem ao entrar
  $$('.revela').forEach(function (el) { gsap.from(el, { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }); });

  // resultados: cortina + profundidade
  $$('.r3').forEach(function (r, i) {
    var img = $('img', r), caixa = $('.r3-img', r);
    gsap.from(caixa, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', delay: (i % 3) * .08, scrollTrigger: { trigger: r, start: 'top 90%' } });
    if (innerWidth > 860) gsap.fromTo(r, { y: 40 * ((i % 3) - 1) }, { y: -40 * ((i % 3) - 1), ease: 'none', scrollTrigger: { trigger: '.r3-grade', start: 'top bottom', end: 'bottom top', scrub: true } });
    if (img && innerWidth > 860) gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: r, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // a doutora: moldura em arco que se abre
  if ($('.dra-moldura')) {
    gsap.from('.dra-moldura', { clipPath: 'inset(30% 30% 30% 30% round 260px 260px 30px 30px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.dra-moldura', start: 'top 80%' } });
    gsap.to('.dra-moldura img', { scale: 1, ease: 'none', scrollTrigger: { trigger: '.dra-moldura', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // números dos passos e título final
  $$('.p3-num').forEach(function (n) { gsap.from(n, { xPercent: -30, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: n, start: 'top 85%' } }); });
  if ($('.final3')) { gsap.set('.final3 .linha > span', { yPercent: 110 }); gsap.to('.final3 .linha > span', { yPercent: 0, duration: 1.2, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.final3', start: 'top 70%' } }); }

  // cursor e botões magnéticos (só com mouse)
  if (mouse) {
    var c = document.createElement('div'); c.className = 'cursor'; c.setAttribute('aria-hidden', 'true'); document.body.appendChild(c);
    var xTo = gsap.quickTo(c, 'x', { duration: .45, ease: 'power3' }), yTo = gsap.quickTo(c, 'y', { duration: .45, ease: 'power3' });
    addEventListener('mousemove', function (e) { xTo(e.clientX); yTo(e.clientY); });
    document.addEventListener('mouseover', function (e) { var v = e.target.closest('[data-cursor="ver"]'), l = e.target.closest('a, button, [role="tab"]'); c.classList.toggle('ver', !!v); c.classList.toggle('link', !v && !!l); c.textContent = v ? 'ver' : ''; });
    $$('.magnetico').forEach(function (b) {
      var bx = gsap.quickTo(b, 'x', { duration: .5, ease: 'elastic.out(1, .4)' }), by = gsap.quickTo(b, 'y', { duration: .5, ease: 'elastic.out(1, .4)' });
      b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); bx((e.clientX - r.left - r.width / 2) * .3); by((e.clientY - r.top - r.height / 2) * .4); });
      b.addEventListener('mouseleave', function () { bx(0); by(0); });
    });
  }
  addEventListener('load', function () { ScrollTrigger.refresh(); });
})();

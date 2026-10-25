// LEMAHE · abertura com bolha de vidro (referência: Beauty in Stem). A bolha com o símbolo distorce o nome LEMAHE ao fundo;
// bolhas menores com os vídeos dos tratamentos flutuam em volta e abrem a ficha de cada um.
import * as THREE from 'three';

const sec = document.querySelector('.bolha');
const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ITENS = [
  { t: 'Terapia capilar com laser', d: 'Sessões de laser para fortalecer os fios e cuidar da queda de cabelo.', v: 'terapia-capilar', ag: 'capilar', id: 'capilar' },
  { t: 'Auriculoterapia', d: 'A “acupuntura na orelha”, para disfunções energéticas, emocionais e físicas, como ansiedade e tensão.', v: 'auriculoterapia', ag: 'integrativa', id: 'integrativa' },
  { t: 'Laser para artrose de joelho', d: 'Laser como parte do tratamento da dor, junto com exercícios para voltar a se mexer.', v: 'laser-joelho', ag: 'dor', id: 'dor' },
  { t: 'Drenagem linfática', d: 'Reduz o inchaço e a sensação de peso, e acompanha o tratamento do lipedema.', v: 'drenagem', ag: 'lipedema', id: 'lipedema' },
  { t: 'Treinamento funcional', d: 'Exercícios na clínica para ganhar força e equilíbrio no dia a dia.', v: 'funcional', ag: 'dor', id: 'dor' }
];

function semWebGL() { try { const c = document.createElement('canvas'); return !(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return true; } }
if (sec) { if (calmo || semWebGL()) { sec.classList.add('parada', 'pronto'); } else iniciar(); }

function iniciar() {
  const canvas = sec.querySelector('.bl-cena'), rotulos = sec.querySelector('.bl-rotulos'), conta = sec.querySelector('.bl-conta');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
  const cena = new THREE.Scene(); cena.background = new THREE.Color(0xf6efe3);
  const cam = new THREE.PerspectiveCamera(35, 1, .1, 60); cam.position.set(0, 0, 10);
  cena.add(new THREE.HemisphereLight(0xffffff, 0xe8dcc6, 1.6));
  const luz = new THREE.DirectionalLight(0xffffff, 2.4); luz.position.set(3, 5, 6); cena.add(luz);
  const luz2 = new THREE.PointLight(0xffe2b0, 18, 20); luz2.position.set(-4, 2, 4); cena.add(luz2);

  // fundo: o nome LEMAHE enorme, para a bolha distorcer
  const W = 2048, H = 1024, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
  const fundo = new THREE.CanvasTexture(cv); fundo.colorSpace = THREE.SRGBColorSpace; fundo.anisotropy = 4;
  function pintaFundo() {
    g.fillStyle = '#f6efe3'; g.fillRect(0, 0, W, H);
    const gr = g.createRadialGradient(W / 2, H * .45, 0, W / 2, H * .45, W * .55); gr.addColorStop(0, '#fffaf1'); gr.addColorStop(1, 'rgba(246,239,227,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.fillStyle = '#3f4c33'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '400 300px Marcellus, serif';
    if ('letterSpacing' in g) g.letterSpacing = '60px';
    g.fillText('LEMAHE', W / 2 + 30, H * .5);
    fundo.needsUpdate = true;
  }
  pintaFundo(); document.fonts && document.fonts.ready.then(pintaFundo);
  const placa = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: fundo, toneMapped: false })); placa.position.z = -4; cena.add(placa);

  const carrega = new THREE.TextureLoader(new THREE.LoadingManager());
  const tex = (u) => { const t = carrega.load(u); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const vidro = (o = {}) => new THREE.MeshPhysicalMaterial(Object.assign({ color: 0xffffff, transmission: 1, thickness: 1.4, roughness: .02, ior: 1.42, dispersion: 4, clearcoat: 1, clearcoatRoughness: .03, specularIntensity: 1, iridescence: .35, iridescenceIOR: 1.3, iridescenceThicknessRange: [120, 480] }, o));

  // a bolha principal com o símbolo
  const principal = new THREE.Group(); cena.add(principal);
  const casca = new THREE.Mesh(new THREE.SphereGeometry(1.7, 96, 64), vidro()); principal.add(casca);
  const simb = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.67), new THREE.MeshBasicMaterial({ map: tex('img/simbolo.webp'), alphaTest: .5, toneMapped: false })); simb.position.z = -.2; principal.add(simb);

  // bolhas menores com os vídeos
  const bolhas = ITENS.map((x, i) => {
    const gr = new THREE.Group(); cena.add(gr);
    const v = document.createElement('video'); Object.assign(v, { muted: true, loop: true, playsInline: true, preload: 'none' }); v.setAttribute('playsinline', ''); v.src = 'video/' + x.v + '.mp4';
    const vt = new THREE.VideoTexture(v); vt.colorSpace = THREE.SRGBColorSpace;
    const disco = new THREE.Mesh(new THREE.CircleGeometry(.5, 48), new THREE.MeshBasicMaterial({ map: tex('video/' + x.v + '.jpg'), toneMapped: false })); disco.userData.item = x; gr.add(disco);
    const c = new THREE.Mesh(new THREE.SphereGeometry(.6, 48, 32), vidro({ thickness: .6, dispersion: 2 })); gr.add(c);
    const r = document.createElement('button'); r.type = 'button'; r.className = 'bl-rotulo'; r.textContent = x.t; r.addEventListener('click', () => abre(x)); rotulos.appendChild(r);
    const a = i / ITENS.length * Math.PI * 2 + .4;
    return { gr, disco, v, vt, x, r, a, rx: 3.3 + (i % 2) * .5, ry: 1.75 + (i % 3) * .25, z: .3 - (i % 2) * 1.2, ligado: false };
  });

  // ficha do tratamento (mesmo diálogo usado no resto do site)
  const ficha = sec.querySelector('.ps-ficha');
  function abre(x) {
    ficha.querySelector('.pf-midia').innerHTML = `<video muted playsinline loop autoplay poster="video/${x.v}.jpg" src="video/${x.v}.mp4"></video>`;
    ficha.querySelector('h3').textContent = x.t; ficha.querySelector('p').textContent = x.d;
    ficha.querySelector('.pf-agendar').href = 'agendar.html?t=' + x.ag; ficha.querySelector('.pf-mais').href = 'tratamentos.html#' + x.id;
    ficha.showModal();
  }
  ficha.addEventListener('click', (e) => { if (e.target === ficha || e.target.closest('.pf-fecha')) ficha.close(); });
  ficha.addEventListener('close', () => { ficha.querySelector('.pf-midia').innerHTML = ''; });

  // mouse e toque
  const mouse = new THREE.Vector2(), alvoM = new THREE.Vector2(), ray = new THREE.Raycaster();
  sec.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); alvoM.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); const h = toque(e); canvas.style.cursor = h ? 'pointer' : ''; });
  function toque(e) { const r = canvas.getBoundingClientRect(); ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), cam); const h = ray.intersectObjects(bolhas.map((b) => b.disco))[0]; return h && h.object.userData.item; }
  canvas.addEventListener('click', (e) => { const x = toque(e); if (x) abre(x); });

  let cel = false;
  function tamanho() {
    const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cel = cam.aspect < .8;
    cam.position.z = cel ? 16 : cam.aspect < 1.2 ? 12.5 : 10; cam.updateProjectionMatrix();
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * (cam.position.z + 4), vw = vh * cam.aspect;
    const s = cel ? vw * 1.25 : Math.max(vw * .92, vh * 1.6); placa.scale.set(s, s / 2, 1); placa.position.y = cel ? 2.4 : 1.1;
  }
  addEventListener('resize', tamanho); tamanho();

  // contador de carregamento
  const inicio = performance.now(); let pct = 0, pronto = false;
  let visivel = true; new IntersectionObserver((es) => { visivel = es[0].isIntersecting; bolhas.forEach((b) => { if (!visivel && !b.v.paused) b.v.pause(); }); }).observe(sec);
  const v3 = new THREE.Vector3(), relogio = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!pronto) { pct = Math.min(100, pct + (100 - pct) * .06 + .4); conta.textContent = Math.round(pct) + '%'; if (pct >= 99.5 && performance.now() - inicio > 1400) { pronto = true; sec.classList.add('pronto'); } }
    if (!visivel || document.hidden) return;
    const t = relogio.getElapsedTime(), w = canvas.clientWidth, h = canvas.clientHeight;
    const r = sec.getBoundingClientRect(), p = Math.max(0, Math.min(1, -r.top / r.height));
    mouse.lerp(alvoM, .06);
    const entra = pronto ? Math.min(1, (t - 1.2) / 1.6) : 0, e = 1 - Math.pow(1 - Math.max(0, entra), 3);
    principal.position.set((cel ? 0 : 1.3) + mouse.x * .35, (cel ? 1.9 : .8) + Math.sin(t * .8) * .08 + mouse.y * .2 - p * 2.2, 0);
    principal.rotation.set(-mouse.y * .25, mouse.x * .4 + Math.sin(t * .3) * .2, 0);
    principal.scale.setScalar((cel ? .9 : 1) * (.85 + e * .15) * (1 + p * .6));
    bolhas.forEach((b, i) => {
      const a = b.a + t * .06, k = (cel ? .55 : 1) * (.6 + e * .4) * (1 + p * 1.4);
      b.gr.position.set((cel ? 0 : 1.3) + Math.cos(a) * b.rx * k + mouse.x * (.6 + i * .1), Math.sin(a) * b.ry * k * (cel ? 1.7 : .72) + (cel ? 1.9 : .8) + Math.sin(t + i) * .12 + mouse.y * .3, b.z);
      b.gr.scale.setScalar(e * (cel ? .8 : 1)); b.disco.lookAt(cam.position);
      if (e > .5 && !b.ligado) { b.ligado = true; const pr = b.v.play(); if (pr && pr.then) pr.then(() => { b.disco.material.map = b.vt; b.disco.material.needsUpdate = true; }).catch(() => {}); }
      v3.copy(b.gr.position); v3.y -= .78 * (cel ? .8 : 1); v3.project(cam);
      const lx = Math.min(w - b.r.offsetWidth / 2 - 8, Math.max(b.r.offsetWidth / 2 + 8, (v3.x + 1) / 2 * w));
      b.r.style.transform = `translate(${lx.toFixed(1)}px, ${((1 - v3.y) / 2 * h).toFixed(1)}px) translate(-50%, 0)`; b.r.classList.toggle('mostra', e > .9 && p < .3);
    });
    renderer.render(cena, cam);
  });
}

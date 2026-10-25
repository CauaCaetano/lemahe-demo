// LEMAHE · passeio pela clínica em 3D (referências: Pop-up La Rosée e Beauty in Stem).
// Uma bolha de vidro com o símbolo recebe a visita; depois a câmera passa por cinco espaços desenhados como maquetes,
// e cada tratamento flutua numa bolha com o vídeo ou a foto de verdade da clínica.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const sec = document.querySelector('.passeio');
const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;

const ESPACOS = [
  { nome: 'Recepção', tit: 'Começa por uma conversa', txt: 'Todo tratamento na LEMAHE começa pela avaliação com a Dra. Marina, que entende a causa do que incomoda antes de escolher qualquer recurso.',
    parede: 0xefe3d0, piso: 0xd8c3a2, itens: [
      { t: 'Dra. Marina Caetano Guirardeli', d: 'Fisioterapeuta dermatofuncional e cardiorrespiratória, enfermeira, farmacêutica e esteticista. Primeira profissional habilitada no Método Gelo X em Orlândia e região. CREFITO-3 216312-F.', img: 'img/fotos/dra-marina.webp', ag: '', id: '', link: 'a-clinica.html' },
      { t: 'Avaliação', d: 'Conversa, exame e medidas. Na avaliação a Dra. Marina define os recursos, a frequência e o número de sessões do seu protocolo.', img: 'img/fotos/dra-marina-circulo.webp', ag: '', id: '' }] },
  { nome: 'Estética', tit: 'Contorno, firmeza e pele', txt: 'Gordura localizada, flacidez e cabelo, com protocolos montados na avaliação.',
    parede: 0xf1ddd3, piso: 0xdcbfae, itens: [
      { t: 'Método Gelo X · TikaIce', d: 'Baixa temperatura para reduzir gordura localizada e melhorar a flacidez. A Dra. Marina foi a primeira habilitada no método em Orlândia e região.', img: 'img/fotos/tikaice-1.webp', ag: 'gordura', id: 'gordura' },
      { t: 'Terapia capilar com laser', d: 'Sessões de laser para fortalecer os fios e cuidar da queda de cabelo.', v: 'terapia-capilar', ag: 'capilar', id: 'capilar' },
      { t: 'HidroHot 360°', d: 'Protocolo para gordura localizada e flacidez, com dias especiais e vagas limitadas.', img: 'img/fotos/hidrohot-resultado.webp', ag: 'gordura', id: 'gordura' }] },
  { nome: 'Fisioterapia', tit: 'Menos dor, mais movimento', txt: 'Diástase, artrose, reabilitação e treino funcional na sala de fisioterapia da clínica.',
    parede: 0xdfe4d0, piso: 0xc9cfb2, itens: [
      { t: 'Diástase abdominal', d: 'Avaliação da distância entre os músculos e fisioterapia para recuperar a função, a postura e o contorno da cintura.', img: 'img/fotos/diastase-antes-depois.webp', ag: 'diastase', id: 'diastase' },
      { t: 'Laser para artrose de joelho', d: 'Laser como parte do tratamento da dor, junto com exercícios para voltar a se mexer.', v: 'laser-joelho', ag: 'dor', id: 'dor' },
      { t: 'Treinamento funcional', d: 'Exercícios na clínica para ganhar força e equilíbrio no dia a dia.', v: 'funcional', ag: 'dor', id: 'dor' }] },
  { nome: 'Integrativa', tit: 'Corpo e mente em equilíbrio', txt: 'Auriculoterapia, ventosaterapia, drenagem e laser ILIB para cuidar do corpo como um todo.',
    parede: 0xe9e2d6, piso: 0xcdbd9f, itens: [
      { t: 'Auriculoterapia', d: 'A “acupuntura na orelha”, para disfunções energéticas, emocionais e físicas.', v: 'auriculoterapia', ag: 'integrativa', id: 'integrativa' },
      { t: 'Drenagem linfática', d: 'Reduz o inchaço e a sensação de peso, e acompanha o tratamento do lipedema.', v: 'drenagem', ag: 'lipedema', id: 'lipedema' },
      { t: 'Ventosaterapia', d: 'Ventosas para aliviar a tensão das costas e dos ombros.', v: 'ventosaterapia', ag: 'integrativa', id: 'integrativa' }] },
  { nome: 'Agenda', tit: 'Escolha o seu horário', txt: 'Veja os horários livres e confirme pelo WhatsApp. Também há fisioterapia em casa para quem não pode ir até a clínica.',
    parede: 0xf3ead9, piso: 0xd9c49f, fim: true, itens: [
      { t: 'Fisioterapia em casa', d: 'A Dra. Marina vai até você para a reabilitação, a fisioterapia respiratória e o cuidado de pacientes acamados.', v: 'domiciliar', ag: 'domiciliar', id: 'domiciliar' }] }
];

function semWebGL() { try { const c = document.createElement('canvas'); return !(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return true; } }

// sem 3D (ou com movimento reduzido): os espaços viram uma lista simples
function plano() {
  sec.classList.add('plano');
  sec.querySelector('.ps-plano').innerHTML = ESPACOS.map((e) => `<div class="ps-esp"><h2>${e.nome}</h2><p>${e.txt}</p><ul>${e.itens.map((x) => `<li><a href="${x.link || (x.id ? 'tratamentos.html#' + x.id : 'a-clinica.html')}">${x.t}</a></li>`).join('')}</ul></div>`).join('');
}

if (sec) { if (calmo || semWebGL()) plano(); else iniciar(); }

function iniciar() {
  const canvas = sec.querySelector('.ps-cena'), rotulos = sec.querySelector('.ps-rotulos');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const cena = new THREE.Scene(); cena.background = new THREE.Color(0xf6efe3); cena.fog = new THREE.Fog(0xf6efe3, 22, 52);
  const cam = new THREE.PerspectiveCamera(38, 1, .1, 120);
  cena.add(new THREE.HemisphereLight(0xfff8ee, 0xcbb898, 1.25));
  const sol = new THREE.DirectionalLight(0xfff2dc, 2.2); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024);
  Object.assign(sol.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 40 }); sol.shadow.bias = -.0008; sol.shadow.radius = 4;
  cena.add(sol, sol.target);

  const carrega = new THREE.TextureLoader();
  const tex = (url) => { const t = carrega.load(url); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const mat = (cor, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: cor, roughness: .82, metalness: 0 }, o));
  const caixa = (pai, w, h, d, cor, x, y, z, r = .12) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2)), typeof cor === 'number' ? mat(cor) : cor); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; pai.add(m); return m; };
  const cilindro = (pai, r1, r2, h, cor, x, y, z) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, 32), typeof cor === 'number' ? mat(cor) : cor); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; pai.add(m); return m; };
  const esfera = (pai, r, cor, x, y, z) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), typeof cor === 'number' ? mat(cor) : cor); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; pai.add(m); return m; };

  // folha do símbolo da LEMAHE, usada como enfeite e nas plantas
  const forma = new THREE.Shape(); forma.moveTo(0, 0); forma.bezierCurveTo(.5, .35, .55, 1.1, 0, 1.6); forma.bezierCurveTo(-.55, 1.1, -.5, .35, 0, 0);
  const folhaGeo = new THREE.ExtrudeGeometry(forma, { depth: .04, bevelEnabled: true, bevelThickness: .03, bevelSize: .03, bevelSegments: 2, curveSegments: 16 }); folhaGeo.center();
  const CORES_FOLHA = [0x8a9a6c, 0x6f7f55, 0xb3bd95, 0xc9a464, 0xa3ad84];
  const folha = (pai, x, y, z, s, cor) => { const m = new THREE.Mesh(folhaGeo, mat(cor, { roughness: .6 })); m.position.set(x, y, z); m.scale.setScalar(s); m.castShadow = true; pai.add(m); return m; };
  const planta = (pai, x, z, s = 1) => { cilindro(pai, .35 * s, .28 * s, .6 * s, 0xe9dcc7, x, .3 * s, z); for (let i = 0; i < 7; i++) { const f = folha(pai, x + Math.sin(i * 2.4) * .25 * s, (.95 + (i % 3) * .28) * s, z + Math.cos(i * 2.4) * .2 * s, .55 * s, CORES_FOLHA[i % 3]); f.rotation.set(Math.cos(i) * .4, i * 2.4, Math.sin(i * 1.7) * .7); } };

  // cinco espaços em fila, como maquetes abertas na frente
  const PASSO = 15, espacos = [];
  ESPACOS.forEach((E, i) => {
    const g = new THREE.Group(); g.position.x = i * PASSO; cena.add(g);
    caixa(g, 10, .5, 7.5, E.piso, 0, -.25, 0, .2);
    caixa(g, 10, 5.2, .4, E.parede, 0, 2.6, -3.55, .15);
    caixa(g, .4, 5.2, 7.5, E.parede, -4.8, 2.6, 0, .15);
    mobilia(g, i);
    espacos.push(g);
  });

  function mobilia(g, i) {
    if (i === 0) { // recepção: balcão, logotipo, sofá e planta
      caixa(g, 3.6, 1.25, 1.1, 0xf7f0e4, -.4, .62, -1.2, .25); caixa(g, 3.8, .12, 1.3, 0xc9a464, -.4, 1.3, -1.2, .05);
      const logo = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.8), new THREE.MeshBasicMaterial({ map: tex('img/logo-sem-fundo.webp'), transparent: true }));
      logo.position.set(-.4, 3.3, -3.33); g.add(logo);
      caixa(g, 2.6, .55, 1, 0xb9c39f, 2.8, .45, 1.2, .3); caixa(g, 2.6, .9, .35, 0xb9c39f, 2.8, .9, .8, .17);
      planta(g, -3.8, -2.6, 1.2); planta(g, 4.2, -2.5, .9);
    } else if (i === 1) { // estética: maca, aparelho e espelho redondo
      caixa(g, 3.4, .25, 1.2, 0xfffaf2, .2, 1, -.6, .12); cilindro(g, .12, .12, .8, 0xc9a464, -1.1, .45, -.6); cilindro(g, .12, .12, .8, 0xc9a464, 1.5, .45, -.6); caixa(g, .8, .2, 1, 0xf4e3dc, -1.2, 1.2, -.6, .1);
      caixa(g, .9, 1.6, .7, 0xf5efe6, 3.2, .8, -2, .18); caixa(g, .7, .5, .06, 0x3f4c33, 3.2, 1.8, -1.68, .03); cilindro(g, .05, .05, 1.4, 0xc9a464, 2.7, 1.8, -1.9).rotation.z = .9;
      const esp = new THREE.Mesh(new THREE.TorusGeometry(.9, .07, 16, 64), mat(0xc9a464, { metalness: .6, roughness: .3 })); esp.position.set(-2.4, 3, -3.32); g.add(esp);
      planta(g, -3.9, -2.4, 1);
    } else if (i === 2) { // fisioterapia: tatame colorido, bolas, cones e step (como a sala de verdade)
      const cores = [0xf2b8c6, 0x9fd3c7, 0xf6d48a, 0xb9b3e6, 0xa8cdea, 0xf3a98b];
      for (let x = 0; x < 5; x++) for (let z = 0; z < 4; z++) caixa(g, 1.18, .08, 1.18, cores[(x + z * 2) % 6], -2.6 + x * 1.2, .04, -2.2 + z * 1.2, .03);
      esfera(g, .65, 0xf3b26b, 3.4, .65, -2.3); esfera(g, .5, 0xf09a7a, 2.4, .5, -2.7);
      [[-1.6, .6], [-.4, .9], [.8, .6]].forEach(([x, z]) => cilindro(g, .02, .22, .55, 0x5aa0d8, x, .32, z));
      caixa(g, 1.5, .3, .7, 0x4a4a4a, .8, .25, -1.6, .1); caixa(g, 1.5, .08, .7, 0xe57ba6, .8, .44, -1.6, .04);
      cilindro(g, .5, .5, .7, 0xe57ba6, -3.6, .35, -2.6); planta(g, 4.2, .9, .8);
    } else if (i === 3) { // integrativa: maca baixa, velas e plantas
      caixa(g, 3.2, .3, 1.2, 0xf3ece0, .4, .7, -.8, .14); caixa(g, 3.2, .4, .3, 0xd8c3a2, .4, .35, -.8, .1);
      for (let k = 0; k < 3; k++) { cilindro(g, .14, .14, .3 + k * .12, 0xfff6e6, -3 + k * .4, .15 + k * .06, -2.6); const ch = new THREE.PointLight(0xffc27a, .8, 2.5); ch.position.set(-3 + k * .4, .45 + k * .12, -2.6); g.add(ch); }
      planta(g, 3.9, -2.4, 1.3); planta(g, -3.8, 1.6, .8);
      const tapete = new THREE.Mesh(new THREE.CircleGeometry(1.6, 48), mat(0xc9b28a)); tapete.rotation.x = -Math.PI / 2; tapete.position.set(.4, .01, 1.2); tapete.receiveShadow = true; g.add(tapete);
    } else { // agenda: mesa, cadeira e um calendário grande na parede
      caixa(g, 2.6, .12, 1.2, 0xc9a464, 1, 1.15, -1.6, .05); cilindro(g, .07, .07, 1.1, 0x8f7550, 0, .55, -1.6); cilindro(g, .07, .07, 1.1, 0x8f7550, 2, .55, -1.6);
      caixa(g, .9, .1, .9, 0xb9c39f, 1, .75, -.4, .08); caixa(g, .9, .9, .1, 0xb9c39f, 1, 1.2, -.05, .05);
      caixa(g, 2.6, 2.2, .1, 0xfffaf2, -1.6, 3, -3.3, .08); caixa(g, 2.6, .5, .12, 0x536344, -1.6, 3.9, -3.29, .06);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) caixa(g, .32, .26, .04, (r * 5 + c) % 4 ? 0xe9dcc7 : 0xc9a464, -2.5 + c * .45, 3.25 - r * .45, -3.22, .04);
      planta(g, 4, -2.4, 1.1);
    }
  }

  // bolha de vidro de entrada, com o símbolo dentro
  const vidro = () => new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, thickness: .6, roughness: .04, ior: 1.3, clearcoat: 1, clearcoatRoughness: .05, attenuationColor: new THREE.Color(0xf3e6d0), attenuationDistance: 6, specularIntensity: 1 });
  const ENTRADA = new THREE.Vector3(-PASSO, 2.6, 0);
  const grande = new THREE.Group(); grande.position.copy(ENTRADA); cena.add(grande);
  const bolhaG = new THREE.Mesh(new THREE.SphereGeometry(2.3, 64, 48), vidro()); grande.add(bolhaG);
  const simb = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.45), new THREE.MeshBasicMaterial({ map: tex('img/simbolo.webp'), alphaTest: .5, side: THREE.DoubleSide })); grande.add(simb);
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; const f = folha(cena, ENTRADA.x + Math.cos(a) * (3.2 + (i % 3)), ENTRADA.y + Math.sin(a * 1.7) * 2.2, Math.sin(a) * 2.5 - 2.2, .6 + (i % 4) * .12, CORES_FOLHA[i % 5]); f.userData.gira = .2 + (i % 5) * .08; f.rotation.set(i, i * 2, i * .5); }

  // folhas e fitas flutuando ao longo de todo o passeio
  const soltas = [];
  for (let i = 0; i < 46; i++) { const f = folha(cena, -PASSO * 1.4 + (i * 7.3) % (PASSO * 6), 5.6 + Math.sin(i * 1.3) * 1.6, -5.5 + Math.cos(i * 2.1) * 2.5, .45 + (i % 4) * .14, CORES_FOLHA[i % 5]); f.rotation.set(i, i * .7, i * 1.3); f.userData.gira = .15 + (i % 5) * .06; soltas.push(f); }
  [[0xc9a464, 0], [0xeec6c0, 1.6], [0xb9c39f, 3.1]].forEach(([cor, fase]) => {
    const pts = []; for (let k = 0; k <= 40; k++) { const x = -PASSO * 1.6 + k * (PASSO * 6.2 / 40); pts.push(new THREE.Vector3(x, 6.2 + Math.sin(k * .5 + fase) * 1.1, -6 + Math.cos(k * .37 + fase) * 1.6)); }
    const fita = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, .09, 8), mat(cor, { roughness: .45 })); fita.scale.z = .35; fita.castShadow = true; cena.add(fita);
  });

  // bolhas dos tratamentos: vidro por fora, vídeo ou foto da clínica por dentro
  const bolhas = [], videos = [];
  ESPACOS.forEach((E, i) => E.itens.forEach((x, k) => {
    const n = E.itens.length, g = new THREE.Group();
    g.position.set(i * PASSO + (n === 1 ? -1.6 : -2.6 + k * (5.2 / (n - 1))), 2.6 + (k % 2) * .9, 1.3 + (k % 2) * -.6); cena.add(g);
    let t;
    if (x.v) { const v = document.createElement('video'); Object.assign(v, { muted: true, loop: true, playsInline: true, preload: 'none', crossOrigin: 'anonymous' }); v.setAttribute('playsinline', ''); v.dataset.src = 'video/' + x.v + '.mp4'; v.poster = 'video/' + x.v + '.jpg'; t = new THREE.VideoTexture(v); t.colorSpace = THREE.SRGBColorSpace; videos.push({ v, esp: i }); x.el = v; }
    else t = tex(x.img);
    const disco = new THREE.Mesh(new THREE.CircleGeometry(.66, 48), new THREE.MeshBasicMaterial({ map: t })); g.add(disco);
    if (x.v) carrega.load('video/' + x.v + '.jpg', (p) => { if (!x.el.src) { p.colorSpace = THREE.SRGBColorSpace; disco.material.map = p; x.poster = p; x.vt = t; } });
    const casca = new THREE.Mesh(new THREE.SphereGeometry(.8, 48, 32), vidro()); casca.userData.item = x; g.add(casca);
    const aro = new THREE.Mesh(new THREE.TorusGeometry(.81, .015, 8, 64), mat(0xc9a464, { metalness: .7, roughness: .25 })); g.add(aro);
    disco.userData.item = x;
    const r = document.createElement('button'); r.type = 'button'; r.className = 'ps-rotulo'; r.textContent = x.t; r.addEventListener('click', () => abre(x)); rotulos.appendChild(r);
    bolhas.push({ g, disco, aro, x, esp: i, base: g.position.y, fase: i * 2 + k, r });
  }));

  // câmera: entrada e um ponto de vista por espaço
  let atual = -1, de = new THREE.Vector3(), para = new THREE.Vector3(), olhaDe = new THREE.Vector3(), olhaPara = new THREE.Vector3(), t0 = 0, dur = 1;
  const olhar = new THREE.Vector3(), mouse = new THREE.Vector2();
  const distancia = () => { const a = cam.aspect; return a < .8 ? 25 : a < 1.2 ? 14.5 : 12.5; };
  function vista(i) { const cel = cam.aspect < .8, lado = cel ? 0 : -2.4; return i < 0 ? [new THREE.Vector3(ENTRADA.x + (cel ? 0 : 2.4), cel ? 1.4 : 2.4, cel ? 19 : 11), new THREE.Vector3(ENTRADA.x + (cel ? 0 : 2.4), cel ? .2 : 2.4, 0)] : [new THREE.Vector3(i * PASSO + lado, cel ? 6 : 4.6, distancia()), new THREE.Vector3(i * PASSO + lado * .9, cel ? 2.6 : 1.7, 0)]; }
  function vai(i, rapido) {
    i = Math.max(-1, Math.min(ESPACOS.length - 1, i)); if (i === atual && !rapido) return;
    const [p, o] = vista(i); de.copy(cam.position); olhaDe.copy(olhar); para.copy(p); olhaPara.copy(o); t0 = performance.now(); dur = rapido ? 1 : Math.min(2600, 1300 + Math.abs(i - atual) * 450); atual = i;
    sec.dataset.espaco = i; atualizaTexto();
    videos.forEach(({ v, esp }) => { if (esp === i) { if (!v.src) v.src = v.dataset.src; const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); } else if (!v.paused) v.pause(); });
    bolhas.forEach((b) => { if (b.x.vt && b.esp === i) b.disco.material.map = b.x.vt; });
  }
  const suave = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // textos e navegação em HTML
  const tit = sec.querySelector('.ps-tit'), txt = sec.querySelector('.ps-txt'), nome = sec.querySelector('.ps-nome'), abas = sec.querySelector('.ps-abas'), fimBt = sec.querySelector('.ps-fim');
  abas.innerHTML = ESPACOS.map((e, i) => `<button type="button" data-i="${i}">${e.nome}</button>`).join('');
  function atualizaTexto() {
    const E = ESPACOS[atual];
    sec.classList.toggle('dentro', atual >= 0);
    [...abas.children].forEach((b, i) => b.setAttribute('aria-current', i === atual ? 'step' : 'false'));
    if (!E) return;
    const caixaTxt = sec.querySelector('.ps-texto'); caixaTxt.classList.remove('troca'); void caixaTxt.offsetWidth; caixaTxt.classList.add('troca');
    nome.textContent = (atual + 1) + ' / ' + ESPACOS.length + ' · ' + E.nome; tit.textContent = E.tit; txt.textContent = E.txt; fimBt.hidden = !E.fim;
  }
  abas.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) vai(+b.dataset.i); });
  sec.querySelector('.ps-entrar').addEventListener('click', () => vai(0));
  sec.querySelector('.ps-ant').addEventListener('click', () => vai(atual - 1));
  sec.querySelector('.ps-prox').addEventListener('click', () => vai(atual + 1));
  sec.addEventListener('keydown', (e) => { if (e.target.closest('dialog')) return; if (e.key === 'ArrowRight') vai(atual + 1); if (e.key === 'ArrowLeft') vai(atual - 1); });

  // ficha do tratamento
  const ficha = sec.querySelector('.ps-ficha');
  function abre(x) {
    ficha.querySelector('.pf-midia').innerHTML = x.v ? `<video muted playsinline loop autoplay poster="video/${x.v}.jpg" src="video/${x.v}.mp4"></video>` : `<img src="${x.img}" alt="${x.t}">`;
    ficha.querySelector('h3').textContent = x.t; ficha.querySelector('p').textContent = x.d;
    const ag = ficha.querySelector('.pf-agendar'), mais = ficha.querySelector('.pf-mais');
    ag.href = 'agendar.html' + (x.ag ? '?t=' + x.ag : ''); mais.href = x.link || (x.id ? 'tratamentos.html#' + x.id : 'tratamentos.html'); mais.textContent = x.link ? 'Conhecer a clínica' : 'Ver detalhes';
    ficha.showModal();
  }
  ficha.addEventListener('click', (e) => { if (e.target === ficha || e.target.closest('.pf-fecha')) ficha.close(); });
  ficha.addEventListener('close', () => { ficha.querySelector('.pf-midia').innerHTML = ''; });

  // toque e arraste: tocar numa bolha abre a ficha; arrastar para o lado troca de espaço
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let x0 = null, y0 = 0, arrastou = false;
  canvas.addEventListener('pointerdown', (e) => { x0 = e.clientX; y0 = e.clientY; arrastou = false; });
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect(); mouse.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    if (x0 !== null && Math.abs(e.clientX - x0) > 12) arrastou = true;
    ptr.copy(mouse); ray.setFromCamera(ptr, cam); canvas.style.cursor = ray.intersectObjects(bolhas.map((b) => b.disco)).length || (atual < 0 && ray.intersectObject(bolhaG).length) ? 'pointer' : '';
  });
  canvas.addEventListener('pointerup', (e) => {
    const dx = e.clientX - (x0 ?? e.clientX), dy = e.clientY - y0; x0 = null;
    if (arrastou && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { vai(atual + (dx < 0 ? 1 : -1)); return; }
    const r = canvas.getBoundingClientRect(); ptr.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ptr, cam);
    const h = ray.intersectObjects(bolhas.map((b) => b.disco))[0]; if (h) { abre(h.object.userData.item); return; }
    if (atual < 0 && ray.intersectObject(bolhaG).length) vai(0);
  });

  function tamanho() { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); vai(atual, true); }
  addEventListener('resize', tamanho);
  cam.position.copy(vista(-1)[0]); olhar.copy(vista(-1)[1]); tamanho();

  let visivel = true; new IntersectionObserver((es) => { visivel = es[0].isIntersecting; }).observe(sec);
  const v3 = new THREE.Vector3(), relogio = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!visivel || document.hidden) return;
    const t = relogio.getElapsedTime(), k = suave(Math.min(1, (performance.now() - t0) / dur));
    cam.position.lerpVectors(de, para, k); cam.position.y += Math.sin(k * Math.PI) * 1.4; olhar.lerpVectors(olhaDe, olhaPara, k);
    cam.position.x += mouse.x * .35; cam.position.y += mouse.y * .2;
    cam.lookAt(olhar);
    sol.position.set(olhar.x + 6, 11, 8); sol.target.position.copy(olhar);
    grande.rotation.y = Math.sin(t * .4) * .25; simb.position.y = Math.sin(t * .9) * .08; grande.position.y = ENTRADA.y + Math.sin(t * .7) * .12;
    cena.traverse((o) => { if (o.userData.gira) { o.rotation.y += o.userData.gira * .01; o.rotation.x += o.userData.gira * .004; } });
    const w = canvas.clientWidth, h = canvas.clientHeight;
    bolhas.forEach((b) => {
      b.g.position.y = b.base + Math.sin(t * .9 + b.fase) * .12; b.disco.lookAt(cam.position); b.aro.lookAt(cam.position);
      v3.set(b.g.position.x, b.g.position.y - 1.05, b.g.position.z).project(cam);
      const vis = b.esp === atual && v3.z < 1; b.r.style.transform = `translate(${Math.min(w - b.r.offsetWidth / 2 - 8, Math.max(b.r.offsetWidth / 2 + 8, (v3.x + 1) / 2 * w)).toFixed(1)}px, ${((1 - v3.y) / 2 * h).toFixed(1)}px) translate(-50%, 0)`; b.r.classList.toggle('mostra', vis && k > .85); b.r.tabIndex = vis ? 0 : -1;
    });
    renderer.render(cena, cam);
  });
  sec.classList.add('pronto');
}

import * as THREE from 'three';
import { GLTFLoader } from '../vendor/three/addons/loaders/GLTFLoader.js';

/** Un escenario compartido. Se dibuja solo al cargar, redimensionar o mover la cámara. */
export async function createScene(host, content) {
  const compact = matchMedia('(max-width: 760px)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, compact ? 1.25 : 1.75));
  renderer.shadowMap.enabled = !compact;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-9, 9, 9, -9, 0.1, 100);
  const lookAt = new THREE.Vector3();
  const pose = { x: 8, y: 8, z: 13, tx: -1.5, ty: 1.1, tz: 0, span: 16, progress: 0 };
  let active = true;
  let disposed = false;
  let tween;
  const material = (color, extras = {}) => {
    const result = new THREE.MeshStandardMaterial({ color, roughness: 0.75, ...extras });
    return result;
  };
  const stone = material('#a8b9aa');
  const edge = material('#203c31', { metalness: 0.25 });
  const grass = material('#175338');
  const paving = material('#ced8c6');
  const lime = material('#2ad660', { emissive: '#2ad660', emissiveIntensity: 0.5 });

  function box(w, h, d, mat, x, y, z) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }
  scene.add(new THREE.HemisphereLight('#e8fff0', '#314137', 2.2));
  const sun = new THREE.DirectionalLight('#fff1d2', 4);
  sun.position.set(-4, 12, 8);
  sun.castShadow = !compact;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 10, bottom: -10, near: 0.5, far: 35 });
  sun.shadow.bias = -0.001;
  sun.shadow.normalBias = 0.035;
  scene.add(sun);
  const rim = new THREE.DirectionalLight('#80eeb3', 2);
  rim.position.set(7, 6, -7);
  scene.add(rim);

  // Dos islas, enlazadas por un puente: una metáfora de la alianza.
  for (const x of [-3.8, 3.8]) {
    box(5.9, 0.55, 6, edge, x, -0.4, 0);
    box(5.7, 0.16, 5.8, stone, x, -0.045, 0);
    box(5.3, 0.06, 5.4, grass, x, 0.06, 0);
    box(4.3, 0.09, 3.3, paving, x, 0.11, -0.45);
    box(0.045, 0.04, 5.6, lime, x - 2.8, 0.07, 0);
  }
  box(3.3, 0.18, 1.4, paving, 0, 0.03, 1.1);
  box(3.4, 0.04, 0.045, lime, 0, 0.14, 0.48);
  box(3.4, 0.04, 0.045, lime, 0, 0.14, 1.72);
  for (const x of [-3.8, 3.8]) box(0.9, 0.05, 2.6, paving, x, 0.15, 1.35);
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.8, 0.23, 0.3), new THREE.Vector3(-3.8, 0.23, 1.1),
    new THREE.Vector3(0, 0.23, 1.1), new THREE.Vector3(3.8, 0.23, 1.1), new THREE.Vector3(3.8, 0.23, 0.3)
  ]);
  const thread = new THREE.Mesh(new THREE.TubeGeometry(path, 64, 0.025, 6, false), lime);
  scene.add(thread);
  const marker = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), lime);
  scene.add(marker);

  const loader = new GLTFLoader();
  function place(original, height, x, z) {
    const model = original.clone(true);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = height / size.y;
    model.scale.setScalar(scale);
    model.position.set(x - center.x * scale, 0.17 - bounds.min.y * scale, z - center.z * scale);
    model.traverse(node => { if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; } });
    scene.add(model);
    return model;
  }
  function draw() {
    if (!active || disposed || !host.clientWidth || !host.clientHeight) return;
    const aspect = host.clientWidth / host.clientHeight;
    const span = pose.span * (aspect < 1 ? 1.1 : 1);
    camera.left = -span / 2;
    camera.right = span / 2;
    camera.top = span / (2 * aspect);
    camera.bottom = -camera.top;
    camera.position.set(pose.x, pose.y, pose.z);
    camera.lookAt(lookAt.set(pose.tx, pose.ty, pose.tz));
    camera.updateProjectionMatrix();
    marker.position.copy(path.getPoint(Math.min(1, Math.max(0, pose.progress / (content.stops.length - 1)))));
    renderer.render(scene, camera);
  }
  let resize;
  function dispose() {
    if (disposed) return;
    disposed = true;
    tween?.kill();
    resize?.disconnect();
    scene.traverse(node => {
      node.geometry?.dispose();
      const list = node.material ? (Array.isArray(node.material) ? node.material : [node.material]) : [];
      list.forEach(mat => { mat.map?.dispose(); mat.dispose(); });
    });
    renderer.dispose();
    renderer.domElement.remove();
  }
  try {
    const loaded = await Promise.all(Object.entries(content.models).map(async ([key, url]) => [key, (await loader.loadAsync(url)).scene]));
    const models = Object.fromEntries(loaded);
    place(models.campus, 2.75, -3.8, -0.55);
    place(models.firm, 4.65, 3.8, -0.65);
    // Pórtico propio: distingue la estación académica sin atribuirla a una sede real.
    box(2.4, 0.18, 0.75, paving, -3.8, 1.55, 0.85);
    for (const x of [-4.7, -4.1, -3.5, -2.9]) {
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.09, 1.25, 10), paving);
      column.position.set(x, 0.8, 1.1);
      column.castShadow = true;
      scene.add(column);
    }
    models.palm.traverse(node => {
      if (!node.isMesh) return;
      node.material = node.material.clone();
      node.material.metalness = 0;
      node.material.color.set(node.material.name.toLowerCase().includes('leaf') ? '#27814e' : '#8d7856');
    });
    [[-6, -1.9], [-5.9, 1.9], [-1.8, -2], [1.6, -1.9], [5.9, 1.9], [6, -1.7]].forEach(([x,z]) => place(models.palm, 1.65, x, z));
    host.append(renderer.domElement);
    resize = new ResizeObserver(() => {
      if (!host.clientWidth || !host.clientHeight) return;
      renderer.setSize(host.clientWidth, host.clientHeight);
      draw();
    });
    resize.observe(host);
    renderer.domElement.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      host.closest('[data-scene]').dataset.sceneState = 'fallback';
      host.closest('[data-scene]').querySelector('[data-scene-status]').textContent = 'Recorrido ilustrado';
      dispose();
    }, { once: true });
    window.addEventListener('pagehide', event => { if (!event.persisted) dispose(); }, { once: true });
    return {
      setActive(value) { active = value; if (!value) tween?.pause(); else { tween?.resume(); draw(); } },
      setProgress(value, animate) {
        if (disposed) return;
        const from = content.stops[Math.floor(value)];
        const to = content.stops[Math.min(content.stops.length - 1, Math.ceil(value))];
        const mix = value % 1;
        const interpolate = (a,b) => a + (b-a) * mix;
        const next = { x: interpolate(from.camera[0],to.camera[0]), y: interpolate(from.camera[1],to.camera[1]), z: interpolate(from.camera[2],to.camera[2]), tx: interpolate(from.target[0],to.target[0]), ty: interpolate(from.target[1],to.target[1]), tz: interpolate(from.target[2],to.target[2]), span: interpolate(from.span,to.span), progress: value };
        tween?.kill();
        if (animate && active) tween = window.gsap.to(pose, { ...next, duration: 1.5, ease: 'power2.inOut', onUpdate: draw });
        else { Object.assign(pose, next); draw(); }
      }
    };
  } catch (error) { dispose(); throw error; }
}

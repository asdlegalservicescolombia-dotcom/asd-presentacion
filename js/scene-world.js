import * as THREE from 'three';
import { GLTFLoader } from '../vendor/three/addons/loaders/GLTFLoader.js';
import { sceneContent } from '../data/scene.js';
import { worldContent } from '../data/chapters.js';
import { buildWorld } from './scene-worlds.js';

/** Un solo contexto WebGL para todos los capítulos, sin renderizado permanente. */
export async function createScene(onFailure) {
  const compact = matchMedia('(max-width: 760px)').matches;
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, compact ? 1.25 : 1.75));
  renderer.shadowMap.enabled = !compact;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-10, 10, 8, -8, 0.1, 100);
  const pose = {
    angle: 0.6,
    height: 10,
    tx: 0,
    ty: 1,
    tz: 0,
    span: 19,
    progress: 0,
    entry: 0,
  };
  const worlds = new Map();
  const look = new THREE.Vector3();
  let host,
    world,
    chapter,
    config,
    tween,
    resize,
    active = true,
    disposed = false;
  scene.add(new THREE.HemisphereLight('#e8fff0', '#2c4033', 2.1));
  const sun = new THREE.DirectionalLight('#fff2d5', 3.7);
  sun.position.set(-4, 12, 8);
  sun.castShadow = !compact;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {
    left: -14,
    right: 14,
    top: 12,
    bottom: -12,
    near: 0.5,
    far: 40,
  });
  sun.shadow.bias = -0.001;
  sun.shadow.normalBias = 0.035;
  scene.add(sun);
  const rim = new THREE.DirectionalLight('#8bffbf', 2);
  rim.position.set(7, 6, -7);
  scene.add(rim);
  const loader = new GLTFLoader();
  const results = await Promise.allSettled(
    Object.entries(sceneContent.models).map(async ([key, url]) => [
      key,
      (await loader.loadAsync(url)).scene,
    ]),
  );
  const models = Object.fromEntries(
    results.filter((r) => r.status === 'fulfilled').map((r) => r.value),
  );
  function dispose() {
    if (disposed) return;
    disposed = true;
    tween?.kill();
    resize?.disconnect();
    const geometries = new Set(),
      materials = new Set(),
      textures = new Set();
    const collect = (node) => {
      if (node.geometry) geometries.add(node.geometry);
      (Array.isArray(node.material)
        ? node.material
        : node.material
          ? [node.material]
          : []
      ).forEach((m) => {
        materials.add(m);
        if (m.map) textures.add(m.map);
      });
    };
    scene.traverse(collect);
    Object.values(models).forEach((model) => model.traverse(collect));
    geometries.forEach((g) => g.dispose());
    textures.forEach((t) => t.dispose());
    materials.forEach((m) => m.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  }
  const failed = results.find((result) => result.status === 'rejected');
  if (failed) {
    dispose();
    throw failed.reason;
  }
  models.palm.traverse((node) => {
    if (node.isMesh) {
      node.material.metalness = 0;
      node.material.color.set(
        node.material.name.toLowerCase().includes('leaf')
          ? '#27814e'
          : '#8d7856',
      );
    }
  });
  function draw() {
    if (
      !active ||
      disposed ||
      !host?.clientWidth ||
      !host?.clientHeight ||
      !world
    )
      return;
    const aspect = host.clientWidth / host.clientHeight;
    // Conservar el objeto completo también en lienzos anchos y de poca altura.
    const span = Math.max(pose.span, aspect * 10.5);
    camera.left = -span / 2;
    camera.right = span / 2;
    camera.top = span / (2 * aspect);
    camera.bottom = -camera.top;
    camera.position.set(
      Math.sin(pose.angle) * 17,
      pose.height,
      Math.cos(pose.angle) * 17,
    );
    camera.lookAt(look.set(pose.tx, pose.ty, pose.tz));
    camera.updateProjectionMatrix();
    world.root.position.y = pose.entry;
    world.update(pose.progress);
    renderer.render(scene, camera);
  }
  const resizeToHost = () => {
    if (!host?.clientWidth || !host?.clientHeight) return;
    renderer.setSize(host.clientWidth, host.clientHeight);
    draw();
  };
  resize = new ResizeObserver(resizeToHost);
  renderer.domElement.addEventListener(
    'webglcontextlost',
    (event) => {
      event.preventDefault();
      dispose();
      onFailure(new Error('Contexto gráfico no disponible'));
    },
    { once: true },
  );
  window.addEventListener(
    'pagehide',
    (event) => {
      if (!event.persisted) dispose();
    },
    { once: true },
  );
  function progress(value, animate) {
    if (disposed || !chapter) return;
    const total = chapter.groups.length
      ? chapter.groups.find(
          (g) => value >= g.start && value < g.start + g.length,
        )?.length || 4
      : chapter.stops.length;
    const group = chapter.groups.find(
      (g) => value >= g.start && value < g.start + g.length,
    );
    const local = value - (group?.start || 0);
    const fraction = total > 1 ? local / (total - 1) : 0.5;
    const next = {
      angle: 0.35 + fraction * 0.5,
      height: chapter.type === 'profile' ? 12 : 10,
      tx: config.target[0] + (fraction - 0.5) * 0.65,
      ty: config.target[1],
      tz: config.target[2],
      span: config.span,
      progress: local,
      entry: 0,
    };
    tween?.kill();
    if (animate && active)
      tween = window.gsap.to(pose, {
        ...next,
        duration: 1.25,
        ease: 'power2.inOut',
        onUpdate: draw,
      });
    else {
      Object.assign(pose, next);
      draw();
    }
  }
  return {
    attach(target, definition, audience, value, animate) {
      if (disposed) return;
      tween?.kill();
      if (host) resize.unobserve(host);
      host = target;
      chapter = definition;
      config = worldContent[chapter.type] || worldContent.hero;
      const key = `${chapter.id}:${audience}`;
      if (!worlds.has(key)) {
        const count = chapter.groups[audience]?.length || chapter.stops.length;
        const created = buildWorld(chapter.type, models, count, audience);
        worlds.set(key, created);
        scene.add(created.root);
      }
      worlds.forEach((item) => {
        item.root.visible = false;
      });
      world = worlds.get(key);
      world.root.visible = true;
      host.append(renderer.domElement);
      resize.observe(host);
      resizeToHost();
      pose.entry = animate ? -0.45 : 0;
      progress(value, animate);
    },
    setProgress: progress,
    setActive(value) {
      active = value;
      if (value) {
        tween?.resume();
        draw();
      } else tween?.pause();
    },
    dispose,
  };
}

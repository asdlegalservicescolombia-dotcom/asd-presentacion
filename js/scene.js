import { sceneContent } from '../data/scene.js';

/** La presentación y sus controles siguen funcionando si falla WebGL o un modelo. */
export function initScene() {
  const root = document.querySelector('[data-scene]');
  if (!root) return;
  const buttons = [...root.querySelectorAll('[data-scene-stop]')];
  const slider = root.querySelector('[data-scene-progress]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let engine;
  let position = 0;
  let lastStop = -1;
  let loading = false;
  let active = false;

  function select(value, animate = true) {
    position = Math.max(0, Math.min(sceneContent.stops.length - 1, value));
    const index = Math.round(position);
    const stop = sceneContent.stops[index];
    slider.value = position;
    slider.setAttribute('aria-valuetext', stop.label);
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    if (lastStop !== index) {
      root.querySelector('[data-scene-title]').textContent = stop.title;
      root.querySelector('[data-scene-body]').textContent = stop.body;
      root.querySelector('[data-scene-count]').textContent = `${String(index + 1).padStart(2, '0')} / ${String(sceneContent.stops.length).padStart(2, '0')}`;
      lastStop = index;
    }
    engine?.setProgress(position, animate && !motion.matches);
  }
  buttons.forEach((button, i) => button.addEventListener('click', () => select(i)));
  slider.addEventListener('input', () => select(Number(slider.value), false));
  // Las flechas operan el recorrido cuando el foco está dentro de sus controles.
  root.addEventListener('keydown', event => {
    if (event.target === slider) return;
    const direction = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!direction) return;
    event.preventDefault();
    const next = Math.max(0, Math.min(buttons.length - 1, Math.round(position) + direction));
    select(next);
    buttons[next].focus();
  });
  motion.addEventListener('change', () => select(position, false));

  async function load() {
    if (loading || engine) return;
    loading = true;
    try {
      if (!window.gsap) await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = new URL('../vendor/gsap/gsap.min.js', import.meta.url).href;
        script.onload = resolve;
        script.onerror = () => reject(new Error('No se pudo cargar la animación'));
        document.head.append(script);
      });
      const { createScene } = await import('./scene-world.js');
      engine = await createScene(root.querySelector('[data-scene-canvas]'), sceneContent);
      root.dataset.sceneState = 'ready';
      root.querySelector('[data-scene-status]').textContent = 'Recorrido interactivo';
      engine.setActive(active && !document.hidden);
      select(position, false);
    } catch (error) {
      root.dataset.sceneState = 'fallback';
      root.querySelector('[data-scene-status]').textContent = 'Recorrido ilustrado';
      console.warn('Escenario 3D no disponible; se conserva el recorrido y su imagen.', error.message);
    }
  }
  const observer = new IntersectionObserver(entries => {
    active = entries[0].isIntersecting;
    engine?.setActive(active && !document.hidden);
    if (active) load();
  }, { threshold: 0.05 });
  observer.observe(root);
  document.addEventListener('visibilitychange', () => engine?.setActive(active && !document.hidden));
  select(0, false);
}

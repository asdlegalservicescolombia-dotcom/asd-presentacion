import { buildChapter, groupIndices } from '../data/chapters.js';
import { escapeHTML, stopPanel } from './render.js';

/** Dirección del recorrido: HTML accesible y un único motor compartido. */
export function initScene(data) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const states = data.sections.map((section) => ({
    section,
    chapter: buildChapter(section),
    root: document.querySelector(`[data-scene="${section.id}"]`),
    group: 0,
    position: 0,
    lastIndex: -1,
    visible: false,
    wantsPlayback: false,
  }));
  let current,
    engine,
    loading,
    failed = false,
    timer = null;
  function suspendPlayback() {
    clearInterval(timer);
    timer = null;
    states.forEach((s) => {
      const button = s.root.querySelector('[data-scene-play]');
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', 'Reproducir recorrido');
      button.innerHTML = '▷ <span>Recorrer</span>';
    });
  }
  function stopPlayback() {
    if (current) current.wantsPlayback = false;
    suspendPlayback();
  }
  function startPlayback(state) {
    if (
      timer ||
      state !== current ||
      !state.wantsPlayback ||
      !state.visible ||
      document.hidden ||
      !engine ||
      failed
    )
      return;
    const button = state.root.querySelector('[data-scene-play]');
    button.setAttribute('aria-pressed', 'true');
    button.setAttribute('aria-label', 'Pausar recorrido');
    button.innerHTML = 'Ⅱ <span>Pausar</span>';
    timer = setInterval(() => {
      const ids = groupIndices(state.chapter, state.group);
      const next = Math.round(state.position) + 1;
      select(state, next > ids.at(-1) ? ids[0] : next);
    }, 6500);
  }
  function fallback(error) {
    stopPlayback();
    failed = true;
    engine?.dispose();
    states.forEach((s) => {
      s.root.dataset.sceneState = 'fallback';
      s.root.querySelector('[data-scene-status]').textContent =
        'Vista conceptual';
    });
    console.warn(
      'Se mantiene el recorrido accesible sin WebGL:',
      error.message,
    );
  }
  function renderControls(state) {
    const ids = groupIndices(state.chapter, state.group);
    state.root.querySelector('[data-scene-controls]').innerHTML = ids
      .map(
        (index, i) =>
          `<button data-scene-stop="${index}" aria-pressed="false"><span>${String(i + 1).padStart(2, '0')}</span>${escapeHTML(state.chapter.stops[index].label)}</button>`,
      )
      .join('');
    const slider = state.root.querySelector('[data-scene-progress]');
    slider.min = ids[0];
    slider.max = ids.at(-1);
    state.root
      .querySelectorAll('[data-scene-group]')
      .forEach((button, i) =>
        button.setAttribute('aria-pressed', String(i === state.group)),
      );
  }
  function select(state, value, animate = true) {
    const ids = groupIndices(state.chapter, state.group);
    state.position = Math.min(ids.at(-1), Math.max(ids[0], value));
    const index = Math.round(state.position),
      stop = state.chapter.stops[index];
    const slider = state.root.querySelector('[data-scene-progress]');
    slider.value = state.position;
    slider.setAttribute('aria-valuetext', stop.label);
    state.root
      .querySelectorAll('[data-scene-stop]')
      .forEach((button) =>
        button.setAttribute(
          'aria-pressed',
          String(Number(button.dataset.sceneStop) === index),
        ),
      );
    state.root.querySelector('[data-scene-count]').textContent =
      `${String(index - ids[0] + 1).padStart(2, '0')} / ${String(ids.length).padStart(2, '0')}`;
    if (state.lastIndex !== index) {
      const panel = state.root.querySelector('[data-scene-copy]');
      panel.innerHTML = stopPanel(stop, state.section, data);
      state.lastIndex = index;
      if (animate && !motion.matches)
        panel.animate(
          [
            { opacity: 0.35, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 360, easing: 'ease-out' },
        );
    }
    if (current === state)
      engine?.setProgress(state.position, animate && !motion.matches);
  }
  async function load() {
    if (failed) return;
    if (engine) return;
    if (!loading)
      loading = (async () => {
        if (!window.gsap)
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = new URL(
              '../vendor/gsap/gsap.min.js',
              import.meta.url,
            ).href;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Animación no disponible'));
            document.head.append(script);
          });
        const { createScene } = await import('./scene-world.js');
        engine = await createScene(fallback);
      })();
    try {
      await loading;
    } catch (error) {
      if (!failed) fallback(error);
    }
  }
  function attach(state, animate) {
    if (!engine || failed || state !== current) return;
    state.root.dataset.sceneState = 'ready';
    state.root.querySelector('[data-scene-status]').textContent =
      'Recorrido interactivo';
    engine.setActive(!document.hidden);
    engine.attach(
      state.root.querySelector('[data-scene-canvas]'),
      state.chapter,
      state.group,
      state.position,
      animate && !motion.matches,
    );
  }
  states.forEach((state) => {
    renderControls(state);
    select(state, 0, false);
    state.root.addEventListener('click', (event) => {
      const step = event.target.closest('[data-scene-stop]'),
        group = event.target.closest('[data-scene-group]'),
        play = event.target.closest('[data-scene-play]');
      if (step) {
        stopPlayback();
        select(state, Number(step.dataset.sceneStop));
      }
      if (group) {
        const wasPlaying = state.wantsPlayback;
        stopPlayback();
        state.group = Number(group.dataset.sceneGroup);
        renderControls(state);
        select(state, groupIndices(state.chapter, state.group)[0], false);
        attach(state, true);
        state.wantsPlayback = wasPlaying;
        startPlayback(state);
      }
      if (play) {
        if (timer) {
          stopPlayback();
          return;
        }
        state.wantsPlayback = true;
        startPlayback(state);
      }
    });
    state.root
      .querySelector('[data-scene-progress]')
      .addEventListener('input', (event) => {
        stopPlayback();
        select(state, Number(event.target.value), false);
      });
    state.root.addEventListener('keydown', (event) => {
      if (!event.target.closest('[data-scene-controls]')) return;
      const ids = groupIndices(state.chapter, state.group);
      let index;
      if (event.key === 'ArrowRight')
        index = Math.min(ids.at(-1), Math.round(state.position) + 1);
      if (event.key === 'ArrowLeft')
        index = Math.max(ids[0], Math.round(state.position) - 1);
      if (event.key === 'Home') index = ids[0];
      if (event.key === 'End') index = ids.at(-1);
      if (index === undefined) return;
      event.preventDefault();
      stopPlayback();
      select(state, index);
      state.root.querySelector(`[data-scene-stop="${index}"]`).focus();
    });
  });
  motion.addEventListener('change', () => {
    stopPlayback();
    if (current) select(current, current.position, false);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) suspendPlayback();
    else if (current) startPlayback(current);
    engine?.setActive(!document.hidden && current?.visible);
  });
  const visibility = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const state = states.find((s) => s.root === entry.target);
        state.visible = entry.isIntersecting;
        if (state !== current) continue;
        engine?.setActive(entry.isIntersecting && !document.hidden);
        if (!entry.isIntersecting) suspendPlayback();
        else startPlayback(state);
      }
    },
    { threshold: 0.01 },
  );
  states.forEach((s) => visibility.observe(s.root));
  return {
    async show(slide) {
      stopPlayback();
      current = states.find((s) => s.section.id === slide.id.slice(6));
      if (!current) return;
      const requested = current;
      requested.wantsPlayback = !motion.matches;
      await load();
      attach(requested, true);
      startPlayback(requested);
    },
  };
}

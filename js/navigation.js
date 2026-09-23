export const boundedIndex = (index, total) => Math.max(0, Math.min(index, total - 1));
export function indexFromHash(hash, sections) {
  let id;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return 0; }
  return Math.max(0, sections.findIndex(section => section.id === id));
}

export function initNavigation(sections, onChange) {
  let current = -1;
  const slides = [...document.querySelectorAll('.slide')];
  const links = [...document.querySelectorAll('.chapter-link')];
  const previous = document.querySelector('#previous');
  const next = document.querySelector('#next');
  const count = document.querySelector('#page-count');
  function show(index, { historyMode = 'push', focus = true, automatic = false, force = false } = {}) {
    index = boundedIndex(index, sections.length);
    if (index === current && !force) return;
    current = index;
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    links.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    previous.disabled = index === 0;
    next.disabled = index === sections.length - 1;
    count.innerHTML = `<strong>${String(index + 1).padStart(2, '0')}</strong><span> / ${String(sections.length).padStart(2, '0')}</span>`;
    document.querySelector('#progress-bar').style.width = `${((index + 1) / sections.length) * 100}%`;
    const hash = `#${sections[index].id}`;
    if (historyMode !== 'none' && location.hash !== hash) history[historyMode === 'replace' ? 'replaceState' : 'pushState'](null, '', hash);
    document.title = `${sections[index].label} · ASD Servicios Legales`;
    document.querySelector('#presentation').scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (focus) slides[index].querySelector('h1')?.focus({ preventScroll: true });
    links[index].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    onChange?.(slides[index], { automatic });
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const index = sections.findIndex(s => `#${s.id}` === link.getAttribute('href'));
    if (index < 0) return;
    event.preventDefault();
    show(index);
  });
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || document.querySelector('dialog[open]') || event.target.closest('input, textarea, select, [contenteditable], [role="tablist"], summary')) return;
    const actions = { ArrowRight: current + 1, PageDown: current + 1, ArrowLeft: current - 1, PageUp: current - 1, Home: 0, End: sections.length - 1 };
    if (event.key in actions) { event.preventDefault(); show(actions[event.key]); }
  });
  const restore = () => show(indexFromHash(location.hash, sections), { historyMode: 'none' });
  window.addEventListener('popstate', restore);
  window.addEventListener('hashchange', restore);
  show(indexFromHash(location.hash, sections), { historyMode: 'replace', focus: false });
  // Un enlace profundo puede activar el desplazamiento nativo después de renderizar.
  window.addEventListener('load', () => window.scrollTo({ top: 0, behavior: 'instant' }), { once: true });
  return { show, get current() { return current; } };
}

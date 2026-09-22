import { benefitsPanel, timelinePanel } from './render.js';
import { buildPrompt } from '../data/content.js';

function bindTabs(section, selector, update) {
  const tabs = [...section.querySelectorAll(selector)];
  const activate = index => {
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    update(index, tabs[index]);
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target === undefined) return;
      event.preventDefault(); event.stopPropagation();
      activate(target); tabs[target].focus();
    });
  });
}

export function initInteractions(data) {
  data.sections.forEach(s => {
    const section = document.getElementById(s.id);
    if (s.type === 'benefits') bindTabs(section, '[data-audience]', (i, tab) => {
      const panel = section.querySelector('[role="tabpanel"]');
      panel.innerHTML = benefitsPanel(s.audiences[i]); panel.setAttribute('aria-labelledby', tab.id);
    });
    if (s.type === 'timeline') bindTabs(section, '[data-step]', (i, tab) => {
      const panel = section.querySelector('[role="tabpanel"]');
      panel.innerHTML = timelinePanel(s.steps[i], i); panel.setAttribute('aria-labelledby', tab.id);
    });
  });
  const fullscreen = document.querySelector('#fullscreen-button');
  const status = document.querySelector('#app-status');
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else status.textContent = 'Este navegador no permite pantalla completa. Usa las opciones de pantalla de tu navegador.';
    } catch { status.textContent = 'No se pudo activar pantalla completa. Puedes seguir explorando la presentación.'; }
  };
  fullscreen.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => fullscreen.setAttribute('aria-label', document.fullscreenElement ? 'Salir de pantalla completa' : 'Activar pantalla completa'));
  document.addEventListener('keydown', event => {
    if (event.key.toLowerCase() !== 'f' || event.ctrlKey || event.metaKey || event.altKey || document.querySelector('dialog[open]') || event.target.closest('input, textarea, select, [contenteditable]')) return;
    event.preventDefault(); toggleFullscreen();
  });
  document.querySelector('#help-button').addEventListener('click', () => document.querySelector('#help-dialog').showModal());
  const dialog = document.querySelector('#prompt-dialog');
  const format = document.querySelector('#prompt-format');
  const output = document.querySelector('#prompt-output');
  const copyStatus = document.querySelector('#copy-status');
  const updatePrompt = () => { output.value = buildPrompt(format.value); copyStatus.textContent = ''; };
  document.querySelectorAll('[data-open-prompt]').forEach(button => button.addEventListener('click', () => { updatePrompt(); dialog.showModal(); }));
  format.addEventListener('change', updatePrompt);
  document.querySelector('#copy-prompt').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(output.value); copyStatus.textContent = 'Instrucción copiada. Lista para pegar.'; }
    catch { output.focus(); output.select(); copyStatus.textContent = 'Seleccionamos el texto. Usa Ctrl+C o la opción Copiar de tu dispositivo.'; }
  });
}

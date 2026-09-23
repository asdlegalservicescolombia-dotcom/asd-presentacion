import { buildPrompt } from '../data/content.js';

export function initInteractions(data) {
  const fullscreen = document.querySelector('#fullscreen-button');
  const status = document.querySelector('#app-status');
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen)
        await document.documentElement.requestFullscreen();
      else
        status.textContent =
          'Este navegador no permite pantalla completa. Usa las opciones de pantalla de tu navegador.';
    } catch {
      status.textContent =
        'No se pudo activar pantalla completa. Puedes seguir explorando la presentación.';
    }
  };
  fullscreen.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () =>
    fullscreen.setAttribute(
      'aria-label',
      document.fullscreenElement
        ? 'Salir de pantalla completa'
        : 'Activar pantalla completa',
    ),
  );
  document.addEventListener('keydown', (event) => {
    if (
      event.key.toLowerCase() !== 'f' ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      document.querySelector('dialog[open]') ||
      event.target.closest('input, textarea, select, [contenteditable]')
    )
      return;
    event.preventDefault();
    toggleFullscreen();
  });
  document
    .querySelector('#help-button')
    .addEventListener('click', () =>
      document.querySelector('#help-dialog').showModal(),
    );
  const dialog = document.querySelector('#prompt-dialog');
  const format = document.querySelector('#prompt-format');
  const output = document.querySelector('#prompt-output');
  const copyStatus = document.querySelector('#copy-status');
  const updatePrompt = () => {
    output.value = buildPrompt(format.value);
    copyStatus.textContent = '';
  };
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-open-prompt]')) {
      updatePrompt();
      dialog.showModal();
    }
  });
  format.addEventListener('change', updatePrompt);
  document.querySelector('#copy-prompt').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output.value);
      copyStatus.textContent = 'Instrucción copiada. Lista para pegar.';
    } catch {
      output.focus();
      output.select();
      copyStatus.textContent =
        'Seleccionamos el texto. Usa Ctrl+C o la opción Copiar de tu dispositivo.';
    }
  });
}

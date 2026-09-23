// Este script clásico puede explicar la apertura local aun cuando los módulos
// estén bloqueados por el navegador al usar file://.
if (location.protocol === 'file:') {
  document.querySelector('#presentation').innerHTML = `
    <section class="startup-message">
      <p class="eyebrow">ABRIR LA PRESENTACIÓN</p>
      <h1>Inicia la experiencia con un doble clic.</h1>
      <p>Cierra esta pestaña y abre <strong>Abrir-presentacion.cmd</strong>
      en la misma carpeta. Se iniciará el servidor y se abrirá la presentación en tu navegador.</p>
      <p>Si ya lo iniciaste, usa el siguiente botón.</p>
      <a class="button primary" href="http://127.0.0.1:4173/asd-presentacion/">Abrir presentación ↗</a>
    </section>`;
  document.querySelectorAll('button').forEach((button) => {
    button.disabled = true;
  });
}

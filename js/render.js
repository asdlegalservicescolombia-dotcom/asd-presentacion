import { buildChapter, worldContent } from '../data/chapters.js';
/** Renderizadores pequeños por tipo de capítulo. El contenido se trata siempre como texto. */
export const escapeHTML = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ],
  );
const lines = (text) => escapeHTML(text).replace(/\n/g, '<br>');
export function stopPanel(stop, section, data) {
  return `${stop.summary ? `<p class="experience-kicker">${escapeHTML(stop.summary)}</p>` : ''}
    <h2>${escapeHTML(stop.title)}</h2><p class="experience-text">${escapeHTML(stop.body)}</p>
    ${stop.items?.length ? `<ul class="experience-list">${stop.items.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>` : ''}
    ${stop.takeaway ? `<div class="experience-takeaway"><span>${section.type === 'timeline' ? 'RESULTADO ESPERADO' : 'PROPÓSITO COMPARTIDO'}</span><p>${escapeHTML(stop.takeaway)}</p></div>` : ''}
    ${section.type === 'hero' ? `<a class="button primary experience-cta" href="#${escapeHTML(section.ctaTarget)}">${escapeHTML(section.cta)} ↗</a>` : ''}
    ${section.type === 'closing' ? `<div class="experience-actions"><a class="button primary" href="mailto:${escapeHTML(data.contact.email)}?subject=${encodeURIComponent('Alianza formativa · ASD Servicios Legales')}">${escapeHTML(section.cta)} ↗</a><button class="button secondary" data-open-prompt>Preparar una propuesta ＋</button><a class="experience-contact" href="${escapeHTML(data.contact.website)}" target="_blank" rel="noopener noreferrer">asdservicioslegales.co ↗</a></div>` : ''}`;
}

export function immersiveSection(section, index, data) {
  const chapter = buildChapter(section);
  const mentoring = data.sections.find((s) => s.image)?.image;
  const world = worldContent[section.type] || worldContent.hero;
  return `<section class="slide immersive-slide" id="slide-${escapeHTML(section.id)}" aria-label="${escapeHTML(section.label)}" ${index ? 'hidden' : ''}>
    <div class="experience" data-scene="${escapeHTML(section.id)}" data-scene-state="loading">
      <div class="experience-top"><span><i></i> ${escapeHTML(world.name)}</span><span>CAPÍTULO ${String(index + 1).padStart(2, '0')} / ${String(data.sections.length).padStart(2, '0')}</span></div>
      <header class="experience-intro"><div><p class="eyebrow">${escapeHTML(section.eyebrow)}</p><h1 tabindex="-1">${lines(section.title)}</h1></div><p>${escapeHTML(section.description)}</p></header>
      <div class="experience-body">
        <div class="experience-visual">
          <div class="experience-fallback" aria-hidden="true"><span>${String(index + 1).padStart(2, '0')}</span><div></div><p>${escapeHTML(world.caption)}</p></div>
          <div class="experience-canvas" data-scene-canvas role="img" aria-label="${escapeHTML(world.description)}"></div>
          <div class="experience-scene-label"><span>${escapeHTML(world.caption)}</span><span data-scene-status>Cargando escena</span></div>
          ${chapter.groups.length ? `<div class="experience-audiences" role="group" aria-label="Beneficios por participante">${chapter.groups.map((g, i) => `<button data-scene-group="${i}" aria-pressed="${i === 0}">${escapeHTML(g.label)}</button>`).join('')}</div>` : ''}

        </div>
        <div class="experience-narrative">
          ${section.type === 'timeline' && mentoring ? `<figure class="mentor-inset"><img src="${escapeHTML(mentoring.src)}" alt="${escapeHTML(mentoring.alt)}" width="1344" height="752" loading="lazy"><figcaption>MENTORÍA CERCANA <small>${escapeHTML(mentoring.credit)}</small></figcaption></figure>` : ''}

          <div class="experience-copy" data-scene-copy aria-live="polite" aria-atomic="true">${stopPanel(chapter.stops[0], section, data)}</div>
        </div>
      </div>
      <div class="experience-navigation"><div class="experience-controls" role="group" aria-label="Explorar ${escapeHTML(section.label)}" data-scene-controls></div><div class="experience-transport"><button class="experience-play" data-scene-play aria-pressed="false" aria-label="Reproducir recorrido">▷ <span>Recorrer</span></button><label class="sr-only" for="progress-${escapeHTML(section.id)}">Mover el recorrido: ${escapeHTML(section.label)}</label><input type="range" min="0" max="${chapter.stops.length - 1}" step="0.01" value="0" id="progress-${escapeHTML(section.id)}" data-scene-progress><span data-scene-count>01 / ${String(chapter.stops.length).padStart(2, '0')}</span></div></div>
      <div class="experience-footnote"><span>Escenario conceptual · ASD Servicios Legales</span>${chapter.note ? `<p>${escapeHTML(chapter.note)}</p>` : ''}</div>
    </div>
  </section>`;
}

export function renderPresentation(data) {
  const main = document.querySelector('#presentation');
  main.innerHTML = data.sections
    .map((s, i) => immersiveSection(s, i, data))
    .join('');
  document.querySelector('#chapter-nav').innerHTML = data.sections
    .map(
      (s, i) =>
        `<a class="chapter-link" href="#${escapeHTML(s.id)}" ${i ? '' : 'aria-current="step"'}><span class="chapter-number">${String(i + 1).padStart(2, '0')}</span><span>${escapeHTML(s.label)}</span><span class="chapter-indicator" aria-hidden="true"></span></a>`,
    )
    .join('');
  main.querySelectorAll('img').forEach((img) => {
    const fail = () => {
      img.hidden = true;
      img.closest('figure')?.classList.add('media-unavailable');
      const label = document.createElement('p');
      label.className = 'media-fallback';
      label.textContent = img.alt;
      img.after(label);
    };
    img.addEventListener('error', fail, { once: true });
    if (img.complete && !img.naturalWidth) fail();
  });
}

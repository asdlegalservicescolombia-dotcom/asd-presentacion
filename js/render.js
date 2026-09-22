import { sceneContent } from '../data/scene.js';
/** Renderizadores pequeños por tipo de capítulo. El contenido se trata siempre como texto. */
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const lines = text => escapeHTML(text).replace(/\n/g, '<br>');
const paths = {
  people: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m3 10v-3a6 6 0 0 0-3-5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  spark: '<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z"/>',
  building: '<path d="m3 8 9-5 9 5H3Zm2 3v8m7-8v8m7-8v8M3 22h18"/>'
};
export const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">${paths[name] || paths.spark}</svg>`;
const heading = s => `<div class="section-heading"><p class="eyebrow">${escapeHTML(s.eyebrow)}</p><h1 tabindex="-1">${lines(s.title)}</h1><p class="section-description">${escapeHTML(s.description)}</p></div>`;

function sceneMarkup(image) {
  return `<div class="journey" data-scene data-scene-state="loading" role="region" aria-label="${escapeHTML(sceneContent.label)}">
    <div class="journey-top"><span><i></i> EXPLORA LA ALIANZA</span><span data-scene-count>01 / 03</span></div>
    <div class="journey-view">
      <img class="journey-fallback" src="${escapeHTML(image.src)}" alt="${escapeHTML(image.alt)}" width="1344" height="752">
      <span class="journey-image-credit">Imagen ilustrativa · Higgsfield</span>
      <div class="journey-canvas" data-scene-canvas role="img" aria-label="Dos islas arquitectónicas con una universidad, una firma y un puente verde que las conecta."></div>
      <div class="journey-place"><span>ACADEMIA</span><span>ASD</span></div>
    </div>
    <div class="journey-caption" aria-live="polite" aria-atomic="true"><h2 data-scene-title></h2><p data-scene-body></p></div>
    <div class="journey-controls" role="group" aria-label="Puntos del recorrido">${sceneContent.stops.map((stop,i) => `<button data-scene-stop="${i}" aria-pressed="${i===0}"><span>0${i+1}</span>${escapeHTML(stop.label)}</button>`).join('')}</div>
    <label class="sr-only" for="journey-progress">Mover la cámara por el recorrido</label><input id="journey-progress" data-scene-progress class="journey-progress" type="range" min="0" max="${sceneContent.stops.length-1}" step="0.01" value="0">
    <div class="journey-note"><span data-scene-status>Cargando escenario…</span><span>${escapeHTML(sceneContent.note)}</span></div>
  </div>`;
}

export function benefitsPanel(audience) {
  return `<h2 class="audience-heading">${escapeHTML(audience.heading)}</h2><div class="benefit-grid">${audience.items.map((item, i) => `<details class="benefit-card"><summary><span class="card-top">${icon(item.icon)}<span class="card-index">0${i + 1}</span></span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.summary)}</p><span class="detail-label">Explorar beneficio <span class="expand-icon">+</span></span></summary><p class="benefit-detail">${escapeHTML(item.detail)}</p></details>`).join('')}</div>`;
}

export function timelinePanel(step, index) {
  return `<div class="step-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</div><div class="step-content"><p class="eyebrow">${escapeHTML(step.label)}</p><h2>${escapeHTML(step.title)}</h2><p>${escapeHTML(step.body)}</p><ul class="activity-list">${step.activities.map(a => `<li>${escapeHTML(a)}</li>`).join('')}</ul><div class="deliverable"><span>RESULTADO ESPERADO</span><strong>${escapeHTML(step.deliverable)}</strong></div></div>`;
}

const renderers = {
  hero: s => `<div class="hero-copy"><p class="eyebrow"><span class="short-line"></span>${escapeHTML(s.eyebrow)}</p><h1 tabindex="-1">${s.title.split('\n').map(line => `<span class="${line === s.accent ? 'accent' : ''}">${escapeHTML(line)}</span>`).join('')}</h1><p class="hero-description">${escapeHTML(s.description)}</p><a class="button primary" href="#${escapeHTML(s.ctaTarget)}">${escapeHTML(s.cta)} <span>↗</span></a><div class="hero-tags">${s.tags.map(t => `<span>${escapeHTML(t)}</span>`).join('')}</div><p class="hero-note">${escapeHTML(s.note)}</p></div>${sceneMarkup(s.image)}`,
  ecosystem: s => `${heading(s)}<div class="ecosystem">${s.nodes.map((n, i) => `<article class="ecosystem-node"><span class="node-number">0${i + 1}</span><p class="eyebrow">${escapeHTML(n.subtitle)}</p><h2>${escapeHTML(n.title)}</h2><ul>${n.items.map(t => `<li>${escapeHTML(t)}</li>`).join('')}</ul></article>${i === 0 ? '<div class="exchange" aria-label="Intercambio recíproco">⇄</div>' : ''}`).join('')}</div><div class="outcome"><span class="outcome-line"></span><p>${escapeHTML(s.outcome)}</p><div>${s.pillars.map(p => `<span>${escapeHTML(p)}</span>`).join('')}</div></div>`,
  benefits: s => `${heading(s)}<div class="segmented" role="tablist" aria-label="Beneficios por participante">${s.audiences.map((a, i) => `<button role="tab" id="tab-${escapeHTML(s.id)}-${i}" aria-controls="panel-${escapeHTML(s.id)}" aria-selected="${i === 0}" tabindex="${i === 0 ? '0' : '-1'}" data-audience="${i}">${escapeHTML(a.label)} <span>↗</span></button>`).join('')}</div><div class="benefits-panel" id="panel-${escapeHTML(s.id)}" role="tabpanel" aria-labelledby="tab-${escapeHTML(s.id)}-0">${benefitsPanel(s.audiences[0])}</div>`,
  timeline: s => `${heading(s)}<div class="timeline-tabs" role="tablist" aria-label="Etapas de la ruta">${s.steps.map((step, i) => `<button role="tab" id="step-${escapeHTML(s.id)}-${i}" aria-controls="timeline-${escapeHTML(s.id)}" aria-selected="${i === 0}" tabindex="${i === 0 ? '0' : '-1'}" data-step="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${escapeHTML(step.label)}</button>`).join('')}</div><div class="timeline-panel" id="timeline-${escapeHTML(s.id)}" role="tabpanel" aria-labelledby="step-${escapeHTML(s.id)}-0">${timelinePanel(s.steps[0], 0)}</div><p class="fine-print timeline-note">${escapeHTML(s.note)}</p>`,
  profile: s => `${heading(s)}<div class="profile-layout"><div class="quote-card"><span class="quote-mark" aria-hidden="true">“</span><blockquote>${escapeHTML(s.quote)}</blockquote><p>ASD SERVICIOS LEGALES<br><span>Formación con propósito</span></p></div><div class="traits">${s.traits.map((t, i) => `<article><span>0${i + 1}</span><div><h2>${escapeHTML(t.title)}</h2><p>${escapeHTML(t.text)}</p></div>${icon('spark')}</article>`).join('')}</div></div><p class="commitment">${escapeHTML(s.commitment)}</p>`,
  closing: (s, data) => `${heading(s)}<div class="closing-steps">${s.actions.map((a, i) => `<article><span>0${i + 1}</span><h2>${escapeHTML(a.title)}</h2><p>${escapeHTML(a.text)}</p></article>`).join('')}</div><div class="closing-actions"><a class="button primary" href="mailto:${escapeHTML(data.contact.email)}?subject=${encodeURIComponent('Alianza formativa · ASD Servicios Legales')}">${escapeHTML(s.cta)} ↗</a><button class="button secondary" data-open-prompt>Preparar una propuesta <span>＋</span></button></div><a class="contact-link" href="${escapeHTML(data.contact.website)}" target="_blank" rel="noopener noreferrer">asdservicioslegales.co ↗</a><p class="fine-print legal-note">${escapeHTML(s.note)}</p>`
};

export function renderPresentation(data) {
  const main = document.querySelector('#presentation');
  main.innerHTML = data.sections.map((s, i) => `<section class="slide slide-${escapeHTML(s.type)}" id="slide-${escapeHTML(s.id)}" aria-label="${escapeHTML(s.label)}" ${i ? 'hidden' : ''}>${renderers[s.type] ? renderers[s.type](s, data) : heading(s)}</section>`).join('');
  document.querySelector('#chapter-nav').innerHTML = data.sections.map((s, i) => `<a class="chapter-link" href="#${escapeHTML(s.id)}" ${i ? '' : 'aria-current="step"'}><span class="chapter-number">${String(i + 1).padStart(2, '0')}</span><span>${escapeHTML(s.label)}</span><span class="chapter-indicator" aria-hidden="true"></span></a>`).join('');
  main.querySelectorAll('img').forEach(img => {
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

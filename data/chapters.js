import { sceneContent } from './scene.js';

/** Adaptación editorial: el contenido original sigue viviendo en content.js. */
export function buildChapter(section) {
  const base = {
    id: section.id,
    type: section.type,
    title: section.title,
    description: section.description,
    note: section.note || section.commitment || '',
    groups: [],
    stops: [],
  };
  if (section.type === 'hero')
    base.stops = sceneContent.stops.map((s) => ({
      ...s,
      items: section.tags,
      takeaway: section.note,
    }));
  if (section.type === 'ecosystem')
    base.stops = [
      ...section.nodes.map((n) => ({
        label: n.title,
        title: n.subtitle,
        body: n.body || section.description,
        items: n.items,
        takeaway: section.outcome,
      })),
      {
        label: 'Impacto compartido',
        title: section.outcome,
        body: section.description,
        items: section.pillars,
        takeaway: 'Conocimiento y experiencia en ambas direcciones.',
      },
    ];
  if (section.type === 'benefits') {
    base.groups = section.audiences.map((a, i) => ({
      label: a.label,
      heading: a.heading,
      start: section.audiences
        .slice(0, i)
        .reduce((n, audience) => n + audience.items.length, 0),
      length: a.items.length,
    }));
    base.stops = section.audiences.flatMap((a, group) =>
      a.items.map((item) => ({
        label: item.title,
        title: item.title,
        body: item.detail,
        summary: item.summary,
        group,
        takeaway: a.heading,
      })),
    );
  }
  if (section.type === 'timeline')
    base.stops = section.steps.map((s) => ({
      ...s,
      items: s.activities,
      takeaway: s.deliverable,
    }));
  if (section.type === 'profile')
    base.stops = section.traits.map((t) => ({
      label: t.title,
      title: t.title,
      body: t.text,
      summary: section.quote,
      takeaway: section.commitment,
    }));
  if (section.type === 'closing')
    base.stops = section.actions.map((a) => ({
      label: a.title,
      title: a.title,
      body: a.text,
      takeaway: 'Facultades de Derecho · Montería y la región',
    }));
  if (!base.stops.length)
    base.stops = [
      { label: section.label, title: section.title, body: section.description },
    ];
  return base;
}

export function groupIndices(chapter, group = 0) {
  const selected = chapter.groups[group];
  return selected
    ? Array.from({ length: selected.length }, (_, i) => selected.start + i)
    : chapter.stops.map((_, i) => i);
}

/** Configuración visual separada del texto; se puede reordenar o ampliar contenido. */
export const worldContent = {
  hero: {
    name: 'Una alianza que conecta',
    description:
      'Universidad y firma unidas por un puente, rodeadas de palmeras.',
    caption: 'DEL CONOCIMIENTO A LA EXPERIENCIA',
    span: 19,
    target: [0, 1, 0],
  },
  ecosystem: {
    name: 'El conocimiento circula',
    description:
      'Dos instituciones conectadas por circuitos de intercambio alrededor de un núcleo común.',
    caption: 'DOS MUNDOS · UN PROPÓSITO',
    span: 18,
    target: [0, 1, 0],
  },
  benefits: {
    name: 'El valor se multiplica',
    description:
      'Cuatro estaciones sobre una plataforma, cada una representa un beneficio de la alianza.',
    caption: 'CRECIMIENTO EN AMBAS DIRECCIONES',
    span: 17,
    target: [0, 1, 0],
  },
  timeline: {
    name: 'Un recorrido con propósito',
    description:
      'Cuatro islas escalonadas con documentos, libros, trabajo guiado y una meta profesional.',
    caption: 'CADA ETAPA CONSTRUYE CRITERIO',
    span: 17.5,
    target: [0, 1, 0],
  },
  profile: {
    name: 'Las herramientas del criterio',
    description:
      'Un escritorio de trabajo con un documento, una brújula, un portátil y un escudo de integridad.',
    caption: 'EL TALENTO SE CONSTRUYE',
    span: 16,
    target: [0, 1.1, 0],
  },
  closing: {
    name: 'La alianza toma forma',
    description:
      'Una mesa de encuentro con tres acuerdos y las instituciones que los construyen.',
    caption: 'EL SIGUIENTE CAPÍTULO, JUNTOS',
    span: 17,
    target: [0, 1, 0],
  },
};

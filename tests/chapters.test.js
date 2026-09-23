import test from 'node:test';
import assert from 'node:assert/strict';
import { presentation } from '../data/content.js';
import { buildChapter, groupIndices, worldContent } from '../data/chapters.js';
import { immersiveSection, stopPanel, escapeHTML } from '../js/render.js';

test('los seis capítulos ofrecen 25 momentos y un escenario por capítulo', () => {
  const chapters = presentation.sections.map(buildChapter);
  assert.equal(
    chapters.reduce((total, chapter) => total + chapter.stops.length, 0),
    25,
  );
  for (const [i, section] of presentation.sections.entries()) {
    const chapter = chapters[i];
    assert.ok(worldContent[chapter.type]);
    assert.ok(chapter.stops.every((s) => s.label && s.title && s.body));
    const markup = immersiveSection(section, i, presentation);
    assert.ok(markup.includes(`data-scene="${section.id}"`));
    assert.ok(markup.includes(`id="progress-${section.id}"`));
    assert.ok(markup.includes(escapeHTML(section.description)));
  }
});

test('la adaptación conserva los ocho beneficios, actividades, competencias y condiciones', () => {
  for (const section of presentation.sections) {
    const chapter = buildChapter(section);
    const html =
      chapter.stops
        .map((stop) => stopPanel(stop, section, presentation))
        .join('') + immersiveSection(section, 0, presentation);
    const expected = [
      section.note,
      section.quote,
      section.commitment,
      ...(section.nodes || []).flatMap((n) => n.items),
      ...(section.audiences || []).flatMap((a) => [
        a.heading,
        ...a.items.flatMap((i) => [i.title, i.summary, i.detail]),
      ]),
      ...(section.steps || []).flatMap((s) => [
        s.title,
        s.body,
        s.deliverable,
        ...s.activities,
      ]),
      ...(section.traits || []).flatMap((t) => [t.title, t.text]),
      ...(section.actions || []).flatMap((a) => [a.title, a.text]),
    ].filter(Boolean);
    for (const text of expected)
      assert.ok(
        html.includes(escapeHTML(text)),
        `Contenido ausente en ${section.id}: ${text}`,
      );
  }
});

test('las ramas de beneficios se mantienen independientes al modificar sus contenidos', () => {
  const source = structuredClone(
    presentation.sections.find((s) => s.type === 'benefits'),
  );
  source.audiences[0].items.push({
    title: 'Nuevo beneficio',
    summary: 'Resumen',
    detail: 'Detalle',
  });
  const chapter = buildChapter(source);
  assert.deepEqual(groupIndices(chapter, 0), [0, 1, 2, 3, 4]);
  assert.deepEqual(groupIndices(chapter, 1), [5, 6, 7, 8]);
  const reordered = [...presentation.sections].reverse().map(buildChapter);
  assert.equal(reordered[0].id, 'alianza');
});

test('el panel narrativo escapa contenido editable y conserva el contacto', () => {
  const payload = '<img src=x onerror=alert(1)>';
  const section = presentation.sections.find((s) => s.type === 'closing');
  const html = stopPanel(
    {
      title: payload,
      body: payload,
      summary: payload,
      items: [payload],
      takeaway: payload,
    },
    section,
    presentation,
  );
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes(escapeHTML(payload)));
  assert.ok(html.includes(`mailto:${presentation.contact.email}`));
  assert.ok(html.includes('data-open-prompt'));
});

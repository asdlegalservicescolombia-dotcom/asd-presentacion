import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { presentation, buildPrompt, promptFormats } from '../data/content.js';
import { indexFromHash, boundedIndex } from '../js/navigation.js';
import { escapeHTML, benefitsPanel, timelinePanel } from '../js/render.js';

test('los capítulos tienen identificadores únicos y enlaces válidos', () => {
  const ids = presentation.sections.map(s => s.id);
  assert.equal(ids.length, new Set(ids).size);
  for (const section of presentation.sections) {
    assert.match(section.id, /^[a-z][a-z0-9-]+$/);
    assert.ok(section.title && section.description && section.label);
    if (section.ctaTarget) assert.ok(ids.includes(section.ctaTarget));
  }
});

test('la navegación soporta enlaces desconocidos, malformados y límites', () => {
  assert.equal(indexFromHash('#ruta', presentation.sections), 3);
  assert.equal(indexFromHash('#no-existe', presentation.sections), 0);
  assert.equal(indexFromHash('#%E0%A4%A', presentation.sections), 0);
  assert.equal(boundedIndex(-1, 6), 0);
  assert.equal(boundedIndex(6, 6), 5);
});

test('reordenar o añadir capítulos no rompe la resolución por identificador', () => {
  const reordered = [...presentation.sections].reverse();
  assert.equal(indexFromHash('#inicio', reordered), 5);
  reordered.push({ id: 'nuevo-capitulo' });
  assert.equal(indexFromHash('#nuevo-capitulo', reordered), 6);
});

test('el contenido no puede inyectar HTML en tarjetas o etapas', () => {
  const untrusted = '<img src=x onerror=alert(1)> & "texto"';
  assert.ok(!escapeHTML(untrusted).includes('<img'));
  const html = benefitsPanel({ heading: untrusted, items: [{ title: untrusted, summary: untrusted, detail: untrusted }] });
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;img'));
  const step = timelinePanel({ label: untrusted, title: untrusted, body: untrusted, deliverable: untrusted, activities: [untrusted] }, 0);
  assert.ok(!step.includes('<img'));
});

test('todos los formatos generan instrucciones completas y prudentes', () => {
  for (const format of Object.keys(promptFormats)) {
    const prompt = buildPrompt(format);
    assert.ok(prompt.includes(promptFormats[format]));
    assert.ok(prompt.includes('No inventes convenios'));
    assert.ok(prompt.includes('contacto@asdservicioslegales.com.co'));
  }
});

test('imágenes, módulos y recursos referenciados existen con rutas relativas', async () => {
  const root = new URL('../', import.meta.url);
  const html = await readFile(new URL('index.html', root), 'utf8');
  for (const [, path] of html.matchAll(/(?:src|href)="((?:assets|css|js)\/[^"#]+)"/g)) {
    await access(new URL(path, root));
    assert.ok(!path.startsWith('/'));
  }
  for (const section of presentation.sections) {
    if (section.image) await access(new URL(section.image.src, root));
    if (section.audiences) for (const audience of section.audiences) assert.ok(audience.items.length > 0);
    if (section.steps) assert.ok(section.steps.every(step => step.activities.length > 0));
  }
});

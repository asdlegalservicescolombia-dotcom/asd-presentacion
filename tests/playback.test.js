import test from 'node:test';
import assert from 'node:assert/strict';
import { presentation } from '../data/content.js';
import { buildChapter } from '../data/chapters.js';
import { MOMENT_INTERVAL, nextMoment } from '../js/playback.js';

test('el recorrido completo visita cada momento una vez y termina en el capítulo 06', () => {
  const chapters = presentation.sections.map(buildChapter);
  const visited = [];
  let cursor = { chapterIndex: 0, position: 0 };
  while (cursor && visited.length < 100) {
    visited.push(`${cursor.chapterIndex}:${cursor.position}`);
    cursor = nextMoment(chapters, cursor.chapterIndex, cursor.position);
  }
  assert.equal(cursor, null);
  assert.deepEqual(
    visited,
    chapters.flatMap((chapter, i) => chapter.stops.map((_, j) => `${i}:${j}`)),
  );
  assert.equal(visited.length, 25);
  assert.equal(MOMENT_INTERVAL, 4000);
});

test('incluye la segunda audiencia antes de salir de beneficios', () => {
  const chapters = presentation.sections.map(buildChapter);
  const i = chapters.findIndex((chapter) => chapter.type === 'benefits');
  const boundary = chapters[i].groups[1].start;
  assert.deepEqual(nextMoment(chapters, i, boundary - 1), {
    chapterIndex: i,
    position: boundary,
  });
  assert.deepEqual(nextMoment(chapters, i, chapters[i].stops.length - 1), {
    chapterIndex: i + 1,
    position: 0,
  });
});

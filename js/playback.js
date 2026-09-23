/** Tiempo de lectura entre momentos; la transición de cámara dura 0,7 s. */
export const MOMENT_INTERVAL = 4000;

/** Avance completo, incluidas todas las audiencias de cada capítulo. */
export function nextMoment(chapters, chapterIndex, position) {
  if (position + 1 < chapters[chapterIndex].stops.length)
    return { chapterIndex, position: position + 1 };
  if (chapterIndex + 1 < chapters.length)
    return { chapterIndex: chapterIndex + 1, position: 0 };
  return null;
}

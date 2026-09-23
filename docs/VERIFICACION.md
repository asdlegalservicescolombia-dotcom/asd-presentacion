# Verificación · presentación inmersiva completa

Fecha: 2026-09-22. Entorno: navegador integrado de Codex sobre Windows.

## Automatización

`node --test`: **13 pruebas aprobadas**. Cubren:

- Seis capítulos y 25 momentos de contenido.
- Conservación de beneficios (8), actividades, resultados, competencias y condiciones.
- Separación de grupos al agregar un beneficio y reordenación de secciones.
- Escape del contenido editable y conservación del contacto/CTA.
- Navegación por hash, IDs únicos, límites y enlaces malformados.
- GLB válidos, texturas externas y dependencias locales con licencias.
- Encuadres numéricos válidos y presupuesto de los modelos inferior a 500 KB.

## Pruebas en navegador

- Inspección visual de los seis escenarios en escritorio (1440 × 1000).
- Recorrido entre capítulos, ambas ramas de beneficios y distintos momentos.
- Reproducción automática observada: avanzó por las competencias; pausa funcionó.
- Teclado End en los controles de alianza: pasó a Construir el plan sin cambiar
  de capítulo. Home en su deslizador: volvió al primer momento.
- Prompt de propuesta abierto después de cambiar el momento de cierre: contenido
  completo y herramienta operativa. No se enviaron correos ni solicitudes.
- Anchos 390 × 844 y 320 × 740. En la prueba de 320, los seis capítulos registraron
  ancho de documento igual al visible (305 CSS px más barra de desplazamiento),
  sin bloques h1/h2/p/button/li con desbordamiento horizontal medido.
- Un único canvas en el DOM durante los cambios entre los seis capítulos.
- Fotografía de mentoría separada de la escenografía para evitar superposición.
- GLB académico retirado temporalmente: vista conceptual, paneles y navegación
  siguieron funcionando. Restaurado y verificada nuevamente la carga 3D.

## Límites de la comprobación

Responsive probado con emulación de viewport, no con teléfono físico. No se ha
medido una tasa de FPS ni aplicado un benchmark de GPU. La preferencia de movimiento
reducido y la pérdida de contexto están manejadas en código, pero no se han forzado
a nivel de sistema/GPU. El fallo de recurso sí se probó de extremo a extremo.

Las advertencias durante la retirada deliberada del modelo son esperadas. La
versión con recursos restaurados funciona sin errores nuevos de aplicación.
La publicación pública en GitHub Pages sigue pendiente de completar el acceso.

## Inicio automático del recorrido

Cada capítulo inicia su reproducción al quedar visible, con avance cada 6,5
segundos y repetición al llegar al final del grupo. La selección manual o Pausar
cancelan la reproducción; salir de la vista solo la suspende. La preferencia de
movimiento reducido conserva inicio manual. Se observó avance automático del
cierre y funcionamiento del botón de pausa. Las 13 pruebas existentes pasan.
# Reproducción completa y ritmo más rápido

- Intervalo de 4 segundos por momento; transición de cámara de 0,7 segundos.
- Nuevo control global «Reproducir todo» / «Pausar todo».
- El recorrido comienza desde 01 e incluye ambas audiencias de beneficios.
- Prueba automatizada: visita los 25 momentos en orden y termina sin repetir el 06.
- Navegador: avance automático entre capítulos y cambio a la segunda audiencia.
- Móvil de 320 px: botón y paginación dentro del ancho disponible, sin desbordamiento.
- `node --test`: 15 pruebas aprobadas.

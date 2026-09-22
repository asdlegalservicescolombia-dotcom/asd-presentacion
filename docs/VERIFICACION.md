# Registro de verificación

Fecha: 22 de septiembre de 2026.

## Pruebas automáticas

`node --test`: **6 pruebas aprobadas, 0 fallos**.

- Identificadores de capítulos únicos y destinos de navegación válidos.
- Enlaces desconocidos y codificación malformada recuperados sin excepción.
- Límites de navegación y reordenación/adición de capítulos.
- Escape del texto editorial para impedir inyección de HTML en tarjetas y etapas.
- Cuatro formatos de prompt con información y límites institucionales.
- Existencia de imágenes, estilos y módulos con rutas relativas.

Sintaxis verificada con `node --check` en los módulos de aplicación, interacciones, navegación y renderizado.

## Navegador

Revisión en Chrome y navegador integrado de Codex:

- Los seis enlaces del menú muestran un solo capítulo a la vez.
- Flechas de navegación, teclas de avance y Atrás del navegador funcionan.
- Primer y último capítulo deshabilitan el control que no corresponde.
- Selector de beneficios cambia firma/estudiante; tarjetas despliegan detalles.
- Ruta permite seleccionar etapas por clic y por flechas dentro de las pestañas.
- Diálogo de propuestas cambia formato, genera el texto y confirma la copia al portapapeles.
- Escape cierra el diálogo y devuelve el foco al control que lo abrió.
- El botón de pantalla completa responde al cambio de estado del navegador.
- Logo e imagen de apertura se cargan correctamente.
- No se observaron errores o advertencias de aplicación en la consola revisada de Chrome.

## Responsive y revisión visual

- **390 × 844:** recorridos por los seis capítulos sin desbordamiento horizontal; un capítulo visible en cada cambio. Portada inspeccionada visualmente.
- **320 × 740:** cierre sin desbordamiento horizontal.
- **1440 × 900:** portada inspeccionada visualmente, identidad y fotografía cargadas, sin desbordamiento horizontal.
- El control de tamaño de Chrome no aplicó el tamaño solicitado; las medidas responsive anteriores se comprobaron en el navegador integrado de Codex.
- En ventanas de baja altura, la página permite desplazamiento vertical y conserva los controles inferiores visibles.

## Límites de la revisión

No es una auditoría WCAG completa ni una prueba en dispositivos físicos iOS/Android. Se revisó la implementación del movimiento reducido; no se modificó la preferencia de accesibilidad del sistema. El correo usa `mailto:` y requiere una aplicación de correo configurada. El prompt no envía comunicaciones ni genera contenido en un servicio externo por sí solo.

El estado de GitHub Pages debe verificarse en el repositorio y su URL publicada; estas pruebas locales no sustituyen la comprobación del despliegue.

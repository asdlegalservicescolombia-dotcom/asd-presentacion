# Guía de mantenimiento

## Cambios habituales

| Necesidad | Archivo / propiedad |
| --- | --- |
| Cambiar textos | `data/content.js`, propiedad del capítulo |
| Reordenar capítulos | Orden de `presentation.sections` |
| Añadir un beneficio | `audiences[n].items` |
| Añadir una etapa | `steps` del capítulo `timeline` |
| Cambiar imagen de apertura | `image.src`, `alt`, `caption`, `credit` |
| Cambiar el correo | `presentation.contact.email` y contacto del prompt |
| Cambiar colores | Variables de `:root` en `css/styles.css` |
| Crear otro diseño de capítulo | Nuevo renderizador en `js/render.js` y CSS |
| Cambiar prompts | `promptFormats` y `buildPrompt` |

El sitio procesa el contenido como texto escapado para impedir que caracteres HTML rompan las tarjetas. `\n` crea saltos de línea en los títulos. Los datos son código JavaScript: conservar comas y comillas y ejecutar `npm test` antes de publicar.

## Procedimiento recomendado

1. Crear una rama para un cambio concreto.
2. Editar contenido o componente.
3. Ejecutar `npm test` y abrir el servidor local.
4. Revisar escritorio, móvil, teclado y enlaces directos.
5. Revisar exactitud institucional, uso del logo y rutas de los recursos.
6. Crear un commit con un propósito; revisar y llevar a `main`.
7. Verificar el despliegue de Pages y abrir su URL pública.

## Medios y rendimiento

Mantener imágenes cerca de 100–250 KB cuando sea posible. No usar URLs temporales de generación. Guardar la procedencia y el propósito narrativo de cualquier nuevo recurso. El sitio carga la imagen de apertura con prioridad; no contiene trackers, analítica, cookies ni solicitudes a servicios externos para renderizarse.

La carpeta `assets/videos` está preparada pero vacía intencionalmente. Un video exige su propio componente accesible; no basta con sustituir la extensión de una imagen. Preferir reproducción voluntaria, cartel de carga y subtítulos; respetar movimiento reducido y ahorro de datos.

## Alcance editorial

Fechas, cupos, convenios, duración, condiciones económicas y reconocimiento académico siguen pendientes de definición por ASD y la institución correspondiente. El plan de cuatro etapas es una propuesta de narrativa, no una política operativa ya aprobada.

La Ley 2113 de 2021 regula el consultorio jurídico y contempla condiciones para convenios y actividades pro bono; una práctica en una firma privada no debe presentarse como equivalente automática. Fuente revisada el 22 de septiembre de 2026: [Ley 2113 de 2021, Función Pública](https://www1.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=168026). Cualquier oferta concreta de judicatura requiere revisión específica de su modalidad antes de publicarse.

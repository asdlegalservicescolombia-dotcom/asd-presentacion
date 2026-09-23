# Mantenimiento de la presentación

## Contenido

1. Editar `data/content.js` para textos, beneficios, actividades, competencias y CTA.
2. Editar `data/scene.js` para los tres momentos de portada y rutas de modelos.
3. No introducir HTML en los textos: las plantillas escapan los valores.
4. Recargar el navegador. No hay compilación.

`data/chapters.js` adapta el contenido a momentos. Los ocho beneficios mantienen
sus ramas firma/estudiante; actividades, resultados y condiciones se conservan.
El menú y la navegación se generan desde `sections`, con IDs únicos.

## Nuevas secciones y momentos

Duplicar un capítulo de un tipo existente y asignar otro ID. `worldContent`
configura el encuadre por tipo. Si se añade un tipo nuevo, añadir su adaptación en
`buildChapter` y su escenografía en `buildWorld`; mientras tanto tendrá un panel
narrativo básico y una escena genérica. Revisar la composición al añadir objetos:
que una lista admita más texto no significa que su escenografía ya tenga espacio.

## Recursos

La imagen de mentoría de la portada en los datos se utiliza en el capítulo de
formación. Cambiar `image.src` para sustituirla; mantener un alt descriptivo y el
crédito correcto. El logo oficial se conserva en `assets/logo/asd-logo.png`.

Para modelos: GLB con licencia adecuada para uso comercial y redistribución.
Conservar sus texturas, mayúsculas y rutas. Ajustar escala/posición en
`js/scene-worlds.js`, actualizar fuentes/licencias y revisar en móvil. No usar
archivos con secretos, datos de clientes o documentos jurídicos reales.

## Movimiento

`scene.js` controla texto, botones, grupos y reproducción. `scene-world.js`
controla el único contexto WebGL, encuadre, transiciones y pausa. `scene-worlds.js`
contiene los objetos por capítulo. `prefers-reduced-motion` evita transiciones.
Cambiar duración de GSAP no modifica los textos ni la navegación.

## Revisión mínima

Ejecutar `node --test`. Abrir los seis capítulos, cambiar ambos grupos de
beneficios, probar teclado/deslizador, reproducción/pausa y prompt tras cambiar
el momento de cierre. Revisar 320/390 px y escritorio; no debe haber desbordamiento
horizontal ni objetos superpuestos a texto. Probar un recurso ausente y restaurarlo.

Mantener commits por responsabilidad. Publicar en Pages solo una versión revisada;
las rutas deben seguir siendo relativas, sin dependencia de localhost o de un CDN.

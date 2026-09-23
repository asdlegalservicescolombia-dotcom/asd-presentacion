# ASD · Talento que trasciende

Presentación institucional interactiva de ASD Servicios Legales para una alianza
formativa con facultades de Derecho de Montería y la región. **Seis escenarios 3D,
25 momentos narrativos**, contenido editable y navegación accesible.

HTML, CSS y JavaScript modular. Three.js y GSAP están incluidos localmente en
`vendor/`; no hay CDN, API de IA en producción, backend ni compilación.

## Ejecutar

Con Node.js 20 o superior, desde esta carpeta:

```sh
node scripts/serve.mjs
```

Abrir http://127.0.0.1:4173/asd-presentacion/. También admite `npm start` si npm
está instalado. No requiere `npm install`. Usar un servidor HTTP: `file://` no es
adecuado para los módulos y modelos. Node se usa solo durante desarrollo.

## Explorar

- Seis capítulos: visión, propósito, beneficios, formación, talento y alianza.
- Cada capítulo tiene una escena y botones para sus momentos narrativos.
- Beneficios: elegir firma o estudiante y explorar sus cuatro beneficios.
- El deslizador coordina la cámara y la selección del contenido.
- «Reproducir todo», en el pie de página, empieza desde el capítulo 01 y recorre
  los 25 momentos hasta terminar el 06, incluidas las dos audiencias de beneficios.
  «Pausar todo» detiene la presentación; otra pulsación la inicia desde el principio.
  La navegación manual sale de este modo. Las transiciones de cámara duran 0,7 s.
- El recorrido arranca automáticamente al entrar en cada capítulo y avanza cada
  4 segundos, repitiendo sus momentos. «Pausar» o una selección manual detienen
  el avance. «Recorrer» lo reanuda. Al cambiar de capítulo comienza su recorrido.
- Al ocultar la página o el capítulo, se suspende y después se reanuda si no se
  había pausado manualmente. El movimiento reducido desactiva el inicio automático.
- Flechas del teclado: capítulos; dentro de los botones de un recorrido, momentos.
  Inicio/Fin funcionan dentro del contexto activo. F activa pantalla completa.
- En el cierre, «Preparar una propuesta» abre el prompt editable. No envía mensajes.

En móvil, la escena y sus controles aparecen antes de la explicación. El texto
es HTML, no está incrustado en el 3D. Se respeta el movimiento reducido del sistema.

## Arquitectura

| Archivo | Responsabilidad |
|---|---|
| `data/content.js` | Información institucional, capítulos, beneficios y actividades |
| `data/scene.js` | Modelos y momentos de la portada |
| `data/chapters.js` | Adaptación del contenido a momentos y configuración de encuadres |
| `js/render.js` | HTML accesible de capítulos y paneles |
| `js/navigation.js` | URL, historial, foco, capítulos y teclado |
| `js/scene.js` | Selección, reproducción, ramas y carga del motor |
| `js/scene-world.js` | Único renderizador, caché, cámaras y ciclo de vida |
| `js/scene-worlds.js` | Seis escenografías, objetos y respuesta visual |
| `js/animations.js` | Entrada de capítulos |
| `js/interactions.js` | Diálogos, pantalla completa y prompt |
| `css/styles.css` | Marca, navegación y componentes compartidos |
| `css/scene.css` | Presentación inmersiva y adaptación responsive |
| `assets/models/` | Tres modelos Kenney CC0 y textura asociada |
| `assets/images/` | Fotografía ilustrativa de mentoría, generada con Higgsfield |
| `assets/logo/`, `assets/fonts/` | Logo oficial y Montserrat local |
| `vendor/` | Three.js 0.186.0 y GSAP 3.15.0, con avisos de licencia |
| `tests/` | Contratos de contenido, navegación y recursos |

## Editar

Modificar `data/content.js` y recargar. El orden de `sections` define los capítulos.
No se necesita recompilar. Mantener IDs únicos y actualizar los `ctaTarget` si se
elimina una sección. Los seis tipos existentes se pueden reutilizar.

La adaptación conserva los detalles y condiciones institucionales al distribuirlos
entre los momentos. Sustituir una imagen o un texto no requiere editar el motor.
Los modelos se cambian en `data/scene.js`; sus proporciones y disposición se ajustan
en `scene-worlds.js` cuando sea necesario. Los encuadres están en `worldContent`
(`data/chapters.js`). Ver [mantenimiento](docs/MANTENIMIENTO.md).

## Rendimiento y recuperación

Se crea un solo contexto WebGL y se mueve su lienzo al capítulo visible. Los
modelos se descargan una vez y los mundos se reutilizan. No se renderiza
continuamente: solo durante transiciones, cambios o redimensionamiento. Al ocultar
la escena se pausa el motor; en móvil se limita la densidad y se omiten sombras.

Si falla un modelo o WebGL, los controles y la información siguen funcionando con
una vista conceptual HTML/CSS. La imagen de mentoría tiene texto alternativo.

## Pruebas

```sh
node --test
```

Trece pruebas verifican conservación del contenido, las ramas de beneficios,
IDs/enlaces, escape de HTML, modelos GLB, texturas y dependencias locales.
Revisar además las seis escenas, móvil, teclado, reproducción y recuperación.
Evidencia y límites: [verificación](docs/VERIFICACION.md).

## GitHub Pages

Preparado para publicación estática desde `main`, carpeta `/(root)`, mediante
Settings → Pages → Deploy from a branch. Todas las rutas son relativas.

Repositorio previsto: https://github.com/asdlegalservicescolombia-dotcom/asd-presentacion

URL prevista: https://asdlegalservicescolombia-dotcom.github.io/asd-presentacion/

La subida y publicación pública siguen pendientes del acceso autorizado a GitHub.
La URL local funciona; no presentar la dirección pública como un despliegue activo.

## Recursos y contenido

Los modelos de Kenney son CC0; las nuevas geometrías son código propio del proyecto.
Three.js es MIT; GSAP usa su licencia estándar gratuita, no MIT. Montserrat es OFL.
El logo y los contenidos institucionales pertenecen a ASD. Fuentes y licencias:
[recursos](docs/RECURSOS.md) y [escenas](docs/ESCENA-3D.md).

Es una propuesta institucional: no un convenio celebrado ni una convocatoria
abierta. Se conservan las condiciones sobre supervisión, reconocimiento académico
y ausencia de promesa de contratación. Los edificios son conceptuales; la imagen
IA no representa empleados, instalaciones ni clientes reales.

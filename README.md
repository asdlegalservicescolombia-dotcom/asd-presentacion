# ASD · Talento que trasciende

Presentación web interactiva de la propuesta de alianza formativa de **ASD Servicios Legales** con facultades de Derecho de Montería y la región. Desarrollada con HTML, CSS y módulos JavaScript nativos. Sin dependencias de producción, servicios de pago para alojar la web ni proceso de compilación.

## Ejecutar localmente

Requisito de desarrollo: Node.js 20 o superior (gratuito).

```sh
git clone https://github.com/asdlegalservicescolombia-dotcom/asd-presentacion.git
cd asd-presentacion
npm start
```

Abrir **http://127.0.0.1:4173/asd-presentacion/**. No hace falta `npm install`. También funciona con cualquier servidor HTTP estático, por ejemplo `python -m http.server 4173` desde la carpeta del proyecto.

Usar un servidor HTTP: abrir `index.html` mediante `file://` no carga módulos JavaScript de forma fiable. Node.js se usa únicamente para desarrollo; el sitio publicado se ejecuta en el navegador.

## Presentar

- Seis capítulos con enlaces directos: `#inicio`, `#proposito`, `#beneficios`, `#ruta`, `#talento`, `#alianza`.
- Flechas izquierda/derecha o botones inferiores para avanzar. Inicio/Fin van al primer/último capítulo.
- **F** o el botón superior activa pantalla completa cuando el navegador lo permite.
- En beneficios, cambiar entre firma/estudiante y desplegar cada tarjeta.
- En la ruta, seleccionar una de las cuatro etapas. Las flechas funcionan dentro de cada grupo de pestañas.
- En el cierre, abrir «Preparar una propuesta» para adaptar y copiar el prompt por formato. Esto no llama a una API de IA ni envía mensajes.
- La navegación respeta Atrás/Adelante del navegador y preferencias de movimiento reducido. En pantallas pequeñas el contenido tiene desplazamiento vertical y los controles inferiores permanecen visibles.

## Estructura

```text
asd-presentacion/
├── index.html               # Estructura general, controles y diálogos
├── css/styles.css           # Identidad, componentes y responsive
├── js/
│   ├── app.js               # Inicialización
│   ├── render.js            # Plantillas por tipo de capítulo
│   ├── navigation.js        # Navegación, URL, foco y teclado
│   ├── animations.js        # Animaciones con movimiento reducido
│   └── interactions.js      # Pestañas, pantalla completa y prompt
├── data/content.js          # Textos, capítulos, enlaces y rutas de imagen
├── assets/
│   ├── images/              # Imágenes optimizadas
│   ├── videos/              # Carpeta reservada; sin videos innecesarios
│   ├── icons/               # Favicon SVG; iconos pequeños en render.js
│   ├── logo/                # PNG oficial
│   └── fonts/               # Montserrat local y licencia OFL
├── scripts/serve.mjs        # Servidor local sin dependencias
├── tests/content.test.js    # Contratos de contenido, rutas y navegación
├── docs/                    # Mantenimiento, procedencia y verificación
├── package.json
└── .nojekyll                # Publicación estática en GitHub Pages
```

## Editar sin reconstruir la aplicación

Modificar **`data/content.js`** y recargar. Cada capítulo tiene un `id` único y estable, un `type`, título, descripción y datos específicos. El arreglo `sections` define el orden y el número de capítulos; menú, contador y progreso se actualizan automáticamente.

Para añadir una sección, duplicar una del mismo tipo y cambiar su `id`. Para retirarla, eliminarla del arreglo y actualizar cualquier `ctaTarget` que la apunte. Los tipos disponibles son `hero`, `ecosystem`, `benefits`, `timeline`, `profile` y `closing`. Un tipo nuevo usa una cabecera básica hasta añadir su renderizador en `js/render.js`.

Cambiar una imagen: reemplazar el archivo manteniendo el nombre, o modificar `image.src`, `image.alt` y `image.credit` en los datos. Evitar rutas que empiecen por `/`: GitHub Pages sirve este proyecto bajo `/asd-presentacion/`. No incrustar información de clientes en imágenes o datos públicos. Una imagen ausente muestra una descripción y conserva la navegación.

Los videos no son necesarios para esta versión. Para añadir uno con propósito narrativo, guardar un MP4/WebM optimizado en `assets/videos/` y añadir un renderizador con controles, `poster`, `preload="none"` y subtítulos cuando haya voz. Ninguna dependencia ni reconstrucción es necesaria. Ver [mantenimiento](docs/MANTENIMIENTO.md).

## GitHub Pages

En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch → main → /(root) → Save**. Los archivos estáticos se publican desde la raíz. No se necesita un workflow, Jekyll ni una cuenta de hosting adicional.

Dirección prevista de publicación: **https://asdlegalservicescolombia-dotcom.github.io/asd-presentacion/**. Comprobar el estado del despliegue antes de compartirla. Cada commit posterior a `main` vuelve a publicar el contenido una vez habilitado Pages.

Guía oficial: [configurar la fuente de publicación de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Verificar cambios

```sh
npm test
```

Después revisar en navegador: capítulos, Atrás/Adelante, enlaces directos, pestañas con teclado, tarjetas, diálogo y tamaños móvil/escritorio. Ver [registro de verificación](docs/VERIFICACION.md).

Mantener commits por responsabilidad: `feat: ...`, `fix: ...`, `docs: ...`. No subir archivos de trabajo, secretos o la imagen original sin optimizar. Las ramas de trabajo y pull requests permiten revisar cambios futuros antes de llevarlos a `main`.

## Contenido y recursos

El contenido es una **propuesta institucional**, no un convenio celebrado ni una convocatoria abierta. El reconocimiento como práctica, consultorio jurídico o judicatura debe validarse específicamente; no se promete equivalencia automática. No se inventan cupos, duración, remuneración, convenios ni contrataciones.

Se generó una única escena ilustrativa de mentoría mediante Higgsfield. No representa empleados, instalaciones o clientes reales de ASD. La entrega web usa WebP local de aproximadamente 100 KB. Montserrat se distribuye bajo SIL Open Font License; ver `assets/fonts/OFL.txt`. Logo y contenidos institucionales pertenecen a ASD; su publicación no otorga una licencia de uso de marca. Ver [procedencia](docs/RECURSOS.md).

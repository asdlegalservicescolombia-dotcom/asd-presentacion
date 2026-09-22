# Universidad → conexión → ASD

Primera escena interactiva inspirada en el lenguaje de diorama y cambios de cámara
de la referencia del usuario. Es una representación conceptual, no una reproducción
de la sede de ASD ni de una universidad real. Los otros cinco capítulos conservan
su presentación existente.

## Recursos seleccionados

| Archivo | Autor y fuente | Propósito | Peso |
|---|---|---|---|
| `assets/models/city/building-k.glb` | [Kenney City Kit Commercial 2.1](https://kenney.nl/assets/city-kit-commercial) | Estación académica, con pórtico geométrico propio | 246.976 bytes |
| `assets/models/city/building-skyscraper-a.glb` | Mismo conjunto | Estación de práctica profesional ASD | 111.336 bytes |
| `assets/models/nature/tree_palmDetailedShort.glb` | [Kenney Nature Kit](https://kenney.nl/assets/nature-kit) | Vegetación de ambiente tropical | 28.212 bytes |

Los tres modelos suman **386.524 bytes**. Los edificios necesitan también
`city/Textures/colormap.png`; conservar la ruta y mayúsculas. Se reutiliza una sola
palmera cargada para poblar la escena. Los GLB se conservan sin modificar; escalas,
posiciones y materiales de las palmeras se ajustan durante el renderizado.

Ambos conjuntos son CC0: admiten uso comercial, modificación y redistribución.
Evidencia original: `assets/licenses/kenney-city.txt` y `kenney-nature.txt`.
Crédito voluntario: modelos de Kenney (kenney.nl). No implica aval del autor a ASD.
El manifiesto `curaduria_recursos_web.json` registra hashes, valoración y fuentes.

## Comparación y descarte

- Kenney City Kit Commercial: seleccionado por coherencia, peso y CC0.
- [Kenney Building Kit](https://kenney.nl/assets/building-kit): CC0; alternativa
  modular, no descargada porque el conjunto urbano ya cubre ambas estaciones.
- [Low Poly University, Ivan Norman](https://sketchfab.com/3d-models/low-poly-university-a68d0b72205b49849ed1e6d6c3851749):
  descartado y no descargado por licencia no comercial indicada en su ficha.
- Kenney Nature Kit: seleccionado para palmeras; no se añaden rocas, vehículos ni
  otros modelos que no aporten al relato.

La biblioteca local de ASD fue consultada sin localizar modelos de campus o GLB
adecuados. Los ZIP originales de City Kit y Nature Kit, y los paquetes oficiales
npm de Three.js y GSAP, quedan fuera del repositorio en `../work/recursos3d/`.
ScrollTrigger está incluido en el paquete descargado, pero no se envía al visitante:
este primer tramo usa botones y un deslizador nativo, sin interceptar el scroll.

## Cambiar el contenido y la escena

- Narrativa general: `data/content.js`.
- Textos de las tres estaciones, rutas de modelos y cámaras: `data/scene.js`.
- Geometría, iluminación y disposición: `js/scene-world.js`.
- Controles y carga diferida: `js/scene.js`.
- Estilos de esta escena: `css/scene.css`.

Para reemplazar un modelo, descargar un GLB legalmente reutilizable, copiar sus
texturas asociadas, cambiar su ruta en `data/scene.js` y revisar el encuadre.
El motor normaliza la altura y apoya la base del modelo sobre la isla. Cambios
importantes de proporciones pueden necesitar ajustar altura/posición en
`scene-world.js`. Actualizar la fuente y la licencia en el manifiesto.
No hay compilación, backend, claves ni CDN.

## Rendimiento y accesibilidad

El motor se carga cuando la escena entra en la pantalla. En móvil limita la
densidad de píxeles y omite sombras dinámicas. No hay un bucle de renderizado
permanente: dibuja cuando cambia la cámara o el tamaño, y pausa al ocultarse.
`prefers-reduced-motion` desactiva las transiciones de cámara. Los botones,
deslizador, títulos y descripción son HTML; funcionan aunque falle WebGL.
Ante un modelo faltante o pérdida del contexto gráfico, muestra la fotografía
de mentoría y mantiene la navegación.

## Verificación realizada · 2026-09-22

- Inspección visual de los modelos GLB cargados en el navegador: campus, firma,
  puente y palmeras; encuadres de las tres estaciones.
- Botones de recorrido, deslizador con Home y navegación entre capítulos.
- Vistas de 1440 × 900, ancho habitual de escritorio, 390 × 844 y 320 × 740;
  sin desbordamiento horizontal. Revisión móvil mediante emulación de viewport,
  no prueba en un teléfono físico.
- Retirada temporal del GLB académico: apareció la imagen alternativa, siguieron
  funcionando los textos y se pudo navegar a beneficios. Modelo restaurado.
- Nueve pruebas automatizadas: contenido, enlaces, seguridad del renderizado,
  estructura GLB, texturas externas, cámaras y dependencias locales.

La reducción de movimiento y la pérdida real de contexto se manejan en código;
no se han simulado a nivel de sistema/GPU. Publicación en GitHub Pages pendiente
de completar el acceso a GitHub; la vista local es operativa.

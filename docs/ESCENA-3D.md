# Seis capítulos inmersivos · ASD

La presentación completa utiliza el lenguaje de diorama, iluminación verde,
materiales sobrios y cámaras pausadas. Las arquitecturas son conceptuales, no sedes
reales. El texto y todos los controles son HTML editable e independiente de WebGL.

| Capítulo | Escenografía | Momentos |
|---|---|---|
| Visión | Universidad, puente y firma | 3 |
| Propósito | Dos instituciones y circulación de conocimiento | 3 |
| Beneficios | Estaciones de personas, tiempo, conocimiento y vínculos; variante para estudiantes | 8 en dos grupos |
| Formación | Cuatro islas progresivas y fotografía ilustrativa de mentoría | 4 |
| Talento | Mesa de trabajo con documento, brújula, portátil y escudo | 4 |
| Alianza | Mesa de encuentro y tres acuerdos | 3 |

Los nuevos objetos son geometrías propias del proyecto; no añaden descargas.
Los modelos CC0 existentes se cargan una vez y se reutilizan.

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

## Arquitectura y mantenimiento

`data/content.js` conserva la información institucional. `data/chapters.js` la
adapta a 25 momentos y define `worldContent` (encuadres). `data/scene.js` contiene
los modelos y la narrativa de portada. `js/scene.js` dirige los controles,
`js/scene-world.js` gestiona el único contexto WebGL y `js/scene-worlds.js` construye
los seis mundos. Estilos: `css/scene.css`.

El motor guarda los mundos por capítulo/grupo, traslada un solo lienzo, renderiza
solo al cambiar algo y pausa al ocultarse. En móvil reduce densidad y sombras.
Las transiciones respetan movimiento reducido. No se intercepta el scroll.

El fallo de WebGL o de un modelo activa una vista conceptual HTML/CSS para todos
los capítulos, sin perder textos, navegación o herramientas. La foto de mentoría
se reserva para la ruta de formación, con alt y crédito procedentes de los datos.

Ver [verificación](VERIFICACION.md) y [mantenimiento](MANTENIMIENTO.md). GitHub
Pages continúa pendiente del acceso a GitHub; esta versión funciona localmente.

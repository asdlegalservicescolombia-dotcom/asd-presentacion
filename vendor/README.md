# Dependencias incluidas

Sin CDN ni gestor de paquetes en producción. Rutas relativas compatibles con GitHub Pages.

| Librería | Versión | Uso | Licencia |
|---|---|---|---|
| Three.js | 0.186.0 | Renderizador WebGL y GLTFLoader | MIT, `three/LICENSE` |
| GSAP | 3.15.0 | Transición de cámaras | Estándar gratuita, `gsap/NOTICE.md` |

Descarga oficial: https://registry.npmjs.org/three/-/three-0.186.0.tgz y
https://registry.npmjs.org/gsap/-/gsap-3.15.0.tgz (2026-09-22).
Los archivos se conservan sin modificar. `three.core.js` es una dependencia de
`three.module.js`; GLTFLoader necesita BufferGeometryUtils y SkeletonUtils.

Para actualizar, sustituir conjuntamente los archivos de una versión, conservar
las licencias y verificar carga, navegación, texturas, fallback y móvil.
Solo se importan al entrar en el área visible de la escena.

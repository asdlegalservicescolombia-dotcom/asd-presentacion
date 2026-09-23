import { presentation } from '../data/content.js';
import { renderPresentation } from './render.js';
import { initNavigation } from './navigation.js';
import { animateSlide } from './animations.js';
import { initInteractions } from './interactions.js';
import { initScene } from './scene.js';

renderPresentation(presentation);
const scenes = initScene(presentation);
initNavigation(presentation.sections, (slide) => {
  animateSlide(slide);
  scenes.show(slide);
});
initInteractions(presentation);

import { presentation } from '../data/content.js';
import { renderPresentation } from './render.js';
import { initNavigation } from './navigation.js';
import { animateSlide } from './animations.js';
import { initInteractions } from './interactions.js';
import { initScene } from './scene.js';

renderPresentation(presentation);
const scenes = initScene(presentation, (index) =>
  navigation.show(index, {
    automatic: true,
    force: true,
    focus: false,
    historyMode: 'replace',
  }),
);
const navigation = initNavigation(presentation.sections, (slide, options) => {
  animateSlide(slide);
  scenes.show(slide, options);
});
initInteractions(presentation);

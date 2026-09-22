import { presentation } from '../data/content.js';
import { renderPresentation } from './render.js';
import { initNavigation } from './navigation.js';
import { animateSlide } from './animations.js';
import { initInteractions } from './interactions.js';

renderPresentation(presentation);
initNavigation(presentation.sections, animateSlide);
initInteractions(presentation);

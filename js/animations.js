/** Solo anima la entrada; nunca oculta contenido esperando JavaScript. */
export function animateSlide(slide) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !slide.animate) return;
  slide.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
  [...slide.children].forEach((element, index) => {
    element.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }], {
      duration: 420, delay: Math.min(index * 55, 180), easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards'
    });
  });
}

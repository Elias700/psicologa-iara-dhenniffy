import { Directive } from '@angular/core';

import { MotionDirectiveBase } from './motion-directive.base';
import { AnimationLibs, BREAKPOINTS } from './scroll-animation.service';

/**
 * Desenha um traço SVG conforme a rolagem (derivado do mapa do modelo).
 * O elemento precisa de um `<path data-draw>`. No celular e com movimento reduzido, o traço já está completo.
 */
@Directive({ selector: '[appDrawPath]' })
export class DrawPathDirective extends MotionDirectiveBase {
  protected build({ gsap }: AnimationLibs, mm: ReturnType<AnimationLibs['gsap']['matchMedia']>): void {
    const path = this.host.querySelector<SVGPathElement>('path[data-draw]');
    if (!path) return;

    mm.add(`(min-width: ${BREAKPOINTS.lg}px)`, () => {
      const length = path.getTotalLength();
      gsap.fromTo(
        path,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: this.host, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
        },
      );
    });
  }
}

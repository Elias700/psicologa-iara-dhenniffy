import { Directive } from '@angular/core';

import { MotionDirectiveBase } from './motion-directive.base';
import { AnimationLibs, BREAKPOINTS } from './scroll-animation.service';

/**
 * Barra fina de progresso de leitura (derivada da scrollbar customizada do clone).
 * Ajuda a saber "quanto falta". Só em telas ≥ 1024px e com movimento ativo.
 */
@Directive({
  selector: '[appScrollProgress]',
})
export class ScrollProgressDirective extends MotionDirectiveBase {
  protected build({ gsap }: AnimationLibs, mm: ReturnType<AnimationLibs['gsap']['matchMedia']>): void {
    mm.add(`(min-width: ${BREAKPOINTS.lg}px)`, () => {
      gsap.set(this.host, { autoAlpha: 1 });
      gsap.fromTo(
        this.host,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
        },
      );
    });
  }
}

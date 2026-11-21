import { Directive } from '@angular/core';

import { MotionDirectiveBase } from './motion-directive.base';
import { AnimationLibs, BREAKPOINTS } from './scroll-animation.service';

/**
 * Passo a passo com linha de progresso (derivado do fluxo "pin + scrub" e da numeração do clone).
 * O "pin" é feito com CSS sticky no título (sem pin-spacer, sem pular layout).
 * A linha `.steps-line-fill` cresce com a rolagem e o passo da vez recebe `.is-active`.
 * Só em telas ≥ 768px. No celular e com movimento reduzido, todos os passos ficam iguais e visíveis.
 */
@Directive({
  selector: '[appStepsProgress]',
})
export class StepsProgressDirective extends MotionDirectiveBase {
  protected build({ gsap, ScrollTrigger }: AnimationLibs, mm: ReturnType<AnimationLibs['gsap']['matchMedia']>): void {
    const fill = this.host.querySelector<HTMLElement>('.steps-line-fill');
    const steps = Array.from(this.host.querySelectorAll<HTMLElement>('[data-step]'));

    mm.add(`(min-width: ${BREAKPOINTS.md}px)`, () => {
      this.host.classList.add('is-progressive');

      if (fill) {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: { trigger: this.host, start: 'top 60%', end: 'bottom 60%', scrub: 0.6 },
          },
        );
      }

      steps.forEach((step) =>
        ScrollTrigger.create({ trigger: step, start: 'top 62%', end: 'bottom 62%', toggleClass: 'is-active' }),
      );

      return () => this.host.classList.remove('is-progressive');
    });
  }
}

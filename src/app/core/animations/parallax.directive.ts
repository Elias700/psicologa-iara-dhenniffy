import { Directive, input } from '@angular/core';

import { MotionDirectiveBase } from './motion-directive.base';
import { AnimationLibs, BREAKPOINTS } from './scroll-animation.service';

/**
 * Parallax leve (derivado de `data-parallax="img"` do clone: ±15% → aqui ±5%).
 * Só em telas ≥ 768px. O elemento precisa de folga dentro de um pai com overflow hidden
 * (ver a classe .parallax-img no CSS do componente).
 */
@Directive({
  selector: '[appParallax]',
})
export class ParallaxDirective extends MotionDirectiveBase {
  readonly amount = input(5, { alias: 'appParallax', transform: (v: number | string) => Number(v) || 5 });

  protected build({ gsap }: AnimationLibs, mm: ReturnType<AnimationLibs['gsap']['matchMedia']>): void {
    const amount = Math.min(this.amount(), 6);
    const trigger = this.host.parentElement ?? this.host;

    mm.add(`(min-width: ${BREAKPOINTS.md}px)`, () => {
      gsap.fromTo(
        this.host,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        },
      );
    });
  }
}

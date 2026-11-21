import { Directive } from '@angular/core';

import { MotionDirectiveBase } from './motion-directive.base';
import { AnimationLibs, MOTION } from './scroll-animation.service';

/**
 * Texto revelado por LINHA com máscara (derivado de `animateTextP` do clone).
 * Sem divisão por letra e sem rotação. Usado em títulos e frases curtas.
 * O SplitText re-divide sozinho ao redimensionar (autoSplit) e mantém o texto acessível
 * (aria-label no elemento, linhas com aria-hidden).
 */
@Directive({
  selector: '[appSplitText]',
  host: { 'data-anim': '' },
})
export class SplitTextDirective extends MotionDirectiveBase {
  protected build({ gsap, SplitText }: AnimationLibs, mm: ReturnType<AnimationLibs['gsap']['matchMedia']>): void {
    if (this.alreadySeen()) return;

    mm.add('all', () => {
      SplitText.create(this.host, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 100,
            duration: MOTION.duration,
            ease: MOTION.ease,
            stagger: MOTION.stagger,
            scrollTrigger: { trigger: this.host, start: 'top 88%', once: true },
          }),
      });
    });
  }
}

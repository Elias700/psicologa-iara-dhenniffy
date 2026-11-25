import { Directive } from '@angular/core';

import { MotionDirectiveBase } from './motion-directive.base';
import { AnimationLibs } from './scroll-animation.service';

/**
 * Trilho lateral de progresso (derivado da scrollbar customizada do modelo).
 * Escreve `--progress` (0 a 1) no elemento e o percentual em `[data-progress-label]`.
 * Decorativo: só em telas ≥ 1280px e com movimento ativo.
 */
@Directive({ selector: '[appScrollProgress]' })
export class ScrollProgressDirective extends MotionDirectiveBase {
  protected build({ ScrollTrigger }: AnimationLibs, mm: ReturnType<AnimationLibs['gsap']['matchMedia']>): void {
    const label = this.host.querySelector<HTMLElement>('[data-progress-label]');

    mm.add('(min-width: 1280px)', () => {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: ({ progress }) => {
          this.host.style.setProperty('--progress', progress.toFixed(4));
          if (label) label.textContent = String(Math.round(progress * 100)).padStart(2, '0');
        },
      });
    });
  }
}

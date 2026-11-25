import { Directive } from '@angular/core';

import { MotionDirectiveBase } from './motion-directive.base';
import { AnimationLibs, BREAKPOINTS } from './scroll-animation.service';

/**
 * Texto que "acende" palavra a palavra conforme a rolagem (scrub suave).
 * Derivado do reveal por linha do clone. Só opacidade, sem deslocamento.
 * Começa em 0,35 (o texto nunca some) e termina em 1 antes do meio da tela.
 * No celular fica estático.
 */
@Directive({
  selector: '[appScrubWords]',
})
export class ScrubWordsDirective extends MotionDirectiveBase {
  protected build({ gsap, SplitText }: AnimationLibs, mm: ReturnType<AnimationLibs['gsap']['matchMedia']>): void {
    mm.add(`(min-width: ${BREAKPOINTS.md}px)`, () => {
      SplitText.create(this.host, {
        type: 'words',
        wordsClass: 'split-word',
        autoSplit: true,
        aria: 'none',
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.35 },
            {
              opacity: 1,
              ease: 'none',
              stagger: 0.1,
              scrollTrigger: { trigger: this.host, start: 'top 85%', end: 'bottom 55%', scrub: 0.8 },
            },
          ),
      });
    });
  }
}

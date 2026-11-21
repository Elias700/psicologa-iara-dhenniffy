import { Directive, input } from '@angular/core';

import { MotionDirectiveBase } from './motion-directive.base';
import { AnimationLibs, MOTION } from './scroll-animation.service';

/**
 * Imagem revelada por máscara (derivado de `animateSlide` e do reveal do mapa do clone).
 * Máscara reta (sem diagonal), imagem interna com escala 1,06 → 1 e sem deslocamento lateral.
 *
 * Estrutura: <figure appImageMask><div class="mask-inner"><img …></div></figure>
 */
@Directive({
  selector: '[appImageMask]',
  host: { 'data-anim': '' },
})
export class ImageMaskDirective extends MotionDirectiveBase {
  readonly direction = input<'up' | 'left' | ''>('up', { alias: 'appImageMask' });

  protected build({ gsap }: AnimationLibs, mm: ReturnType<AnimationLibs['gsap']['matchMedia']>): void {
    if (this.alreadySeen()) return;
    const inner = this.host.querySelector<HTMLElement>('.mask-inner');
    const start = this.direction() === 'left' ? 'inset(0% 100% 0% 0%)' : 'inset(100% 0% 0% 0%)';

    mm.add('all', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: this.host, start: 'top 85%', once: true },
        defaults: { duration: 1, ease: MOTION.ease },
      });
      tl.fromTo(this.host, { clipPath: start }, { clipPath: 'inset(0% 0% 0% 0%)', clearProps: 'clipPath' });
      if (inner) tl.fromTo(inner, { scale: 1.06 }, { scale: 1, duration: 1.2, clearProps: 'transform' }, 0);
    });
  }
}

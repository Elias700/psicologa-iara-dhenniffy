import { Directive, input } from '@angular/core';

import { MotionDirectiveBase } from './motion-directive.base';
import { AnimationLibs, STAGE_QUERY } from './scroll-animation.service';

/**
 * Cena horizontal (derivada de `.loc-scroll-area` do modelo).
 * A altura da seção e o `position: sticky` são definidos em CSS, então o layout é estável desde a
 * primeira pintura; aqui só o trilho se move, ligado à rolagem.
 * Fora da cena (celular, telas baixas, movimento reduzido) o conteúdo é uma lista comum.
 *
 * Uso: <section appHorizontalScroll=".track">
 */
@Directive({ selector: '[appHorizontalScroll]' })
export class HorizontalScrollDirective extends MotionDirectiveBase {
  readonly track = input.required<string>({ alias: 'appHorizontalScroll' });

  protected build({ gsap }: AnimationLibs, mm: ReturnType<AnimationLibs['gsap']['matchMedia']>): void {
    const track = this.host.querySelector<HTMLElement>(this.track());
    const viewport = track?.parentElement;
    if (!track || !viewport) return;

    mm.add(STAGE_QUERY, () => {
      viewport.scrollLeft = 0;
      this.host.classList.add('is-running');
      gsap.to(track, {
        x: () => -(track.scrollWidth - viewport.clientWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: this.host,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
      return () => this.host.classList.remove('is-running');
    });
  }
}

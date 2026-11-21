import { Directive, input } from '@angular/core';

import { MotionDirectiveBase } from './motion-directive.base';
import { AnimationLibs, BREAKPOINTS, MOTION } from './scroll-animation.service';

export type RevealVariant = 'up' | 'line' | 'scale';

/**
 * Reveal ao entrar na tela, uma vez só.
 * Derivado de `animateCtn` (up), `animateLine` (line) e do bloco central do clone (scale),
 * com deslocamento de 24px (16px no celular) em vez de até 184px.
 *
 * Uso: <div appReveal>, <ul appReveal [revealChildren]="true">, <hr appReveal="line">
 */
@Directive({
  selector: '[appReveal]',
  host: { 'data-anim': '' },
})
export class RevealDirective extends MotionDirectiveBase {
  readonly variant = input<RevealVariant | ''>('up', { alias: 'appReveal' });
  /** Anima os filhos diretos em sequência (stagger) em vez do próprio elemento. */
  readonly revealChildren = input(false);
  readonly revealDelay = input(0);

  protected build({ gsap }: AnimationLibs, mm: ReturnType<AnimationLibs['gsap']['matchMedia']>): void {
    const targets = this.revealChildren() ? Array.from(this.host.children) : [this.host];
    if (!targets.length || this.alreadySeen()) return;

    const variant = this.variant() || 'up';
    const delay = this.revealDelay();

    mm.add(
      { wide: `(min-width: ${BREAKPOINTS.md}px)`, narrow: `(max-width: ${BREAKPOINTS.md - 0.02}px)` },
      (context) => {
        const shift = context.conditions?.['wide'] ? MOTION.shift : MOTION.shiftMobile;
        const from: gsap.TweenVars =
          variant === 'line'
            ? { clipPath: 'inset(0% 100% 0% 0%)' }
            : variant === 'scale'
              ? { autoAlpha: 0, scale: 0.97 }
              : { autoAlpha: 0, y: shift };
        const to: gsap.TweenVars =
          variant === 'line'
            ? { clipPath: 'inset(0% 0% 0% 0%)' }
            : variant === 'scale'
              ? { autoAlpha: 1, scale: 1 }
              : { autoAlpha: 1, y: 0 };

        gsap.fromTo(targets, from, {
          ...to,
          duration: variant === 'up' ? 0.8 : MOTION.duration,
          delay,
          ease: MOTION.ease,
          stagger: MOTION.stagger,
          clearProps: 'clipPath,transform',
          scrollTrigger: { trigger: this.host, start: 'top 88%', once: true },
        });
      },
    );
  }
}

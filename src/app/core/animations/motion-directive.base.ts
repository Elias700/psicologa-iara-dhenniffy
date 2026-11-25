import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  NgZone,
  PLATFORM_ID,
  effect,
  inject,
  untracked,
} from '@angular/core';

import { MotionPreferenceService } from './motion-preference.service';
import { AnimationLibs, ScrollAnimationService } from './scroll-animation.service';

type MatchMedia = ReturnType<AnimationLibs['gsap']['matchMedia']>;

/**
 * Base de todas as diretivas de animação.
 *
 * - Só roda no navegador.
 * - Reage em tempo real ao `prefers-reduced-motion` do sistema: desligar → `revert()` (o elemento volta
 *   ao estado estático e visível); religar → recria a animação.
 * - Tudo é criado dentro de um `gsap.matchMedia()` com escopo no elemento, que limpa
 *   ScrollTriggers, tweens e SplitText ao trocar de breakpoint e no destroy.
 */
@Directive()
export abstract class MotionDirectiveBase {
  protected readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly animation = inject(ScrollAnimationService);
  private readonly motion = inject(MotionPreferenceService);
  private readonly zone = inject(NgZone);

  private mm: MatchMedia | null = null;
  /** Falso depois da primeira montagem; usado para não reanimar o que a pessoa já viu. */
  protected firstBuild = true;

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    effect(() => {
      const libs = this.animation.libs();
      const enabled = this.motion.motionEnabled();
      if (!libs) return;
      untracked(() =>
        this.zone.runOutsideAngular(() => {
          if (!enabled) {
            // Desligar é imediato: o conteúdo fica estático e visível na hora.
            this.rebuild(libs, false);
            return;
          }
          // Montar entra na fila (em fatias), lendo o estado mais recente na hora de rodar.
          this.animation.enqueue(() => {
            if (!this.destroyed) this.rebuild(libs, this.motion.motionEnabled());
          });
        }),
      );
    });

    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.teardown();
    });
  }

  private destroyed = false;

  /** Monta as animações. Use `mm.add(query, fn)` para separar desktop e mobile. */
  protected abstract build(libs: AnimationLibs, mm: MatchMedia): void;

  /** O elemento já está na tela ou acima dela? (para não reanimar ao religar o movimento) */
  protected alreadySeen(el: Element = this.host): boolean {
    // Na primeira montagem só pula a animação se o conteúdo já foi mostrado pelo failsafe.
    if (this.firstBuild && !document.documentElement.classList.contains('anim-failsafe')) return false;
    return el.getBoundingClientRect().top < window.innerHeight;
  }

  private rebuild(libs: AnimationLibs, enabled: boolean): void {
    this.teardown();
    if (enabled) {
      this.mm = libs.gsap.matchMedia(this.host);
      this.build(libs, this.mm);
    }
    this.firstBuild = false;
    // Estado inicial aplicado (ou nenhuma animação): o CSS deixa de esconder este elemento.
    this.host.classList.add('anim-ready');
  }

  private teardown(): void {
    this.mm?.revert();
    this.mm = null;
  }
}

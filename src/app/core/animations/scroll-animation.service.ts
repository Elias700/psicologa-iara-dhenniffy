import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, NgZone, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import type { SplitText as SplitTextType } from 'gsap/SplitText';
import type Lenis from 'lenis';

import { MotionPreferenceService } from './motion-preference.service';

export interface AnimationLibs {
  readonly gsap: typeof GsapType;
  readonly ScrollTrigger: typeof ScrollTriggerType;
  readonly SplitText: typeof SplitTextType;
}

/** Valores derivados do clone (docs/clone-analysis.md), em versão calma. */
export const MOTION = {
  ease: 'iaraOut', // cubic-bezier(0.25, 1, 0.5, 1) — "Out" do clone
  easeInOut: 'iaraInOut', // cubic-bezier(0.65, 0, 0.35, 1) — "InOut" suavizado
  duration: 0.9,
  stagger: 0.08,
  shift: 24,
  shiftMobile: 16,
  reducedFade: 0.15,
} as const;

export const BREAKPOINTS = {
  md: 768,
  lg: 1024,
} as const;

/**
 * Inicializa GSAP, ScrollTrigger, SplitText e Lenis só no navegador (import dinâmico),
 * fora da zona do Angular. Expõe `libs()` para as diretivas e cuida do smooth scroll
 * e da rolagem até as âncoras.
 */
@Injectable({ providedIn: 'root' })
export class ScrollAnimationService {
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly motion = inject(MotionPreferenceService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly libsSignal = signal<AnimationLibs | null>(null);
  readonly libs = this.libsSignal.asReadonly();

  private lenis: Lenis | null = null;
  private LenisCtor: typeof Lenis | null = null;
  private lenisTicker: ((time: number) => void) | null = null;
  private initPromise: Promise<void> | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (!this.isBrowser) return;

    // Smooth scroll só com movimento ativo e em telas ≥ 768px.
    effect(() => {
      const libs = this.libs();
      const enabled = this.motion.motionEnabled();
      if (!libs) return;
      this.zone.runOutsideAngular(() => {
        if (enabled && this.isWide()) this.startLenis(libs);
        else this.stopLenis(libs);
        this.scheduleRefresh();
      });
    });
  }

  /** Chamado uma vez pelo App em afterNextRender. */
  init(): Promise<void> {
    if (!this.isBrowser) return Promise.resolve();
    this.initPromise ??= this.zone.runOutsideAngular(() => this.load());
    return this.initPromise;
  }

  private async load(): Promise<void> {
    const [{ gsap }, { ScrollTrigger }, { SplitText }, { CustomEase }, lenisModule] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/SplitText'),
      import('gsap/CustomEase'),
      import('lenis'),
    ]);

    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
    CustomEase.create(MOTION.ease, '0.25,1,0.5,1');
    CustomEase.create(MOTION.easeInOut, '0.65,0,0.35,1');
    ScrollTrigger.config({ ignoreMobileResize: true });
    this.LenisCtor = lenisModule.default;

    const view = this.document.defaultView;
    view?.addEventListener('load', () => this.scheduleRefresh(), { once: true });
    void this.document.fonts?.ready.then(() => this.scheduleRefresh());

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    view?.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const libs = this.libs();
        if (!libs) return;
        if (this.motion.motionEnabled() && this.isWide()) this.startLenis(libs);
        else this.stopLenis(libs);
      }, 200);
    });

    this.libsSignal.set({ gsap, ScrollTrigger, SplitText });
    // As diretivas entram na fila (enqueue). Quando a fila esvazia, o CSS deixa de esconder
    // os elementos ([data-anim]) — cada um já está com o estado inicial aplicado pela GSAP.
    this.enqueue(() => undefined);
  }

  /**
   * Fila de montagem das animações, em fatias de ~12ms por tarefa.
   * Evita uma única tarefa longa no carregamento (TBT/INP no celular).
   */
  enqueue(task: () => void): void {
    this.queue.push(task);
    if (this.draining) return;
    this.draining = true;
    this.zone.runOutsideAngular(() => setTimeout(this.drain, 0));
  }

  private readonly queue: Array<() => void> = [];
  private draining = false;
  private readonly drain = (): void => {
    const start = performance.now();
    while (this.queue.length && performance.now() - start < 12) {
      try {
        this.queue.shift()!();
      } catch (error) {
        console.error(error);
      }
    }
    if (this.queue.length) {
      setTimeout(this.drain, 0);
      return;
    }
    this.draining = false;
    const root = this.document.documentElement;
    if (!root.classList.contains('motion-ready')) {
      root.classList.add('motion-ready');
      this.watchStuckElements();
    }
    this.scheduleRefresh();
  };

  /**
   * Garantia contra conteúdo preso: se um elemento animável ficar 1,2s na tela sem ter sido
   * iniciado (ex.: falha ao hidratar uma seção), ele é mostrado sem animação.
   */
  private watchStuckElements(): void {
    if (!('IntersectionObserver' in window)) return;
    const timers = new Map<Element, ReturnType<typeof setTimeout>>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target;
        if (el.classList.contains('anim-ready')) {
          observer.unobserve(el);
          continue;
        }
        if (entry.isIntersecting && !timers.has(el)) {
          timers.set(
            el,
            setTimeout(() => {
              el.classList.add('anim-ready');
              observer.unobserve(el);
            }, 1200),
          );
        } else if (!entry.isIntersecting && timers.has(el)) {
          clearTimeout(timers.get(el));
          timers.delete(el);
        }
      }
    });
    this.document.querySelectorAll('[data-anim]:not(.anim-ready)').forEach((el) => observer.observe(el));
  }

  /** Recalcula os gatilhos (depois de imagens, fontes ou mudanças de layout). */
  scheduleRefresh(): void {
    const libs = this.libs();
    if (!libs) return;
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => {
      // O refresh reposiciona o scroll e cancelaria uma rolagem suave em andamento (âncoras).
      if (this.programmaticScroll) {
        this.refreshPending = true;
        return;
      }
      libs.ScrollTrigger.refresh();
    }, 120);
  }

  private programmaticScroll = false;
  private refreshPending = false;

  isWide(min: number = BREAKPOINTS.md): boolean {
    return (this.document.defaultView?.innerWidth ?? 0) >= min;
  }

  /**
   * Rola até uma seção compensando o header fixo e leva o foco para ela.
   * Com movimento reduzido, o salto é imediato.
   */
  scrollToSection(id: string): void {
    if (!this.isBrowser) return;
    const target = this.document.getElementById(id);
    if (!target) return;

    const view = this.document.defaultView!;
    // O <html> tem scroll-padding-top = altura do header + 1rem (vale também sem JS).
    // O Lenis já considera esse valor; na rolagem nativa calculamos o mesmo deslocamento.
    const scrollPadding = parseFloat(getComputedStyle(this.document.documentElement).scrollPaddingTop) || 88;
    const focusTarget = () => {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };

    view.history.replaceState(null, '', `#${id}`);

    this.programmaticScroll = true;
    const finish = () => {
      if (!this.programmaticScroll) return;
      this.programmaticScroll = false;
      // Se algo mudou o layout no caminho (ex.: uma seção hidratou), corrige sem animação.
      const drift = target.getBoundingClientRect().top - scrollPadding;
      if (Math.abs(drift) > 4) view.scrollTo({ top: view.scrollY + drift, behavior: 'auto' });
      focusTarget();
      if (this.refreshPending) {
        this.refreshPending = false;
        this.scheduleRefresh();
      }
    };

    if (this.lenis && this.motion.motionEnabled()) {
      this.lenis.scrollTo(target, { duration: 1.0, onComplete: finish });
      return;
    }

    const smooth = this.motion.motionEnabled();
    const top = target.getBoundingClientRect().top + view.scrollY - scrollPadding;
    view.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
    if (!smooth) {
      finish();
      return;
    }
    // 'scrollend' quando existe; senão, um tempo máximo.
    const fallback = setTimeout(finish, 1500);
    view.addEventListener(
      'scrollend',
      () => {
        clearTimeout(fallback);
        finish();
      },
      { once: true },
    );
  }

  /** Trava a rolagem da página (menu mobile aberto). */
  setScrollLocked(locked: boolean): void {
    if (!this.isBrowser) return;
    this.document.documentElement.style.overflow = locked ? 'hidden' : '';
    if (locked) this.lenis?.stop();
    else this.lenis?.start();
  }

  private startLenis(libs: AnimationLibs): void {
    if (this.lenis || !this.LenisCtor) return;
    const lenis = new this.LenisCtor({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', libs.ScrollTrigger.update);
    this.lenisTicker = (time: number) => lenis.raf(time * 1000);
    libs.gsap.ticker.add(this.lenisTicker);
    libs.gsap.ticker.lagSmoothing(0);
    this.lenis = lenis;
  }

  private stopLenis(libs: AnimationLibs): void {
    if (!this.lenis) return;
    if (this.lenisTicker) libs.gsap.ticker.remove(this.lenisTicker);
    libs.gsap.ticker.lagSmoothing(500, 33);
    this.lenis.destroy();
    this.lenis = null;
    this.lenisTicker = null;
  }
}

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  Injectable,
  NgZone,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
} from '@angular/core';

/** 'hidden' esconde só o trilho lateral (o selo fica no tema claro). */
export type HeaderTheme = 'light' | 'dark' | 'hidden';

interface ThemeZone {
  readonly el: HTMLElement;
  readonly theme: () => HeaderTheme;
}

/**
 * Cor do selo e do trilho lateral conforme a cena que está por baixo (derivado de `initThemeChange`).
 * Não é movimento: funciona também com movimento reduzido.
 */
@Injectable({ providedIn: 'root' })
export class HeaderThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly zones = new Set<ThemeZone>();
  private listening = false;
  private frame = 0;

  register(entry: ThemeZone): () => void {
    this.zones.add(entry);
    this.listen();
    this.schedule();
    return () => {
      this.zones.delete(entry);
      this.schedule();
    };
  }

  private listen(): void {
    if (this.listening || !this.isBrowser) return;
    this.listening = true;
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', () => this.schedule(), { passive: true });
      window.addEventListener('resize', () => this.schedule(), { passive: true });
    });
  }

  private schedule(): void {
    if (!this.isBrowser || this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      const root = this.document.documentElement;
      const header = this.themeAt(56);
      root.dataset['headerTheme'] = header === 'hidden' ? 'light' : header;
      root.dataset['railTheme'] = this.themeAt(window.innerHeight / 2);
    });
  }

  private themeAt(y: number): HeaderTheme {
    for (const { el, theme } of this.zones) {
      const { top, bottom } = el.getBoundingClientRect();
      if (top <= y && bottom > y) return theme();
    }
    return 'light';
  }
}

/** Uso: <section appHeaderTheme="dark"> */
@Directive({ selector: '[appHeaderTheme]' })
export class HeaderThemeDirective {
  readonly theme = input.required<HeaderTheme>({ alias: 'appHeaderTheme' });

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const service = inject(HeaderThemeService);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => destroyRef.onDestroy(service.register({ el, theme: this.theme })));
  }
}

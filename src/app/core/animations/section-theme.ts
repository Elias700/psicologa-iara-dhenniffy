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

export type SectionBg = 'bg' | 'surface' | 'sage' | 'deep';
export type HeaderTheme = 'light' | 'dark';

interface Entry {
  readonly el: HTMLElement;
  readonly bg: () => SectionBg;
  readonly header: () => HeaderTheme;
}

const BG_VAR: Record<SectionBg, string> = {
  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  sage: 'var(--color-sage)',
  deep: 'var(--color-deep)',
};

/**
 * Troca de tema por seção (derivada de `initThemeChange` do clone).
 * - `data-header-theme` no <html>: o header fica claro ou verde conforme a seção embaixo dele.
 * - `--page-bg`: cor de fundo da página, que muda de forma gradual (transição só com movimento ativo)
 *   entre tons próximos (creme, areia, sálvia).
 */
@Injectable({ providedIn: 'root' })
export class SectionThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly entries = new Set<Entry>();
  private listening = false;
  private frame = 0;
  private lastBg = '';
  private lastHeader = '';

  register(entry: Entry): () => void {
    this.entries.add(entry);
    this.listen();
    this.schedule();
    return () => {
      this.entries.delete(entry);
      this.schedule();
    };
  }

  private listen(): void {
    if (this.listening || !this.isBrowser) return;
    this.listening = true;
    this.zone.runOutsideAngular(() => {
      const view = this.document.defaultView!;
      view.addEventListener('scroll', () => this.schedule(), { passive: true });
      view.addEventListener('resize', () => this.schedule(), { passive: true });
    });
  }

  private schedule(): void {
    if (!this.isBrowser || this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.update();
    });
  }

  private update(): void {
    const view = this.document.defaultView!;
    const root = this.document.documentElement;
    const headerLine = 32;
    const middle = view.innerHeight * 0.5;
    let bg: SectionBg | null = null;
    let header: HeaderTheme | null = null;

    for (const entry of this.entries) {
      const rect = entry.el.getBoundingClientRect();
      if (bg === null && rect.top <= middle && rect.bottom > middle && entry.bg() !== 'deep') bg = entry.bg();
      if (header === null && rect.top <= headerLine && rect.bottom > headerLine) header = entry.header();
    }

    const nextBg = BG_VAR[bg ?? 'bg'];
    if (bg && nextBg !== this.lastBg) {
      root.style.setProperty('--page-bg', nextBg);
      this.lastBg = nextBg;
    }
    const nextHeader = header ?? 'light';
    if (nextHeader !== this.lastHeader) {
      root.setAttribute('data-header-theme', nextHeader);
      this.lastHeader = nextHeader;
    }
  }
}

/** Uso: <section appSectionTheme="sage" headerTheme="light"> */
@Directive({
  selector: '[appSectionTheme]',
  host: { '[attr.data-bg]': 'bg()' },
})
export class SectionThemeDirective {
  readonly bg = input<SectionBg>('bg', { alias: 'appSectionTheme' });
  readonly headerTheme = input<HeaderTheme>('light');

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const service = inject(SectionThemeService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const unregister = service.register({ el, bg: this.bg, header: this.headerTheme });
      destroyRef.onDestroy(unregister);
    });
  }
}

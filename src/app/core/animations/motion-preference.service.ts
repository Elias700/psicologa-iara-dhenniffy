import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';

/**
 * Preferência de movimento: segue o `prefers-reduced-motion` do sistema, em tempo real.
 * O script inline do index.html aplica a mesma regra antes da primeira pintura.
 */
@Injectable({ providedIn: 'root' })
export class MotionPreferenceService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly enabled = signal(true);

  readonly motionEnabled = this.enabled.asReadonly();

  constructor() {
    if (!this.isBrowser) return;

    const query = this.reducedQuery();
    this.enabled.set(!query?.matches);
    query?.addEventListener?.('change', (event) => this.enabled.set(!event.matches));

    effect(() => {
      this.document.documentElement.setAttribute('data-motion', this.enabled() ? 'full' : 'reduced');
    });
  }

  /** matchMedia pode não existir (navegadores antigos, jsdom nos testes). */
  private reducedQuery(): MediaQueryList | null {
    const view = this.document.defaultView;
    return typeof view?.matchMedia === 'function' ? view.matchMedia('(prefers-reduced-motion: reduce)') : null;
  }
}

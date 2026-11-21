import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';

type MotionChoice = 'full' | 'reduced';

const STORAGE_KEY = 'iara-motion';

/**
 * Preferência de movimento do visitante.
 *
 * `motionEnabled` considera (1) a escolha salva pelo botão "Reduzir movimento" e,
 * se não houver escolha, (2) o `prefers-reduced-motion` do sistema.
 * O script inline do index.html aplica a mesma regra antes da primeira pintura.
 */
@Injectable({ providedIn: 'root' })
export class MotionPreferenceService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly userChoice = signal<MotionChoice | null>(this.readChoice());
  private readonly systemReduced = signal(this.readSystemReduced());

  readonly motionEnabled = computed(() => {
    const choice = this.userChoice();
    return choice ? choice === 'full' : !this.systemReduced();
  });

  constructor() {
    if (!this.isBrowser) return;

    const query = this.reducedQuery();
    query?.addEventListener?.('change', (event) => this.systemReduced.set(event.matches));

    effect(() => {
      this.document.documentElement.setAttribute(
        'data-motion',
        this.motionEnabled() ? 'full' : 'reduced',
      );
    });
  }

  toggle(): void {
    const next: MotionChoice = this.motionEnabled() ? 'reduced' : 'full';
    this.userChoice.set(next);
    if (!this.isBrowser) return;
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Armazenamento indisponível (modo privado etc.). A escolha vale só nesta visita.
    }
  }

  private readChoice(): MotionChoice | null {
    if (!this.isBrowser) return null;
    try {
      const value = this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      return value === 'full' || value === 'reduced' ? value : null;
    } catch {
      return null;
    }
  }

  private readSystemReduced(): boolean {
    if (!this.isBrowser) return false;
    return this.reducedQuery()?.matches ?? false;
  }

  /** matchMedia pode não existir (navegadores antigos, jsdom nos testes). */
  private reducedQuery(): MediaQueryList | null {
    const view = this.document.defaultView;
    return typeof view?.matchMedia === 'function' ? view.matchMedia('(prefers-reduced-motion: reduce)') : null;
  }
}

import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { ScrollAnimationService } from '../../core/animations/scroll-animation.service';
import { ScrollProgressDirective } from '../../core/animations/scroll-progress.directive';
import { NAV, PROFESSIONAL } from '../../core/data/site-content';
import { IconComponent } from '../icon/icon.component';
import { SealComponent } from '../seal/seal.component';

@Component({
  selector: 'app-header',
  imports: [IconComponent, ScrollProgressDirective, SealComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '(document:keydown.escape)': 'closeMenu(true)',
  },
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly animation = inject(ScrollAnimationService);

  protected readonly nav = NAV;
  protected readonly pro = PROFESSIONAL;
  protected readonly menuOpen = signal(false);

  private readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');
  private readonly menuPanel = viewChild<ElementRef<HTMLElement>>('menuPanel');

  protected toggleMenu(): void {
    if (this.menuOpen()) {
      this.closeMenu(true);
      return;
    }
    this.menuOpen.set(true);
    this.animation.setScrollLocked(true);
    // Foco no primeiro link do menu depois que ele aparece.
    requestAnimationFrame(() => this.menuPanel()?.nativeElement.querySelector<HTMLElement>('a, button')?.focus());
  }

  protected closeMenu(returnFocus = false): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    this.animation.setScrollLocked(false);
    if (returnFocus) this.menuButton()?.nativeElement.focus();
  }

  /** Trap de foco dentro do menu mobile (Tab e Shift+Tab circulam entre botão e itens). */
  protected trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.menuOpen()) return;
    const panel = this.menuPanel()?.nativeElement;
    const button = this.menuButton()?.nativeElement;
    if (!panel || !button) return;
    const focusables = [button, ...Array.from(panel.querySelectorAll<HTMLElement>('a[href], button'))];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = this.document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  protected goTo(event: MouseEvent, id: string): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    this.closeMenu();
    const onHome = this.router.url.split('#')[0].split('?')[0] === '/';
    if (onHome) {
      this.animation.scrollToSection(id);
    } else {
      // Vindo de outra página: as seções da home renderizam logo após a navegação.
      // Espera a seção existir (e o layout assentar) antes de rolar.
      void this.router.navigate(['/'], { fragment: id }).then(() => this.scrollWhenReady(id));
    }
  }

  private scrollWhenReady(id: string, attempt = 0): void {
    const ready = !!this.document.getElementById(id) && !!this.document.getElementById('contato');
    if (ready || attempt > 120) {
      requestAnimationFrame(() => this.animation.scrollToSection(id));
      return;
    }
    requestAnimationFrame(() => this.scrollWhenReady(id, attempt + 1));
  }
}

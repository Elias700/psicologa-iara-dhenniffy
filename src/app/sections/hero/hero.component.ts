import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AnchorDirective } from '../../core/animations/anchor.directive';
import { ScrollAnimationService } from '../../core/animations/scroll-animation.service';
import { HERO, PHOTOS, PROFESSIONAL, ngSrcset, whatsappLink } from '../../core/data/site-content';
import { IconComponent } from '../../shared/icon/icon.component';
import { SprigComponent } from '../../shared/sprig/sprig.component';

/**
 * Cena de abertura. No desktop fica fixa enquanto a cúpula (app-manifesto) sobe por cima.
 * A entrada é em CSS puro, para não depender do JS nem atrasar o LCP.
 */
@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, AnchorDirective, IconComponent, SprigComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  host: { '(focusin)': 'revealOnFocus()' },
})
export class HeroComponent {
  private readonly animation = inject(ScrollAnimationService);

  protected readonly content = HERO;
  protected readonly pro = PROFESSIONAL;
  protected readonly photo = PHOTOS.hero;
  protected readonly ngSrcset = ngSrcset(PHOTOS.hero);
  protected readonly sizes = '(min-width: 64rem) 62vh, 88vw';
  protected readonly whatsapp = whatsappLink();

  /** Quem volta com Shift+Tab não pode cair num link escondido sob a cúpula (WCAG 2.4.11). */
  protected revealOnFocus(): void {
    if (window.scrollY > window.innerHeight * 0.35) this.animation.scrollToTop();
  }
}

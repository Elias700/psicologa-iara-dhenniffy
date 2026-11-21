import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AnchorDirective } from '../../core/animations/anchor.directive';
import { SectionThemeDirective } from '../../core/animations/section-theme';
import { HERO, PHOTOS, PROFESSIONAL, whatsappLink } from '../../core/data/site-content';
import { IconComponent } from '../../shared/icon/icon.component';

/**
 * Hero. A entrada é em CSS puro (classes .hero-enter e .hero-mask em styles.scss) para não
 * depender do JS e não atrasar o LCP. Com movimento reduzido, nada se move.
 */
@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, AnchorDirective, SectionThemeDirective, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  protected readonly content = HERO;
  protected readonly pro = PROFESSIONAL;
  protected readonly photo = PHOTOS.hero;
  protected readonly ngSrcset = PHOTOS.hero.widths.map((w) => `${w}w`).join(', ');
  protected readonly whatsapp = whatsappLink();
  protected readonly sizes = '(min-width: 64rem) 30rem, (min-width: 48rem) 40vw, 82vw';
}

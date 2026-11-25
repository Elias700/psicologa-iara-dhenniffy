import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeaderThemeDirective } from '../../core/animations/header-theme';
import { ParallaxDirective } from '../../core/animations/parallax.directive';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { PHOTOS, PROFESSIONAL, QUOTE, ngSrcset } from '../../core/data/site-content';

/** Citação da Iara em tela cheia. */
@Component({
  selector: 'app-quote',
  imports: [NgOptimizedImage, HeaderThemeDirective, ParallaxDirective, SplitTextDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="quote on-dark" appHeaderTheme="dark" aria-label="Uma frase da Iara">
      <figure class="figure">
        <img
          appParallax="4"
          [ngSrc]="photo.base + '-' + photo.width"
          [ngSrcset]="ngSrcset"
          [sizes]="sizes"
          [width]="photo.width"
          [height]="photo.height"
          [alt]="photo.alt"
        />
      </figure>
      <figure class="container words">
        <blockquote>
          <p appSplitText>{{ content.text }}</p>
          <p class="em" appSplitText>{{ content.em }}</p>
        </blockquote>
        <figcaption>{{ pro.name }}, {{ pro.role.toLowerCase() }}</figcaption>
      </figure>
    </section>
  `,
  styleUrl: './quote.component.scss',
})
export class QuoteComponent {
  protected readonly content = QUOTE;
  protected readonly pro = PROFESSIONAL;
  protected readonly photo = PHOTOS.quote;
  protected readonly ngSrcset = ngSrcset(PHOTOS.quote);
  protected readonly sizes = '(min-width: 64rem) 46vw, 80vw';
}

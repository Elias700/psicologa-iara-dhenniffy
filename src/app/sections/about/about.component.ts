import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ImageMaskDirective } from '../../core/animations/image-mask.directive';
import { ParallaxDirective } from '../../core/animations/parallax.directive';
import { RevealDirective } from '../../core/animations/reveal.directive';
import { ScrubWordsDirective } from '../../core/animations/scrub-words.directive';
import { SectionThemeDirective } from '../../core/animations/section-theme';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { ABOUT, PHOTOS, PROFESSIONAL, srcset } from '../../core/data/site-content';

@Component({
  selector: 'app-about',
  imports: [
    NgOptimizedImage,
    ImageMaskDirective,
    ParallaxDirective,
    RevealDirective,
    ScrubWordsDirective,
    SectionThemeDirective,
    SplitTextDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  protected readonly content = ABOUT;
  protected readonly pro = PROFESSIONAL;
  protected readonly photo = PHOTOS.about;
  protected readonly avif = srcset(PHOTOS.about, 'avif');
  protected readonly ngSrcset = PHOTOS.about.widths.map((w) => `${w}w`).join(', ');
  protected readonly sizes = '(min-width: 64rem) 28rem, (min-width: 48rem) 40vw, 90vw';
  protected readonly hasDetails = !!(PROFESSIONAL.approach || PROFESSIONAL.education.length || PROFESSIONAL.ageRange);
}

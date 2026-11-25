import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ImageMaskDirective } from '../../core/animations/image-mask.directive';
import { RevealDirective } from '../../core/animations/reveal.directive';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { ABOUT, PHOTOS, PROFESSIONAL, ngSrcset } from '../../core/data/site-content';

interface Fact {
  readonly label: string;
  readonly values: readonly string[];
}

/** Título atravessado pelo retrato em arco, com a ficha profissional ao lado do texto. */
@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage, ImageMaskDirective, RevealDirective, SplitTextDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  protected readonly content = ABOUT;
  protected readonly photo = PHOTOS.about;
  protected readonly ngSrcset = ngSrcset(PHOTOS.about);
  protected readonly sizes = '(min-width: 64rem) 36vw, 100vw';

  // Só mostra o que já foi confirmado em site-content.ts.
  protected readonly facts: readonly Fact[] = [
    { label: 'Registro', values: [`${PROFESSIONAL.role}, ${PROFESSIONAL.crp}`] },
    { label: 'Atendimento', values: ['Individual e online, para todo o Brasil'] },
    { label: 'Quem eu atendo', values: PROFESSIONAL.ageRange ? [PROFESSIONAL.ageRange] : [] },
    { label: 'Abordagem', values: PROFESSIONAL.approach ? [PROFESSIONAL.approach] : [] },
    { label: 'Formação', values: PROFESSIONAL.education },
  ].filter((fact) => fact.values.length > 0);
}

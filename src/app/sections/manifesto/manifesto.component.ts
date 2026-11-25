import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeaderThemeDirective } from '../../core/animations/header-theme';
import { ScrubWordsDirective } from '../../core/animations/scrub-words.directive';
import { MANIFESTO } from '../../core/data/site-content';
import { SprigComponent } from '../../shared/sprig/sprig.component';

/** Cúpula verde que sobe sobre o hero, com a mensagem central em curva. */
@Component({
  selector: 'app-manifesto',
  imports: [HeaderThemeDirective, ScrubWordsDirective, SprigComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="manifesto on-dark" aria-labelledby="manifesto-title">
      <div class="zone" appHeaderTheme="dark"></div>
      <svg class="arc" viewBox="0 0 1000 500" aria-hidden="true" focusable="false">
        <path id="manifesto-arc" d="M95 500A405 405 0 0 1 905 500" fill="none" />
        <text text-anchor="middle">
          <textPath href="#manifesto-arc" startOffset="50%">{{ content.title }}</textPath>
        </text>
      </svg>
      <div class="body container">
        <h2 id="manifesto-title" class="visually-hidden">{{ content.title }}</h2>
        <span class="stem" aria-hidden="true"></span>
        <p class="text" appScrubWords>{{ content.text }}</p>
        <app-sprig class="sprig" />
      </div>
    </section>
  `,
  styleUrl: './manifesto.component.scss',
})
export class ManifestoComponent {
  protected readonly content = MANIFESTO;
}

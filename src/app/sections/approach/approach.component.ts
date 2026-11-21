import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealDirective } from '../../core/animations/reveal.directive';
import { SectionThemeDirective } from '../../core/animations/section-theme';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { PILLARS } from '../../core/data/site-content';

/** "Como é a terapia comigo" — pilares de um espaço seguro (rascunho a confirmar com a Iara). */
@Component({
  selector: 'app-approach',
  imports: [RevealDirective, SectionThemeDirective, SplitTextDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="como-e" class="section" appSectionTheme="sage" aria-labelledby="como-e-title">
      <div class="container">
        <header class="section-head">
          <p class="eyebrow" appReveal>{{ content.eyebrow }}</p>
          <h2 id="como-e-title" appSplitText>{{ content.title }}</h2>
        </header>

        <ul role="list" class="pillars" appReveal [revealChildren]="true">
          @for (item of content.items; track item.title) {
            <li class="pillar">
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styleUrl: './approach.component.scss',
})
export class ApproachComponent {
  protected readonly content = PILLARS;
}

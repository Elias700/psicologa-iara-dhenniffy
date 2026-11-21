import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealDirective } from '../../core/animations/reveal.directive';
import { SectionThemeDirective } from '../../core/animations/section-theme';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { AUDIENCES } from '../../core/data/site-content';

/**
 * "Para quem é". Cards com reveal em sequência (stagger).
 * O scroll horizontal do clone foi descartado (ver docs/clone-analysis.md, item 22):
 * atrapalha a navegação por teclado e pode desorientar.
 */
@Component({
  selector: 'app-who-i-help',
  imports: [RevealDirective, SectionThemeDirective, SplitTextDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="para-quem" class="section" appSectionTheme="bg" aria-labelledby="para-quem-title">
      <div class="container">
        <header class="section-head">
          <p class="eyebrow" appReveal>{{ content.eyebrow }}</p>
          <h2 id="para-quem-title" appSplitText>{{ content.title }}</h2>
          <p appReveal>{{ content.intro }}</p>
        </header>

        <ul role="list" class="cards" appReveal [revealChildren]="true">
          @for (item of content.items; track item.id) {
            <li class="card" [class.card--open]="item.id === 'outras'">
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
              @if (item.id === 'outras' && content.otherExamples.length) {
                <ul class="examples">
                  @for (example of content.otherExamples; track example) {
                    <li>{{ example }}</li>
                  }
                </ul>
              }
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styleUrl: './who-i-help.component.scss',
})
export class WhoIHelpComponent {
  protected readonly content = AUDIENCES;
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealDirective } from '../../core/animations/reveal.directive';
import { SectionThemeDirective } from '../../core/animations/section-theme';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { FAQ } from '../../core/data/site-content';

/**
 * Dúvidas frequentes em acordeão nativo (<details>/<summary>): acessível por teclado e leitor
 * de tela sem JS. O schema FAQPage é gerado a partir do mesmo conteúdo (core/seo/json-ld.ts).
 */
@Component({
  selector: 'app-faq',
  imports: [RevealDirective, SectionThemeDirective, SplitTextDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="duvidas" class="section" appSectionTheme="surface" aria-labelledby="duvidas-title">
      <div class="container narrow">
        <header class="section-head">
          <p class="eyebrow" appReveal>{{ content.eyebrow }}</p>
          <h2 id="duvidas-title" appSplitText>{{ content.title }}</h2>
        </header>

        <div class="list" appReveal [revealChildren]="true">
          @for (item of content.items; track item.question) {
            <details class="item">
              <summary>
                <h3 class="question">{{ item.question }}</h3>
                <span class="icon" aria-hidden="true"></span>
              </summary>
              <div class="answer">
                <p>{{ item.answer }}</p>
              </div>
            </details>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './faq.component.scss',
})
export class FaqComponent {
  protected readonly content = FAQ;
}

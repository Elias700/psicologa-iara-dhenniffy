import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealDirective } from '../../core/animations/reveal.directive';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { FAQ } from '../../core/data/site-content';

/**
 * Dúvidas em acordeão nativo (<details>/<summary>): funciona por teclado, leitor de tela e sem JS.
 * O schema FAQPage sai do mesmo conteúdo (core/seo/json-ld.ts).
 */
@Component({
  selector: 'app-faq',
  imports: [RevealDirective, SplitTextDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="duvidas" class="section" aria-labelledby="duvidas-title">
      <div class="container grid">
        <div class="head">
          <h2 id="duvidas-title" appSplitText>
            {{ content.title.start }} <em>{{ content.title.em }}</em>
          </h2>
        </div>

        <div class="list" appReveal>
          @for (item of content.items; track item.question) {
            <details>
              <summary>
                <h3>{{ item.question }}</h3>
                <span class="icon" aria-hidden="true"></span>
              </summary>
              <p>{{ item.answer }}</p>
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

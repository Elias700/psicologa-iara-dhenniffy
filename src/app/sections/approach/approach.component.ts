import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealDirective } from '../../core/animations/reveal.directive';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { PILLARS } from '../../core/data/site-content';

/** Pilares do atendimento em quatro quadrantes, com o símbolo da marca no encontro das linhas. */
@Component({
  selector: 'app-approach',
  imports: [RevealDirective, SplitTextDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="como-e" class="section" aria-labelledby="como-e-title">
      <div class="container">
        <h2 id="como-e-title" appSplitText>
          {{ content.title.start }} <em>{{ content.title.em }}</em>
        </h2>

        <ul role="list" class="quadrants">
          @for (item of content.items; track item.title) {
            <li>
              <div appReveal>
                <h3>{{ item.title }}</h3>
                <p>{{ item.text }}</p>
              </div>
            </li>
          }
          <li class="mark" role="presentation" aria-hidden="true">
            <img src="images/simbolo-iara.webp" width="139" height="112" alt="" loading="lazy" />
          </li>
        </ul>
      </div>
    </section>
  `,
  styleUrl: './approach.component.scss',
})
export class ApproachComponent {
  protected readonly content = PILLARS;
}

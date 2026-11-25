import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeaderThemeDirective } from '../../core/animations/header-theme';
import { HorizontalScrollDirective } from '../../core/animations/horizontal-scroll.directive';
import { AUDIENCES } from '../../core/data/site-content';
import { SprigComponent } from '../../shared/sprig/sprig.component';

/**
 * Colunata de arcos. No desktop, com movimento ativo, atravessa a tela na horizontal conforme a rolagem;
 * nos outros casos é uma lista comum. Não há elementos focáveis dentro, então o teclado não é afetado.
 */
@Component({
  selector: 'app-who-i-help',
  imports: [HeaderThemeDirective, HorizontalScrollDirective, SprigComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="para-quem"
      class="scene"
      appHorizontalScroll=".track"
      appHeaderTheme="hidden"
      aria-labelledby="para-quem-title"
    >
      <div class="viewport">
        <div class="track">
          <header class="intro">
            <h2 id="para-quem-title">
              {{ content.title.start }} <em>{{ content.title.em }}</em>
            </h2>
            <p class="lead">{{ content.intro }}</p>
          </header>

          <ul role="list" class="arches">
            @for (item of content.items; track item.id) {
              <li class="arch">
                <app-sprig class="sprig" />
                <h3>
                  {{ item.name }}
                  <span class="visually-hidden">: {{ item.title }}</span>
                </h3>
                <p>{{ item.text }}</p>
                @if (item.id === 'outras' && content.otherExamples.length) {
                  <p>{{ content.otherExamples.join(', ') }}.</p>
                }
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  styleUrl: './who-i-help.component.scss',
})
export class WhoIHelpComponent {
  protected readonly content = AUDIENCES;
}

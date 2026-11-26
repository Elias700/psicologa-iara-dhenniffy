import { ChangeDetectionStrategy, Component } from '@angular/core';

import { whatsappLink } from '../../core/data/site-content';
import { IconComponent } from '../icon/icon.component';

/**
 * Botão flutuante de WhatsApp, discreto: sem pulsar, sem chamar atenção.
 * Fica sempre visível no canto inferior direito.
 * Enquanto o número não estiver configurado em site-content.ts, leva à seção de contato.
 */
@Component({
  selector: 'app-whatsapp-fab',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (link) {
      <a class="fab" [href]="link" target="_blank" rel="noopener">
        <app-icon name="whatsapp" />
        <span class="text">WhatsApp</span>
        <span class="visually-hidden"> — conversar com a Iara (abre o WhatsApp)</span>
      </a>
    } @else {
      <a class="fab" href="/#contato">
        <app-icon name="whatsapp" />
        <span class="text">WhatsApp</span>
        <span class="visually-hidden"> — ir para o formulário de contato</span>
      </a>
    }
  `,
  styleUrl: './whatsapp-fab.component.scss',
})
export class WhatsappFabComponent {
  protected readonly link = whatsappLink();
}

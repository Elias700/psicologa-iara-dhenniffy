import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';

import { whatsappLink } from '../../core/data/site-content';
import { IconComponent } from '../icon/icon.component';

/**
 * Botão flutuante de WhatsApp, discreto: sem pulsar, sem chamar atenção.
 * Aparece só depois que a pessoa passa do hero e some perto do contato (onde já há o botão principal).
 * Só existe se o número estiver configurado em site-content.ts.
 */
@Component({
  selector: 'app-whatsapp-fab',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (link) {
      <a class="fab" [class.is-visible]="visible()" [attr.tabindex]="visible() ? null : -1"
        [attr.aria-hidden]="visible() ? null : 'true'" [href]="link" target="_blank" rel="noopener">
        <app-icon name="whatsapp" />
        <span class="text">WhatsApp</span>
        <span class="visually-hidden"> — conversar com a Iara (abre o WhatsApp)</span>
      </a>
    }
  `,
  styleUrl: './whatsapp-fab.component.scss',
})
export class WhatsappFabComponent {
  protected readonly link = whatsappLink();
  protected readonly visible = signal(false);

  constructor() {
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!this.link || !('IntersectionObserver' in window)) return;
      const hero = document.getElementById('inicio');
      const contact = document.getElementById('contato');
      let heroVisible = true;
      let contactVisible = false;
      const update = () => this.visible.set(!heroVisible && !contactVisible);
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === hero) heroVisible = entry.isIntersecting;
          if (entry.target === contact) contactVisible = entry.isIntersecting;
        }
        update();
      });
      if (hero) observer.observe(hero);
      if (contact) observer.observe(contact);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}

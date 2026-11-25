import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ScrollAnimationService } from './core/animations/scroll-animation.service';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { WhatsappFabComponent } from './shared/whatsapp-fab/whatsapp-fab.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, WhatsappFabComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <app-header />
    <main id="conteudo" tabindex="-1">
      <router-outlet />
    </main>
    @defer (hydrate on viewport; on immediate) {
      <app-footer />
    }
    <app-whatsapp-fab />
  `,
  styles: `
    .skip-link {
      position: fixed;
      top: 0.5rem;
      left: 0.5rem;
      z-index: 100;
      padding: 0.75rem 1.25rem;
      border-radius: 999px;
      background: var(--forest-deep);
      color: var(--on-dark);
      font-weight: 700;
      transform: translateY(-200%);
    }
    .skip-link:focus {
      transform: none;
    }
    main:focus {
      outline: none;
    }
  `,
})
export class App {
  constructor() {
    const animation = inject(ScrollAnimationService);

    afterNextRender(() => animation.initOnIntent());
  }
}

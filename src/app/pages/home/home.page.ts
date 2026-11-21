import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SITE } from '../../core/data/site-content';
import { SeoService } from '../../core/seo/seo.service';
import { AboutComponent } from '../../sections/about/about.component';
import { ApproachComponent } from '../../sections/approach/approach.component';
import { ContactComponent } from '../../sections/contact/contact.component';
import { FaqComponent } from '../../sections/faq/faq.component';
import { HeroComponent } from '../../sections/hero/hero.component';
import { HowItWorksComponent } from '../../sections/how-it-works/how-it-works.component';
import { WhoIHelpComponent } from '../../sections/who-i-help/who-i-help.component';

/**
 * Ordem das seções: segue o caminho de quem chega pelo Instagram —
 * quem é (hero, sobre) → é para mim? (para quem, como é) → como começo? (como funciona, dúvidas) → contato.
 */
@Component({
  selector: 'app-home-page',
  imports: [
    HeroComponent,
    AboutComponent,
    WhoIHelpComponent,
    ApproachComponent,
    HowItWorksComponent,
    FaqComponent,
    ContactComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // O HTML de todas as seções vem completo do prerender. As de baixo só hidratam (ganham JS e
  // animações) quando chegam perto da tela. Em navegação no cliente (sem SSR), renderizam na hora.
  template: `
    <app-hero />
    @defer (hydrate on viewport; on immediate) {
      <app-about />
    }
    @defer (hydrate on viewport; on immediate) {
      <app-who-i-help />
    }
    @defer (hydrate on viewport; on immediate) {
      <app-approach />
    }
    @defer (hydrate on viewport; on immediate) {
      <app-how-it-works />
    }
    @defer (hydrate on viewport; on immediate) {
      <app-faq />
    }
    @defer (hydrate on viewport; on immediate) {
      <app-contact />
    }
  `,
})
export class HomePage {
  constructor() {
    inject(SeoService).apply({
      title: SITE.title,
      description: SITE.description,
      path: '/',
      jsonLd: true,
    });
  }
}

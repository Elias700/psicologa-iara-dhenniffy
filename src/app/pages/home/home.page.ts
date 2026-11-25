import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SITE } from '../../core/data/site-content';
import { SeoService } from '../../core/seo/seo.service';
import { AboutComponent } from '../../sections/about/about.component';
import { ApproachComponent } from '../../sections/approach/approach.component';
import { ContactComponent } from '../../sections/contact/contact.component';
import { FaqComponent } from '../../sections/faq/faq.component';
import { HeroComponent } from '../../sections/hero/hero.component';
import { HowItWorksComponent } from '../../sections/how-it-works/how-it-works.component';
import { ManifestoComponent } from '../../sections/manifesto/manifesto.component';
import { QuoteComponent } from '../../sections/quote/quote.component';
import { WhoIHelpComponent } from '../../sections/who-i-help/who-i-help.component';

/**
 * O HTML de todas as seções vem completo do prerender. As que ficam abaixo do hero só hidratam
 * quando chegam perto da tela. Em navegação no cliente (sem SSR), renderizam na hora.
 */
@Component({
  selector: 'app-home-page',
  imports: [
    HeroComponent,
    ManifestoComponent,
    AboutComponent,
    WhoIHelpComponent,
    QuoteComponent,
    ApproachComponent,
    HowItWorksComponent,
    FaqComponent,
    ContactComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div id="inicio" class="opening">
      <app-hero />
      @defer (hydrate on viewport; on immediate) {
        <app-manifesto />
      }
    </div>
    @defer (hydrate on viewport; on immediate) {
      <app-about />
    }
    @defer (hydrate on viewport; on immediate) {
      <app-who-i-help />
    }
    @defer (hydrate on viewport; on immediate) {
      <app-quote />
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
  // .opening limita o hero fixo: ele solta quando a cúpula termina de passar.
  styles: `
    .opening {
      background: var(--forest);
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

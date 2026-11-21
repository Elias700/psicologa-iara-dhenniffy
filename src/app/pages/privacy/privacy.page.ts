import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CONTACT, PROFESSIONAL, SITE } from '../../core/data/site-content';
import { SeoService } from '../../core/seo/seo.service';
import { CrisisNoticeComponent } from '../../shared/crisis-notice/crisis-notice.component';

/**
 * Política de Privacidade — TEXTO-BASE.
 * TODO(privacidade): revisar com a Iara (e, se possível, com assessoria jurídica) antes de publicar:
 * controladora, e-mail do encarregado, serviço que recebe o formulário, prazo de guarda e hospedagem.
 */
@Component({
  selector: 'app-privacy-page',
  imports: [RouterLink, CrisisNoticeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './privacy.page.html',
  styleUrl: './privacy.page.scss',
})
export class PrivacyPage {
  protected readonly pro = PROFESSIONAL;
  protected readonly email = CONTACT.email;
  // TODO(privacidade): data da última revisão.
  protected readonly updatedAt = null as string | null;

  constructor() {
    inject(SeoService).apply({
      title: 'Política de privacidade | Iara Dhenniffy',
      description: `Como ${SITE.shortName}, psicóloga (${PROFESSIONAL.crp}), trata os dados enviados por este site, com atenção ao sigilo e à LGPD.`,
      path: '/privacidade',
      jsonLd: false,
    });
  }
}

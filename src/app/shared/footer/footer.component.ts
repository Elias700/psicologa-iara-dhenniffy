import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HeaderThemeDirective } from '../../core/animations/header-theme';
import { CONTACT, NAV, PROFESSIONAL, instagramLink, whatsappLink } from '../../core/data/site-content';
import { CrisisNoticeComponent } from '../crisis-notice/crisis-notice.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, CrisisNoticeComponent, HeaderThemeDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly pro = PROFESSIONAL;
  protected readonly nav = NAV;
  protected readonly email = CONTACT.email;
  protected readonly instagram = instagramLink();
  protected readonly instagramHandle = CONTACT.instagram;
  protected readonly whatsapp = whatsappLink();
  protected readonly year = new Date().getFullYear();
}

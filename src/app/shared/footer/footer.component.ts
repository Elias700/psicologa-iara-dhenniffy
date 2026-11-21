import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RevealDirective } from '../../core/animations/reveal.directive';
import { CONTACT, NAV, PROFESSIONAL, instagramLink, whatsappLink } from '../../core/data/site-content';
import { CrisisNoticeComponent } from '../crisis-notice/crisis-notice.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, CrisisNoticeComponent, IconComponent, RevealDirective],
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

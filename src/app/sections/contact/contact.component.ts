import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeaderThemeDirective } from '../../core/animations/header-theme';
import { RevealDirective } from '../../core/animations/reveal.directive';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { CONTACT, CONTACT_SECTION, PROFESSIONAL, instagramLink, whatsappLink } from '../../core/data/site-content';
import { CrisisNoticeComponent } from '../../shared/crisis-notice/crisis-notice.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { ContactFormComponent } from './contact-form.component';

@Component({
  selector: 'app-contact',
  imports: [
    ContactFormComponent,
    CrisisNoticeComponent,
    HeaderThemeDirective,
    IconComponent,
    RevealDirective,
    SplitTextDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  protected readonly content = CONTACT_SECTION;
  protected readonly pro = PROFESSIONAL;
  protected readonly whatsapp = whatsappLink();
  protected readonly email = CONTACT.email;
  protected readonly instagram = instagramLink();
  protected readonly instagramHandle = CONTACT.instagram;
}

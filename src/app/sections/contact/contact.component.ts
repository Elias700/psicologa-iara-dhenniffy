import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ImageMaskDirective } from '../../core/animations/image-mask.directive';
import { RevealDirective } from '../../core/animations/reveal.directive';
import { SectionThemeDirective } from '../../core/animations/section-theme';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import {
  CONTACT,
  CONTACT_SECTION,
  HOW_IT_WORKS,
  PHOTOS,
  PROFESSIONAL,
  instagramLink,
  srcset,
  whatsappLink,
} from '../../core/data/site-content';
import { CrisisNoticeComponent } from '../../shared/crisis-notice/crisis-notice.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { ContactFormComponent } from './contact-form.component';

@Component({
  selector: 'app-contact',
  imports: [
    NgOptimizedImage,
    ContactFormComponent,
    CrisisNoticeComponent,
    IconComponent,
    ImageMaskDirective,
    RevealDirective,
    SectionThemeDirective,
    SplitTextDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  protected readonly content = CONTACT_SECTION;
  protected readonly reassurance = HOW_IT_WORKS.reassurance;
  protected readonly pro = PROFESSIONAL;
  protected readonly whatsapp = whatsappLink();
  protected readonly email = CONTACT.email;
  protected readonly instagram = instagramLink();
  protected readonly instagramHandle = CONTACT.instagram;
  protected readonly photo = PHOTOS.contact;
  protected readonly avif = srcset(PHOTOS.contact, 'avif');
  protected readonly ngSrcset = PHOTOS.contact.widths.map((w) => `${w}w`).join(', ');
  protected readonly sizes = '(min-width: 48rem) 10rem, 7rem';
}

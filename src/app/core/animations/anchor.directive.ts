import { Directive, inject, input } from '@angular/core';

import { ScrollAnimationService } from './scroll-animation.service';

/**
 * Link interno para uma seção da página: rola até ela compensando o header fixo
 * e leva o foco para a seção. Sem JS, o href="#id" funciona normalmente.
 *
 * Uso: <a href="#contato" appAnchor="contato">
 */
@Directive({
  selector: 'a[appAnchor]',
  host: { '(click)': 'onClick($event)' },
})
export class AnchorDirective {
  readonly target = input.required<string>({ alias: 'appAnchor' });
  private readonly animation = inject(ScrollAnimationService);

  protected onClick(event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    this.animation.scrollToSection(this.target());
  }
}

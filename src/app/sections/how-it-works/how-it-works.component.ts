import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DrawPathDirective } from '../../core/animations/draw-path.directive';
import { RevealDirective } from '../../core/animations/reveal.directive';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { HOW_IT_WORKS, SESSIONS } from '../../core/data/site-content';
import { SprigComponent } from '../../shared/sprig/sprig.component';

/** Passo a passo sobre uma linha sinuosa que se desenha com a rolagem (derivada do mapa do modelo). */
@Component({
  selector: 'app-how-it-works',
  imports: [DrawPathDirective, RevealDirective, SplitTextDirective, SprigComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
})
export class HowItWorksComponent {
  protected readonly content = HOW_IT_WORKS;

  // Só mostra o que já foi confirmado em site-content.ts.
  protected readonly practical = [
    { label: 'Duração', value: SESSIONS.duration },
    { label: 'Frequência', value: SESSIONS.frequency },
    { label: 'Plataforma', value: SESSIONS.platform },
    { label: 'Recibo', value: SESSIONS.receipt },
  ].filter((item) => item.value !== null);
}

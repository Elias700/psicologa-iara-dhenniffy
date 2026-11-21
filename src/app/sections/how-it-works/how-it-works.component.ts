import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealDirective } from '../../core/animations/reveal.directive';
import { SectionThemeDirective } from '../../core/animations/section-theme';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { StepsProgressDirective } from '../../core/animations/steps-progress.directive';
import { HOW_IT_WORKS, SESSIONS } from '../../core/data/site-content';

@Component({
  selector: 'app-how-it-works',
  imports: [RevealDirective, SectionThemeDirective, SplitTextDirective, StepsProgressDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
})
export class HowItWorksComponent {
  protected readonly content = HOW_IT_WORKS;
  protected readonly practical = [
    { label: 'Formato', value: 'Sessões individuais, online, por videochamada' },
    { label: 'Duração', value: SESSIONS.duration },
    { label: 'Frequência', value: SESSIONS.frequency },
    { label: 'Plataforma', value: SESSIONS.platform },
    { label: 'Recibo', value: SESSIONS.receipt },
  ].filter((item): item is { label: string; value: string } => !!item.value);
}

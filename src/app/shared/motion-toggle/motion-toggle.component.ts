import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { MotionPreferenceService } from '../../core/animations/motion-preference.service';
import { IconComponent } from '../icon/icon.component';

/**
 * Botão "Reduzir movimento". aria-pressed = true quando o movimento está reduzido.
 * A escolha vale na hora (todas as diretivas reagem) e fica salva para as próximas visitas.
 */
@Component({
  selector: 'app-motion-toggle',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="toggle" [attr.aria-pressed]="reduced()" (click)="motion.toggle()">
      <app-icon name="motion" />
      <span>Reduzir movimento</span>
      <span class="switch" aria-hidden="true"><span class="knob"></span></span>
    </button>
  `,
  styleUrl: './motion-toggle.component.scss',
})
export class MotionToggleComponent {
  protected readonly motion = inject(MotionPreferenceService);
  protected readonly reduced = computed(() => !this.motion.motionEnabled());
}

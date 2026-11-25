import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Aviso de crise obrigatório (AGENTS.md, seção 6). Discreto, mas sempre visível. */
@Component({
  selector: 'app-crisis-notice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.dark]': "tone() === 'dark'" },
  template: `
    <p class="notice" role="note">
      <strong>Este espaço não oferece atendimento de urgência.</strong>
      Em situação de crise, ligue <a href="tel:188">188</a> (CVV, 24h e gratuito) ou
      <a href="tel:192">192</a> (SAMU), ou procure a emergência mais próxima.
    </p>
  `,
  styles: `
    :host {
      display: block;
    }
    .notice {
      max-width: 48rem;
      padding: 1rem 1.25rem;
      border: 1px solid var(--clay);
      border-radius: var(--radius-sm);
      font-size: var(--text-sm);
      line-height: 1.6;
    }
    a {
      font-weight: 700;
      text-underline-offset: 0.18em;
      white-space: nowrap;
    }
    :host(.dark) .notice {
      border-color: var(--gold);
      color: var(--on-dark);
    }
  `,
})
export class CrisisNoticeComponent {
  readonly tone = input<'light' | 'dark'>('light');
}

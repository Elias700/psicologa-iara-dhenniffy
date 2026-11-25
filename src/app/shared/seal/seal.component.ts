import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PROFESSIONAL } from '../../core/data/site-content';

/**
 * Selo circular da marca: símbolo da logo com nome e CRP em volta. Estático de propósito
 * (AGENTS.md, seção 4: nada gira). Decorativo: o nome acessível fica no link que o envolve.
 */
@Component({
  selector: 'app-seal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 120 120" focusable="false">
      <path id="seal-ring" d="M60 60m0 -49a49 49 0 1 1 0 98a49 49 0 1 1 0 -98" fill="none" />
      <text><textPath href="#seal-ring" textLength="304" lengthAdjust="spacing">{{ label }}</textPath></text>
    </svg>
    <img src="images/simbolo-iara.webp" width="139" height="112" alt="" />
  `,
  styles: `
    :host {
      position: relative;
      display: grid;
      place-items: center;
      aspect-ratio: 1;
    }
    svg {
      grid-area: 1 / 1;
      width: 100%;
    }
    img {
      grid-area: 1 / 1;
      width: 46%;
      height: auto;
      filter: var(--seal-filter, none);
    }
    text {
      font-family: var(--font-body);
      font-size: 11px;
      font-weight: 700;
      fill: currentColor;
      text-transform: uppercase;
    }
  `,
})
export class SealComponent {
  protected readonly label = `${PROFESSIONAL.name} · ${PROFESSIONAL.role} · ${PROFESSIONAL.crp} · `;
}

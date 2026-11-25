import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Leaf {
  readonly x: number;
  readonly y: number;
  readonly angle: number;
  readonly size: number;
}

// Folha apontando para a direita, com 100 unidades de comprimento. Mesma forma das folhas da logo.
const LEAF = 'M0 0C22-30 66-34 100 0C70 18 26 20 0 0Z';
const VEIN = 'M6 0C36-6 62-6 88-1';

const LEAVES: readonly Leaf[] = [
  { x: 117, y: 318, angle: -28, size: 1.15 },
  { x: 117, y: 286, angle: -148, size: 1.2 },
  { x: 122, y: 246, angle: -32, size: 1.1 },
  { x: 127, y: 208, angle: -146, size: 1.12 },
  { x: 131, y: 170, angle: -38, size: 0.98 },
  { x: 131, y: 134, angle: -140, size: 0.96 },
  { x: 128, y: 100, angle: -46, size: 0.8 },
  { x: 124, y: 70, angle: -130, size: 0.76 },
  { x: 118, y: 40, angle: -86, size: 0.62 },
];

/** Ramo decorativo derivado das folhas da logo. A cor vem de `color` e a das nervuras de `--sprig-vein`. */
@Component({
  selector: 'app-sprig',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 250 360" focusable="false">
      <path d="M116 360C110 290 150 190 118 38" fill="none" stroke="currentColor" stroke-width="3" />
      @for (leaf of leaves; track $index) {
        <g [attr.transform]="'translate(' + leaf.x + ' ' + leaf.y + ') rotate(' + leaf.angle + ') scale(' + leaf.size + ')'">
          <path [attr.d]="leafPath" fill="currentColor" />
          <path [attr.d]="veinPath" fill="none" class="vein" />
        </g>
      }
    </svg>
  `,
  styles: `
    :host {
      display: block;
      pointer-events: none;
    }
    svg {
      width: 100%;
      height: auto;
      overflow: visible;
    }
    .vein {
      stroke: var(--sprig-vein, transparent);
      stroke-width: 1.4;
      stroke-linecap: round;
    }
  `,
})
export class SprigComponent {
  protected readonly leaves = LEAVES;
  protected readonly leafPath = LEAF;
  protected readonly veinPath = VEIN;
}

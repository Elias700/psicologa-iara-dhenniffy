import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName =
  | 'whatsapp'
  | 'mail'
  | 'instagram'
  | 'arrow-right'
  | 'arrow-down'
  | 'menu'
  | 'close'
  | 'plus'
  | 'motion'
  | 'phone'
  | 'external';

// Ícones de traço simples (24×24). Decorativos: sempre aria-hidden. O texto ao lado dá o sentido.
const PATHS: Record<IconName, string> = {
  // Balão de conversa (usado para WhatsApp/mensagem; sem logo de marca)
  whatsapp: 'M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1.4-5A8.5 8.5 0 1 1 21 11.5ZM8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5h.01',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-down': 'M12 5v14M6 13l6 6 6-6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  motion: 'M3 12c2.5-4 5.5-4 8 0s5.5 4 8 0M3 17c2.5-4 5.5-4 8 0s5.5 4 8 0M3 7c2.5-4 5.5-4 8 0s5.5 4 8 0',
  phone:
    'M6.6 3.5 9 3l1.6 4-2 1.4a11 11 0 0 0 7 7l1.4-2 4 1.6-.5 2.4a2 2 0 0 1-2 1.6A16 16 0 0 1 3 5.5a2 2 0 0 1 1.6-2Z',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 'icon' },
  template: `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round" focusable="false">
      <path [attr.d]="path()" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 1.25em;
      height: 1.25em;
      flex: none;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  protected readonly path = computed(() => PATHS[this.name()]);
}

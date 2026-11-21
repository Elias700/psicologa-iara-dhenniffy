import { Injectable } from '@angular/core';

import { CONTACT } from './site-content';

export type ContactChannel = 'whatsapp' | 'email';
export type BestTime = 'manha' | 'tarde' | 'noite' | 'qualquer';

export interface ContactRequest {
  readonly name: string;
  readonly channel: ContactChannel;
  readonly contact: string;
  readonly bestTime: BestTime;
  readonly message: string;
  readonly consent: true;
}

export class ContactNotConfiguredError extends Error {
  constructor() {
    super('O envio do formulário ainda não foi configurado.');
  }
}

/**
 * Envio do formulário, desacoplado da interface.
 * TODO(formulário): definir CONTACT.formEndpoint em site-content.ts (ex.: Formspree, Netlify Forms
 * ou uma API própria). O endpoint deve aceitar JSON via POST e usar HTTPS. Dados de saúde são
 * sensíveis pela LGPD: guardar o mínimo, pelo menor tempo possível.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  async send(request: ContactRequest): Promise<void> {
    const endpoint = CONTACT.formEndpoint;
    if (!endpoint) throw new ContactNotConfiguredError();

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error(`Falha no envio (${response.status})`);
  }
}

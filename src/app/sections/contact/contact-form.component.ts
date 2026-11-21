import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  BestTime,
  ContactChannel,
  ContactNotConfiguredError,
  ContactService,
} from '../../core/data/contact.service';
import { CONTACT, whatsappLink } from '../../core/data/site-content';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'not-configured';

function contactValidator(group: AbstractControl): ValidationErrors | null {
  const channel = group.get('channel')?.value as ContactChannel;
  const value = String(group.get('contact')?.value ?? '').trim();
  if (!value) return null; // "required" cuida do vazio
  if (channel === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? null : { contactFormat: true };
  }
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13 ? null : { contactFormat: true };
}

/**
 * Formulário curto (AGENTS.md, seção 8): só nome, forma de contato, melhor horário,
 * um campo opcional e o consentimento LGPD. Erros explicados em linguagem simples.
 */
@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(ContactService);
  private readonly summary = viewChild<ElementRef<HTMLElement>>('summary');
  private readonly statusBox = viewChild<ElementRef<HTMLElement>>('statusBox');

  protected readonly form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.maxLength(80)]],
      channel: this.fb.control<ContactChannel>('whatsapp'),
      contact: ['', [Validators.required, Validators.maxLength(120)]],
      bestTime: this.fb.control<BestTime>('qualquer'),
      message: ['', [Validators.maxLength(600)]],
      consent: [false, Validators.requiredTrue],
    },
    { validators: contactValidator },
  );

  protected readonly submitted = signal(false);
  protected readonly status = signal<Status>('idle');
  protected readonly channel = toSignal(this.form.controls.channel.valueChanges, { initialValue: 'whatsapp' as ContactChannel });
  protected readonly messageLength = toSignal(this.form.controls.message.valueChanges, { initialValue: '' });
  protected readonly contactLabel = computed(() =>
    this.channel() === 'email' ? 'Seu e-mail' : 'Seu número de WhatsApp (com DDD)',
  );
  protected readonly fallbackWhatsapp = whatsappLink();
  protected readonly fallbackEmail = CONTACT.email;

  protected error(field: 'name' | 'contact' | 'consent' | 'message'): string | null {
    if (!this.submitted()) return null;
    const control = this.form.controls[field];
    if (field === 'name') {
      if (control.hasError('required')) return 'Escreva seu nome ou o nome que você prefere usar.';
      if (control.hasError('maxlength')) return 'O nome pode ter até 80 caracteres.';
    }
    if (field === 'contact') {
      if (control.hasError('required'))
        return this.channel() === 'email' ? 'Escreva seu e-mail.' : 'Escreva seu número de WhatsApp.';
      if (this.form.hasError('contactFormat'))
        return this.channel() === 'email'
          ? 'Esse e-mail parece incompleto. Exemplo: nome@email.com'
          : 'Esse número parece incompleto. Escreva com DDD. Exemplo: 11 91234-5678';
    }
    if (field === 'message' && control.hasError('maxlength')) return 'A mensagem pode ter até 600 caracteres.';
    if (field === 'consent' && control.hasError('required'))
      return 'Para eu poder responder, marque que você concorda com o uso dos seus dados.';
    return null;
  }

  protected errorCount(): number {
    return (['name', 'contact', 'message', 'consent'] as const).filter((f) => this.error(f)).length;
  }

  async submit(): Promise<void> {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.status.set('idle');
      requestAnimationFrame(() => this.summary()?.nativeElement.focus());
      return;
    }

    this.status.set('sending');
    const value = this.form.getRawValue();
    try {
      await this.service.send({
        name: value.name.trim(),
        channel: value.channel,
        contact: value.contact.trim(),
        bestTime: value.bestTime,
        message: value.message.trim(),
        consent: true,
      });
      this.status.set('sent');
      this.form.reset();
      this.submitted.set(false);
    } catch (err) {
      this.status.set(err instanceof ContactNotConfiguredError ? 'not-configured' : 'error');
    }
    requestAnimationFrame(() => this.statusBox()?.nativeElement.focus());
  }
}

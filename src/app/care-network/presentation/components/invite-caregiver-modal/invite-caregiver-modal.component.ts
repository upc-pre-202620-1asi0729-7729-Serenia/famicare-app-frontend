import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';

@Component({
  selector: 'app-invite-caregiver-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="modal-backdrop" (mousedown)="close.emit()">
      <div class="modal" (mousedown)="$event.stopPropagation()">
        <button class="modal-close" (click)="close.emit()" aria-label="Cerrar modal">
          <app-icon name="close"></app-icon>
        </button>
        <p class="eyebrow">RED DE CUIDADO</p>
        <h2>Invitar cuidador</h2>
        <p class="modal-sub">Añade a alguien de confianza al cuidado de Elena</p>

        <form class="form" (ngSubmit)="send()">
          <label>
            Correo electrónico
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="nombre@email.com"
              required
            />
          </label>
          <label>
            Relación o parentesco
            <input
              type="text"
              [(ngModel)]="relationship"
              name="relationship"
              placeholder="Ej. Familiar"
              required
            />
          </label>
          <label>
            Nivel de permisos
            <select [(ngModel)]="role" name="role">
              <option>Colaborador · Alertas y lectura</option>
              <option>Administrador · Control total</option>
            </select>
          </label>
          <button type="submit" class="primary-btn">Enviar invitación</button>
        </form>
      </div>
    </div>
  `,
})
export class InviteCaregiverModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() invited = new EventEmitter<{ email: string; relationship: string }>();

  email = '';
  relationship = '';
  role = 'Colaborador · Alertas y lectura';

  send(): void {
    if (this.email.trim()) {
      this.invited.emit({ email: this.email, relationship: this.relationship });
    }
  }
}

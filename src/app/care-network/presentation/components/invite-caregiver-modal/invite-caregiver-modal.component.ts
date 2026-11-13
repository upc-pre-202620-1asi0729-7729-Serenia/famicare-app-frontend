import { Component, EventEmitter, Input, Output } from '@angular/core';
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

        @if (errorMessage) {
          <div class="auth-error">{{ errorMessage }}</div>
        }

        <form class="form" (ngSubmit)="send()">
          <label>
            Nombre completo
            <input
              type="text"
              [(ngModel)]="fullName"
              name="fullName"
              placeholder="Ej. Lucía Santos"
              required
            />
          </label>
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
              placeholder="Ej. Hermano, Enfermera"
              required
            />
          </label>
          <label>
            Nivel de permisos
            <select [(ngModel)]="role" name="role">
              <option value="Alertas y lectura">Colaborador - Alertas y lectura</option>
              <option value="Control total">Administrador - Control total</option>
            </select>
          </label>
          <button type="submit" class="primary-btn">Enviar invitación</button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-error {
        background: #fee2e2;
        color: #991b1b;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 11px;
        margin-bottom: 12px;
      }
    `,
  ],
})
export class InviteCaregiverModalComponent {
  @Input() errorMessage: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() invited = new EventEmitter<{
    fullName: string;
    email: string;
    relationship: string;
    role: string;
  }>();

  fullName = '';
  email = '';
  relationship = '';
  role = 'Alertas y lectura';

  send(): void {
    if (this.fullName.trim() && this.email.trim() && this.relationship.trim()) {
      this.invited.emit({
        fullName: this.fullName,
        email: this.email,
        relationship: this.relationship,
        role: this.role,
      });
    }
  }
}

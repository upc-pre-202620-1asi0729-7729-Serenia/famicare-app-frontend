import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';

@Component({
  selector: 'app-link-device-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="modal-backdrop" (mousedown)="close.emit()">
      <div class="modal" (mousedown)="$event.stopPropagation()">
        <button class="modal-close" (click)="close.emit()" aria-label="Cerrar modal">
          <app-icon name="close"></app-icon>
        </button>
        <p class="eyebrow">NUEVO DISPOSITIVO</p>
        <h2>Vincular dispositivo</h2>
        <p class="modal-sub">Conecta una pulsera FamiCare a este perfil</p>

        <div class="form">
          <label>
            Código de vinculación
            <input type="text" placeholder="000 000" class="code-input" maxlength="7" />
          </label>
          <div class="qr-box">
            <app-icon name="watch" [size]="30"></app-icon>
            <span>También puedes escanear el código QR</span>
          </div>
          <button class="primary-btn" (click)="close.emit()">Vincular dispositivo</button>
        </div>
      </div>
    </div>
  `,
})
export class LinkDeviceModalComponent {
  @Output() close = new EventEmitter<void>();
}

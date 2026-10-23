import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';
import { MapVisualComponent } from '../../../../shared/presentation/components/map-visual/map-visual.component';

@Component({
  selector: 'app-alert-detail-modal',
  standalone: true,
  imports: [CommonModule, IconComponent, MapVisualComponent],
  template: `
    <div class="modal-backdrop" (mousedown)="close.emit()">
      <div class="modal alert-modal" (mousedown)="$event.stopPropagation()">
        <button class="modal-close" (click)="close.emit()" aria-label="Cerrar modal">
          <app-icon name="close"></app-icon>
        </button>
        <p class="eyebrow">EVENTO CRÍTICO</p>
        <h2>Salida de zona segura</h2>
        <p class="modal-sub">Detectada hoy a las 11:04 AM</p>

        <app-map-visual></app-map-visual>

        <div class="action-log">
          <h3>Registro de acciones</h3>
          <p><i></i> Alerta enviada a 3 cuidadores <small>11:04 AM</small></p>
          <p><i></i> Valeria abrió la alerta <small>11:06 AM</small></p>
        </div>

        <button class="primary-btn" (click)="resolve.emit()">Marcar como resuelta</button>
        <button class="wide-secondary">Llamar a contacto de emergencia</button>
      </div>
    </div>
  `,
})
export class AlertDetailModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() resolve = new EventEmitter<void>();
}

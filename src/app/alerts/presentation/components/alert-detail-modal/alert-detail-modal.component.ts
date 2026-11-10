import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';
import { MapVisualComponent } from '../../../../shared/presentation/components/map-visual/map-visual.component';
import { AlertsStore } from '../../../application/alerts.store';

@Component({
  selector: 'app-alert-detail-modal',
  standalone: true,
  imports: [CommonModule, IconComponent, MapVisualComponent],
  template: `
    @if (store.selectedAlert(); as alert) {
      <div class="modal-backdrop" (mousedown)="close.emit()">
        <div class="modal alert-modal" (mousedown)="$event.stopPropagation()">
          <button class="modal-close" (click)="close.emit()" aria-label="Cerrar modal">
            <app-icon name="close"></app-icon>
          </button>

          <p class="eyebrow">
            {{ alert.type === 'critical' ? 'EVENTO CRÍTICO' : 'ADVERTENCIA' }}
          </p>
          <h2>{{ alert.title }}</h2>
          <p class="modal-sub">{{ alert.description }} · {{ alert.timestamp }}</p>

          <app-map-visual></app-map-visual>

          <div class="action-log">
            <h3>Registro de acciones</h3>
            <p>
              <i></i> Evento reportado por pulsera IoT
              <small>{{ alert.timestamp }}</small>
            </p>
            <p>
              <i></i> Estado actual: <strong>{{ alert.status }}</strong>
            </p>
          </div>

          @if (alert.status !== 'Resuelta') {
            <button class="primary-btn" (click)="resolve.emit()">Marcar como resuelta</button>
          } @else {
            <button class="primary-btn" (click)="close.emit()">Cerrar</button>
          }

          <button class="wide-secondary" (click)="attendAlert(alert.id)">
            Marcar como atendida
          </button>
        </div>
      </div>
    }
  `,
})
export class AlertDetailModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() resolve = new EventEmitter<void>();

  store = inject(AlertsStore);

  attendAlert(id: string): void {
    this.store.attendAlert(id);
    this.close.emit();
  }
}

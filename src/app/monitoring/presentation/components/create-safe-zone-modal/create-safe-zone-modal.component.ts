// create-safe-zone-modal.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';
import { CreateSafeZoneDto } from '../../../domain/model/safe-zone.entity';

@Component({
  selector: 'app-create-safe-zone-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="modal-backdrop" (mousedown)="close.emit()">
      <div class="modal" (mousedown)="$event.stopPropagation()">
        <button class="modal-close" (click)="close.emit()" aria-label="Cerrar modal">
          <app-icon name="close"></app-icon>
        </button>
        <p class="eyebrow">NUEVA GEOCERCA</p>
        <h2>Crear zona segura</h2>
        <p class="modal-sub">Recibe alertas cuando Elena entre o salga</p>

        <form class="form" (ngSubmit)="save()">
          <label>
            Nombre de la zona
            <input
              type="text"
              [(ngModel)]="name"
              name="name"
              placeholder="Ej. Taller de pintura"
              required
            />
          </label>
          <label>
            Dirección
            <input
              type="text"
              [(ngModel)]="address"
              name="address"
              placeholder="Buscar dirección"
              required
            />
          </label>
          <label>
            Radio de la zona <strong>{{ radius }} m</strong>
            <input type="range" [(ngModel)]="radius" name="radius" min="50" max="1000" />
          </label>
          <button type="submit" class="primary-btn">Guardar zona segura</button>
        </form>
      </div>
    </div>
  `,
})
export class CreateSafeZoneModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() zoneCreated = new EventEmitter<CreateSafeZoneDto>();

  name = '';
  address = '';
  radius = 300;

  save(): void {
    if (this.name.trim() && this.address.trim()) {
      const baseLat = -12.1192;
      const baseLng = -77.0315;
      const offsetLat = (Math.random() - 0.5) * 0.008;
      const offsetLng = (Math.random() - 0.5) * 0.008;

      this.zoneCreated.emit({
        name: this.name,
        address: this.address,
        radiusMeters: this.radius,
        lat: Number((baseLat + offsetLat).toFixed(6)),
        lng: Number((baseLng + offsetLng).toFixed(6)),
        iconType: 'pin',
      });
    }
  }
}

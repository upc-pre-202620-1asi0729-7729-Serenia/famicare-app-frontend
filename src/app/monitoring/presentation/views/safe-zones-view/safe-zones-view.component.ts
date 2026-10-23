import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalDbService } from '../../../../core/infrastructure/local-db.service';
import { LeafletMapComponent } from '../../components/leaflet-map/leaflet-map.component';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';

@Component({
  selector: 'app-safe-zones-view',
  standalone: true,
  imports: [CommonModule, FormsModule, LeafletMapComponent, IconComponent],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">Geocercas</p>
          <h1>Zonas seguras</h1>
          <p>Define espacios de confianza para Elena</p>
        </div>
        <button class="primary-btn" (click)="isModalOpen.set(true)">Crear zona segura</button>
      </div>

      <div class="split-layout">
        <app-leaflet-map [large]="true"></app-leaflet-map>

        <section class="card list-panel">
          <h3>{{ db.safeZones().length }} zonas configuradas</h3>
          @for (zone of db.safeZones(); track zone.id) {
            <div class="zone-item">
              <div class="zone-icon">
                <app-icon [name]="zone.name.includes('Casa') ? 'home' : 'pin'"></app-icon>
              </div>
              <div>
                <strong>{{ zone.name }}</strong>
                <span>{{ zone.address }} · Radio {{ zone.radiusMeters }} m</span>
              </div>
              <label class="switch">
                <input
                  type="checkbox"
                  [checked]="zone.isActive"
                  (change)="db.toggleSafeZone(zone.id)"
                />
                <i></i>
              </label>
            </div>
          }
        </section>
      </div>
    </div>

    @if (isModalOpen()) {
      <div class="modal-backdrop" (mousedown)="isModalOpen.set(false)">
        <div class="modal" (mousedown)="$event.stopPropagation()">
          <button class="modal-close" (click)="isModalOpen.set(false)">
            <app-icon name="close"></app-icon>
          </button>
          <p class="eyebrow">NUEVA GEOCERCA</p>
          <h2>Crear zona segura</h2>
          <p class="modal-sub">Recibe alertas cuando Elena entre o salga</p>

          <form class="form" (ngSubmit)="saveZone()">
            <label>
              Nombre de la zona
              <input
                type="text"
                [(ngModel)]="newZoneName"
                name="zName"
                placeholder="Ej. Taller de pintura"
                required
              />
            </label>
            <label>
              Dirección
              <input
                type="text"
                [(ngModel)]="newZoneAddress"
                name="zAddr"
                placeholder="Buscar dirección"
                required
              />
            </label>
            <label>
              Radio de la zona <strong class="radius-indicator">{{ newZoneRadius }} m</strong>
              <input
                type="range"
                [(ngModel)]="newZoneRadius"
                name="zRad"
                min="50"
                max="1000"
                step="10"
              />
            </label>
            <button type="submit" class="primary-btn full-btn">Guardar zona segura</button>
          </form>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .radius-indicator {
        float: right;
        color: var(--accent);
        font-weight: 700;
      }
      .full-btn {
        width: 100%;
        margin-top: 15px;
      }
    `,
  ],
})
export class SafeZonesViewComponent {
  db = inject(LocalDbService);
  isModalOpen = signal(false);

  newZoneName = '';
  newZoneAddress = '';
  newZoneRadius = 300;

  saveZone(): void {
    if (this.newZoneName.trim() && this.newZoneAddress.trim()) {
      this.db.addSafeZone(this.newZoneName, this.newZoneAddress, Number(this.newZoneRadius));
      this.isModalOpen.set(false);
      this.newZoneName = '';
      this.newZoneAddress = '';
      this.newZoneRadius = 300;
    }
  }
}

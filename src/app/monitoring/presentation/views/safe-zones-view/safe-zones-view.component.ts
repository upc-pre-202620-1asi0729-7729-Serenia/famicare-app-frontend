import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';
import { MapVisualComponent } from '../../../../shared/presentation/components/map-visual/map-visual.component';
import { CreateSafeZoneModalComponent } from '../../components/create-safe-zone-modal/create-safe-zone-modal.component';
import { MonitoringStore } from '../../../application/monitoring.store';

@Component({
  selector: 'app-safe-zones-view',
  standalone: true,
  imports: [CommonModule, IconComponent, MapVisualComponent, CreateSafeZoneModalComponent],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">Geocercas</p>
          <h1>Zonas seguras</h1>
          <p>Define espacios de confianza para Elena</p>
        </div>
        <button class="primary-btn" (click)="store.isCreateModalOpen.set(true)">
          Crear zona segura
        </button>
      </div>

      <div class="split-layout">
        <app-map-visual [large]="true"></app-map-visual>
        <section class="card list-panel">
          <h3>{{ store.safeZones().length }} zonas configuradas</h3>
          @for (zone of store.safeZones(); track zone.id) {
            <div class="zone-item">
              <div class="zone-icon">
                <app-icon [name]="zone.iconType"></app-icon>
              </div>
              <div>
                <strong>{{ zone.name }}</strong>
                <span>{{ zone.address }} · Radio {{ zone.radiusMeters }} m</span>
              </div>
              <label class="switch">
                <input
                  type="checkbox"
                  [checked]="zone.isActive"
                  (change)="store.toggleZone(zone.id)"
                />
                <i></i>
              </label>
            </div>
          }
        </section>
      </div>
    </div>

    @if (store.isCreateModalOpen()) {
      <app-create-safe-zone-modal
        (close)="store.isCreateModalOpen.set(false)"
        (zoneCreated)="store.addZone($event)"
      >
      </app-create-safe-zone-modal>
    }
  `,
})
export class SafeZonesViewComponent {
  store = inject(MonitoringStore);
}

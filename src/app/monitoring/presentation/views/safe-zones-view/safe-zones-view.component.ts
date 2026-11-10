import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalDbService } from '../../../../core/infrastructure/local-db.service';
import { LeafletMapComponent } from '../../components/leaflet-map/leaflet-map.component';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';
import { I18nService } from '../../../../shared/services/i18n.service';

@Component({
  selector: 'app-safe-zones-view',
  standalone: true,
  imports: [CommonModule, FormsModule, LeafletMapComponent, IconComponent],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">{{ i18n.t('zones.eyebrow') }}</p>
          <h1>{{ i18n.t('zones.title') }}</h1>
          <p>{{ i18n.t('zones.subtitle') }}</p>
        </div>
        <button class="primary-btn" (click)="isModalOpen.set(true)">
          {{ i18n.t('zones.createBtn') }}
        </button>
      </div>

      <div class="split-layout">
        <app-leaflet-map [large]="true"></app-leaflet-map>

        <section class="card list-panel">
          <h3>{{ db.safeZones().length }} {{ i18n.t('zones.configuredCount') }}</h3>
          @for (zone of db.safeZones(); track zone.id) {
            <div class="zone-item">
              <div class="zone-icon">
                <app-icon [name]="zone.name.includes('Casa') ? 'home' : 'pin'"></app-icon>
              </div>
              <div>
                <strong>{{ zone.name }}</strong>
                <span
                  >{{ zone.address }} · {{ i18n.t('zones.radius') }} {{ zone.radiusMeters }} m</span
                >
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
          <button class="modal-close" (click)="isModalOpen.set(false)" aria-label="Cerrar modal">
            <app-icon [name]="'close'"></app-icon>
          </button>
          <p class="eyebrow">{{ i18n.t('zones.modal.eyebrow') }}</p>
          <h2>{{ i18n.t('zones.modal.title') }}</h2>
          <p class="modal-sub">{{ i18n.t('zones.modal.sub') }}</p>

          <form class="form" (ngSubmit)="saveZone()">
            <label>
              {{ i18n.t('zones.modal.name') }}
              <input
                type="text"
                [(ngModel)]="newZoneName"
                name="zName"
                [placeholder]="i18n.t('zones.modal.namePlaceholder')"
                required
              />
            </label>
            <label>
              {{ i18n.t('zones.modal.address') }}
              <input
                type="text"
                [(ngModel)]="newZoneAddress"
                name="zAddr"
                [placeholder]="i18n.t('zones.modal.addressPlaceholder')"
                required
              />
            </label>
            <label>
              {{ i18n.t('zones.modal.radius') }}
              <strong class="radius-indicator">{{ newZoneRadius }} m</strong>
              <input
                type="range"
                [(ngModel)]="newZoneRadius"
                name="zRad"
                min="50"
                max="1000"
                step="10"
              />
            </label>
            <button type="submit" class="primary-btn full-btn">
              {{ i18n.t('zones.modal.saveBtn') }}
            </button>
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
  i18n = inject(I18nService);
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

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesService } from '../../../application/devices.service';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';
import { LinkDeviceModalComponent } from '../../components/link-device-modal/link-device-modal.component';
import { I18nService } from '../../../../shared/services/i18n.service';

@Component({
  selector: 'app-devices-view',
  standalone: true,
  imports: [CommonModule, IconComponent, LinkDeviceModalComponent],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">{{ i18n.t('devices.eyebrow') }}</p>
          <h1>{{ i18n.t('devices.title') }}</h1>
          <p>{{ i18n.t('devices.subtitle') }}</p>
        </div>
        <button class="primary-btn" (click)="isModalOpen.set(true)">
          {{ device() ? i18n.t('devices.changeBtn') : i18n.t('devices.linkBtn') }}
        </button>
      </div>

      @if (device(); as dev) {
        <div class="two-col">
          <section class="card device-card">
            <div class="watch-visual">
              <app-icon [name]="'watch'" [size]="54"></app-icon>
            </div>
            <span class="status-pill safe">{{ dev.status }}</span>
            <h2>{{ dev.modelName }}</h2>
            <p>ID: {{ dev.deviceCode }} · {{ dev.lastSync }}</p>
            <div class="device-stats">
              <div>
                <app-icon [name]="'battery'"></app-icon>
                <strong>{{ dev.battery }}%</strong>
                <span>{{ i18n.t('devices.battery') }}</span>
              </div>
              <div>
                <app-icon [name]="'pin'"></app-icon>
                <strong>{{ dev.gpsSignal }}</strong>
                <span>{{ i18n.t('devices.gpsSignal') }}</span>
              </div>
            </div>
            <button class="wide-secondary" (click)="isModalOpen.set(true)">
              {{ i18n.t('devices.reconnectBtn') }}
            </button>
          </section>

          <section class="card">
            <h3>{{ i18n.t('devices.batteryChart') }}</h3>
            <div class="battery-chart">
              <svg viewBox="0 0 500 180">
                <path
                  d="M0 18 C80 26 80 45 150 58 S250 82 300 100 S420 126 500 158"
                  fill="none"
                  stroke="#e86343"
                  stroke-width="4"
                />
                <path
                  d="M0 18 C80 26 80 45 150 58 S250 82 300 100 S420 126 500 158 V180 H0Z"
                  fill="url(#g)"
                />
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop stop-color="#e86343" stop-opacity=".18" />
                    <stop offset="1" stop-color="#e86343" stop-opacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="setting-row">
              <span>{{ i18n.t('devices.locationInterval') }}</span>
              <strong
                >{{ i18n.t('devices.every') }} {{ dev.reportIntervalMinutes }}
                {{ i18n.t('devices.minutes') }}</strong
              >
            </div>
            <div class="setting-row">
              <span>{{ i18n.t('devices.fallSensitivity') }}</span>
              <strong>{{ dev.fallSensitivity }}</strong>
            </div>
          </section>
        </div>
      } @else {
        <div class="card empty-state">
          <p>{{ i18n.t('devices.empty') }}</p>
          <button class="primary-btn" (click)="isModalOpen.set(true)">
            {{ i18n.t('devices.linkBtn') }}
          </button>
        </div>
      }
    </div>

    @if (isModalOpen()) {
      <app-link-device-modal (close)="isModalOpen.set(false)"></app-link-device-modal>
    }
  `,
})
export class DevicesViewComponent {
  i18n = inject(I18nService);
  private devicesService = inject(DevicesService);
  readonly device = this.devicesService.currentDevice;
  isModalOpen = signal(false);
}

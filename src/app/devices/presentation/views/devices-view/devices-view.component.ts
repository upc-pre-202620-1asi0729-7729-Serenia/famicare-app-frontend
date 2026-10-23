import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';
import { LinkDeviceModalComponent } from '../../components/link-device-modal/link-device-modal.component';

@Component({
  selector: 'app-devices-view',
  standalone: true,
  imports: [CommonModule, IconComponent, LinkDeviceModalComponent],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">Dispositivos IoT</p>
          <h1>Dispositivos vinculados</h1>
          <p>Gestiona la pulsera y sus sensores</p>
        </div>
        <button class="primary-btn" (click)="isModalOpen.set(true)">Vincular dispositivo</button>
      </div>

      <div class="two-col">
        <section class="card device-card">
          <div class="watch-visual">
            <app-icon name="watch" [size]="54"></app-icon>
          </div>
          <span class="status-pill safe">CONECTADA</span>
          <h2>Pulsera FC-2048</h2>
          <p>Última sincronización hace 2 minutos</p>
          <div class="device-stats">
            <div><app-icon name="battery"></app-icon><strong>78%</strong><span>Batería</span></div>
            <div><app-icon name="pin"></app-icon><strong>Alta</strong><span>Señal GPS</span></div>
          </div>
          <button class="wide-secondary" (click)="isModalOpen.set(true)">
            Ver todos los detalles
          </button>
        </section>

        <section class="card">
          <h3>Consumo de batería · 48 h</h3>
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
            <span>Intervalo de ubicación</span><strong>Cada 2 minutos</strong>
          </div>
          <div class="setting-row"><span>Sensibilidad de caída</span><strong>Alta</strong></div>
        </section>
      </div>
    </div>

    @if (isModalOpen()) {
      <app-link-device-modal (close)="isModalOpen.set(false)"></app-link-device-modal>
    }
  `,
})
export class DevicesViewComponent {
  isModalOpen = signal(false);
}

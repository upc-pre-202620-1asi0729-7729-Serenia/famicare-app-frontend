import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapVisualComponent } from '../../../../shared/presentation/components/map-visual/map-visual.component';
import { MonitoringStore } from '../../../application/monitoring.store';

@Component({
  selector: 'app-location-view',
  standalone: true,
  imports: [CommonModule, MapVisualComponent],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">Monitoreo en vivo</p>
          <h1>{{ isHistory() ? 'Historial de recorrido' : 'Ubicación en tiempo real' }}</h1>
          <p>
            {{
              isHistory()
                ? 'Revisa los lugares y trayectos realizados'
                : 'Última señal recibida hace 2 minutos (' + currentTime() + ')'
            }}
          </p>
        </div>
        <button class="primary-btn" (click)="toggleHistory()">
          {{ isHistory() ? 'Volver al mapa' : 'Ver historial' }}
        </button>
      </div>

      @if (!isHistory()) {
        <div class="full-map-card">
          <app-map-visual [large]="true"></app-map-visual>
          <div class="floating-person">
            <div class="avatar elder">EM</div>
            <div>
              <small>UBICACIÓN ACTUAL</small>
              <strong>Elena Martínez</strong>
              <span>Calle Santiago 42 · Precisión 8 m</span>
            </div>
            <span class="status-pill safe">En zona segura</span>
          </div>
        </div>
      } @else {
        <div class="split-layout">
          <section class="card route-panel">
            <div class="date-selector">‹ <strong>Martes, 24 sep · 09:00—10:00</strong> ›</div>
            <div class="route-stats">
              <div><strong>4,2 km</strong><span>Distancia</span></div>
              <div><strong>58 min</strong><span>Duración</span></div>
              <div><strong>3</strong><span>Paradas</span></div>
            </div>
            <h3>Recorrido</h3>
            @for (point of store.routePoints(); track point.time; let idx = $index) {
              <div class="timeline">
                <b>{{ idx + 1 }}</b>
                <div>
                  <small>{{ point.time }}</small>
                  <strong>{{ point.placeName }}</strong>
                  <span>{{ point.status }}</span>
                </div>
              </div>
            }
          </section>
          <app-map-visual [large]="true"></app-map-visual>
        </div>
      }
    </div>
  `,
})
export class LocationViewComponent implements OnInit, OnDestroy {
  store = inject(MonitoringStore);
  isHistory = signal(false);
  currentTime = signal<string>('10:42 AM');
  private intervalTimer: any;

  ngOnInit(): void {
    this.updateClock();
    this.intervalTimer = setInterval(() => {
      this.updateClock();
    }, 120000);
  }

  ngOnDestroy(): void {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }
  }

  private updateClock(): void {
    const now = new Date();
    this.currentTime.set(
      now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    );
  }

  toggleHistory(): void {
    this.isHistory.update((v) => !v);
  }
}

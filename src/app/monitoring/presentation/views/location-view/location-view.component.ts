import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletMapComponent } from '../../components/leaflet-map/leaflet-map.component';
import { MonitoringStore } from '../../../application/monitoring.store';
import { I18nService } from '../../../../shared/services/i18n.service';

@Component({
  selector: 'app-location-view',
  standalone: true,
  imports: [CommonModule, LeafletMapComponent],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">{{ i18n.t('location.eyebrow') }}</p>
          <h1>
            {{ isHistory() ? i18n.t('location.historyTitle') : i18n.t('location.realtimeTitle') }}
          </h1>
          <p>
            {{
              isHistory()
                ? i18n.t('location.historySubtitle')
                : i18n.t('location.realtimeSubtitle') + ' (' + currentTime() + ')'
            }}
          </p>
        </div>
        <button class="primary-btn" (click)="toggleHistory()">
          {{ isHistory() ? i18n.t('location.btnReturn') : i18n.t('location.btnHistory') }}
        </button>
      </div>

      @if (!isHistory()) {
        <div class="full-map-card">
          <app-leaflet-map [large]="true"></app-leaflet-map>

          <div class="floating-person">
            <div class="avatar elder">EM</div>
            <div>
              <small>{{ i18n.t('location.currentTag') }}</small>
              <strong>Elena Martínez</strong>
              <span>Av. José Pardo 500 · {{ i18n.t('location.precision') }} 8 m</span>
            </div>
            <span class="status-pill safe">{{ i18n.t('location.inSafeZone') }}</span>
          </div>
        </div>
      } @else {
        <div class="split-layout">
          <section class="card route-panel">
            <div class="date-selector">
              ‹ <strong>{{ i18n.t('location.historyDateRange') }}</strong> ›
            </div>
            <div class="route-stats">
              <div>
                <strong>4,2 km</strong><span>{{ i18n.t('location.distance') }}</span>
              </div>
              <div>
                <strong>58 min</strong><span>{{ i18n.t('location.duration') }}</span>
              </div>
              <div>
                <strong>3</strong><span>{{ i18n.t('location.stops') }}</span>
              </div>
            </div>
            <h3>{{ i18n.t('location.routeHeading') }}</h3>
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

          <app-leaflet-map [large]="true"></app-leaflet-map>
        </div>
      }
    </div>
  `,
})
export class LocationViewComponent implements OnInit, OnDestroy {
  i18n = inject(I18nService);
  store = inject(MonitoringStore);

  isHistory = signal(false);
  currentTime = signal<string>('10:42 AM');
  private intervalTimer: any;

  ngOnInit(): void {
    this.updateClock();
    this.intervalTimer = setInterval(() => {
      this.updateClock();
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.intervalTimer) clearInterval(this.intervalTimer);
  }

  private updateClock(): void {
    const now = new Date();
    const locale = this.i18n.currentLang() === 'en' ? 'en-US' : 'es-PE';
    this.currentTime.set(
      now.toLocaleTimeString(locale, {
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

// dashboard-view.component.ts
import { Component, OnInit, OnDestroy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';
import { LeafletMapComponent } from '../../components/leaflet-map/leaflet-map.component';
import { LocalDbService } from '../../../../core/infrastructure/local-db.service';
import { AlertsStore } from '../../../../alerts/application/alerts.store';
import { CareNetworkStore } from '../../../../care-network/application/care-network.store';
import { I18nService } from '../../../../shared/services/i18n.service';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, LeafletMapComponent],
  template: `
    <div class="content">
      <div class="page-heading">
        <div>
          <p class="eyebrow">{{ i18n.t('dashboard.eyebrow') }}</p>
          <h1>{{ i18n.t('dashboard.greeting') }}</h1>
          <p>
            {{
              hasCriticalAlert()
                ? i18n.t('dashboard.criticalAlertMessage')
                : i18n.t('dashboard.safeMessage')
            }}
          </p>
        </div>
        <button class="outline-btn">
          <span class="online-dot"></span>
          {{
            device()?.status === 'CONECTADA'
              ? i18n.t('dashboard.systemOperational')
              : i18n.t('dashboard.deviceDisconnected')
          }}
        </button>
      </div>

      <section class="safe-banner">
        <div class="safe-icon"><app-icon [name]="'shield'" [size]="25"></app-icon></div>
        <div>
          <span class="status-pill safe">{{ i18n.t('dashboard.currentStatus') }}</span>
          <h2>
            {{
              currentZone() ? i18n.t('dashboard.elenaSafe') : i18n.t('dashboard.monitoringLocation')
            }}
          </h2>
          <p>
            {{
              currentZone()
                ? i18n.t('dashboard.insideSafeZone') + ' · ' + currentZone()?.name
                : i18n.t('dashboard.habitualLocation')
            }}
          </p>
        </div>
        <div class="safe-time">
          <small>{{ i18n.t('dashboard.lastUpdate') }}</small>
          <strong>{{ currentTime() }}</strong>
          <span>{{ device()?.lastSync ?? 'Hace 2 min' }}</span>
        </div>
      </section>

      <div class="dashboard-grid">
        <section class="card location-card">
          <div class="card-head">
            <div>
              <h3>{{ i18n.t('dashboard.currentLocation') }}</h3>
              <p>{{ i18n.t('dashboard.gpsSignal') }} {{ device()?.gpsSignal ?? 'Alta' }}</p>
            </div>
            <button class="text-btn" routerLink="/monitoring/location">
              {{ i18n.t('dashboard.seeMap') }} <app-icon [name]="'arrow'" [size]="16"></app-icon>
            </button>
          </div>

          <app-leaflet-map></app-leaflet-map>

          @if (currentZone(); as zone) {
            <div class="place-row">
              <div class="place-icon"><app-icon [name]="zone.iconType"></app-icon></div>
              <div>
                <strong>{{ zone.name }}</strong>
                <span>{{ zone.address }}</span>
              </div>
              <span class="status-pill safe">{{ i18n.t('dashboard.safeZonePill') }}</span>
            </div>
          }
        </section>

        <section class="side-stack">
          <div class="card">
            <div class="card-head">
              <div>
                <h3>{{ i18n.t('dashboard.todaySummary') }}</h3>
                <p>{{ i18n.t('dashboard.activityRegistered') }}</p>
              </div>
              <app-icon [name]="'pulse'"></app-icon>
            </div>
            <div class="metrics">
              <div>
                <span class="metric-icon mint"><app-icon [name]="'steps'"></app-icon></span>
                <strong>3.842</strong><small>{{ i18n.t('dashboard.stepsToday') }}</small>
              </div>
              <div>
                <span class="metric-icon peach"><app-icon [name]="'battery'"></app-icon></span>
                <strong>{{ device()?.battery ?? 78 }}%</strong>
                <small>{{ i18n.t('dashboard.battery') }}</small>
              </div>
            </div>
            <div class="progress"><span style="width: 62%;"></span></div>
            <p class="goal">{{ i18n.t('dashboard.goalText') }}</p>
          </div>

          <div class="card alert-mini">
            <div class="card-head">
              <div>
                <h3>{{ i18n.t('dashboard.recentAlert') }}</h3>
                <p>{{ i18n.t('dashboard.requiresAttention') }}</p>
              </div>
              @if (recentAlert(); as al) {
                <span [class]="'status-pill ' + (al.status === 'Pendiente' ? 'danger' : 'safe')">
                  {{ al.status }}
                </span>
              }
            </div>

            @if (recentAlert(); as al) {
              <div class="alert-content">
                <span class="warn-icon">
                  <app-icon [name]="al.type === 'warning' ? 'battery' : 'bell'"></app-icon>
                </span>
                <div>
                  <strong>{{ al.title }}</strong>
                  <p>{{ al.description }}</p>
                  <small>{{ al.timestamp }}</small>
                </div>
              </div>
              <button class="wide-secondary" routerLink="/alerts">
                {{ i18n.t('dashboard.reviewAlert') }}
              </button>
            } @else {
              <p class="empty-text">{{ i18n.t('dashboard.noAlerts') }}</p>
            }
          </div>
        </section>
      </div>

      <section class="card caregivers">
        <div class="card-head">
          <div>
            <h3>{{ i18n.t('dashboard.careNetwork') }}</h3>
            <p>
              {{ careNetworkStore.caregivers().length }}
              {{ i18n.t('dashboard.registeredCaregivers') }}
            </p>
          </div>
          <button class="text-btn" routerLink="/care-network">
            {{ i18n.t('dashboard.manageNetwork') }}
            <app-icon [name]="'arrow'" [size]="16"></app-icon>
          </button>
        </div>
        <div class="caregiver-list">
          @for (c of careNetworkStore.caregivers(); track c.name; let i = $index) {
            <div class="caregiver">
              <div [class]="'avatar av' + (i % 3)">{{ c.initials }}</div>
              <div>
                <strong>{{ c.name }}</strong>
                <span>{{ c.role }}</span>
              </div>
              <span class="availability"><i></i>{{ c.availability }}</span>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .empty-text {
        color: var(--muted);
        font-size: 13px;
        padding: 12px 0;
      }
    `,
  ],
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  i18n = inject(I18nService);
  private db = inject(LocalDbService);
  private alertsStore = inject(AlertsStore);
  careNetworkStore = inject(CareNetworkStore);

  readonly device = this.db.currentDevice;
  readonly currentZone = computed(() => this.db.safeZones().find((z) => z.isActive) ?? null);

  readonly recentAlert = computed(() => {
    const list = this.alertsStore.alerts();
    return list.find((a) => a.status === 'Pendiente') || list[0] || null;
  });

  readonly hasCriticalAlert = computed(() => {
    return this.alertsStore.alerts().some((a) => a.status === 'Pendiente' && a.type === 'critical');
  });

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
}

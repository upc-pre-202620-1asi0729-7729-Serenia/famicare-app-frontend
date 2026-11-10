import { Component, OnInit, OnDestroy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';
import { LeafletMapComponent } from '../../components/leaflet-map/leaflet-map.component';
import { LocalDbService } from '../../../../core/infrastructure/local-db.service';
import { AlertsStore } from '../../../../alerts/application/alerts.store';
import { CareNetworkStore } from '../../../../care-network/application/care-network.store';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, LeafletMapComponent],
  template: `
    <div class="content">
      <div class="page-heading">
        <div>
          <p class="eyebrow">PANEL GENERAL</p>
          <h1>Buenos días, Valeria</h1>
          <p>
            {{
              hasCriticalAlert()
                ? 'Atención: Se han registrado novedades con Elena.'
                : 'Todo está tranquilo con Elena esta mañana.'
            }}
          </p>
        </div>
        <button class="outline-btn">
          <span class="online-dot"></span>
          {{ device()?.status === 'CONECTADA' ? 'Sistema operativo' : 'Dispositivo sin conexión' }}
        </button>
      </div>

      <section class="safe-banner">
        <div class="safe-icon"><app-icon name="shield" [size]="25"></app-icon></div>
        <div>
          <span class="status-pill safe">ESTADO ACTUAL</span>
          <h2>{{ currentZone() ? 'Elena está segura' : 'Monitoreando ubicación' }}</h2>
          <p>
            {{
              currentZone()
                ? 'Dentro de la zona segura · ' + currentZone()?.name
                : 'Ubicación en rango habitual'
            }}
          </p>
        </div>
        <div class="safe-time">
          <small>ÚLTIMA ACTUALIZACIÓN</small>
          <strong>{{ currentTime() }}</strong>
          <span>{{ device()?.lastSync ?? 'Hace 2 min' }}</span>
        </div>
      </section>

      <div class="dashboard-grid">
        <section class="card location-card">
          <div class="card-head">
            <div>
              <h3>Ubicación actual</h3>
              <p>Precisión GPS: Señal {{ device()?.gpsSignal ?? 'Alta' }}</p>
            </div>
            <button class="text-btn" routerLink="/monitoring/location">
              Ver mapa <app-icon name="arrow" [size]="16"></app-icon>
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
              <span class="status-pill safe">Zona segura</span>
            </div>
          }
        </section>

        <section class="side-stack">
          <div class="card">
            <div class="card-head">
              <div>
                <h3>Resumen de hoy</h3>
                <p>Actividad registrada</p>
              </div>
              <app-icon name="pulse"></app-icon>
            </div>
            <div class="metrics">
              <div>
                <span class="metric-icon mint"><app-icon name="steps"></app-icon></span>
                <strong>3.842</strong><small>pasos hoy</small>
              </div>
              <div>
                <span class="metric-icon peach"><app-icon name="battery"></app-icon></span>
                <strong>{{ device()?.battery ?? 78 }}%</strong>
                <small>batería</small>
              </div>
            </div>
            <div class="progress"><span style="width: 62%;"></span></div>
            <p class="goal">62% de la meta diaria de actividad</p>
          </div>

          <div class="card alert-mini">
            <div class="card-head">
              <div>
                <h3>Alerta reciente</h3>
                <p>Requiere tu atención</p>
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
              <button class="wide-secondary" routerLink="/alerts">Revisar alerta</button>
            } @else {
              <p class="empty-text">No hay alertas activas en este momento.</p>
            }
          </div>
        </section>
      </div>

      <section class="card caregivers">
        <div class="card-head">
          <div>
            <h3>Red de cuidado</h3>
            <p>{{ careNetworkStore.caregivers().length }} cuidadores registrados</p>
          </div>
          <button class="text-btn" routerLink="/care-network">
            Gestionar red <app-icon name="arrow" [size]="16"></app-icon>
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
    this.currentTime.set(
      now.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    );
  }
}

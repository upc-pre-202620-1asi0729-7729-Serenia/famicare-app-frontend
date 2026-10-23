import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';
import { MapVisualComponent } from '../../../../shared/presentation/components/map-visual/map-visual.component';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, MapVisualComponent],
  template: `
    <div class="content">
      <div class="page-heading">
        <div>
          <p class="eyebrow">MARTES, 24 DE SEPTIEMBRE</p>
          <h1>Buenos días, Valeria</h1>
          <p>Todo está tranquilo con Elena esta mañana.</p>
        </div>
        <button class="outline-btn"><span class="online-dot"></span> Sistema operativo</button>
      </div>

      <section class="safe-banner">
        <div class="safe-icon"><app-icon name="shield" [size]="25"></app-icon></div>
        <div>
          <span class="status-pill safe">ESTADO ACTUAL</span>
          <h2>Elena está segura</h2>
          <p>Dentro de la zona segura · Casa de Elena</p>
        </div>
        <div class="safe-time">
          <small>ÚLTIMA ACTUALIZACIÓN</small>
          <strong>{{ currentTime() }}</strong>
          <span>Hace 2 min</span>
        </div>
      </section>

      <div class="dashboard-grid">
        <section class="card location-card">
          <div class="card-head">
            <div>
              <h3>Ubicación actual</h3>
              <p>Precisión GPS de 8 metros</p>
            </div>
            <button class="text-btn" routerLink="/monitoring/location">
              Ver mapa <app-icon name="arrow" [size]="16"></app-icon>
            </button>
          </div>
          <app-map-visual></app-map-visual>
          <div class="place-row">
            <div class="place-icon"><app-icon name="home"></app-icon></div>
            <div><strong>Casa de Elena</strong><span>Calle Santiago 42, Madrid</span></div>
            <span class="status-pill safe">Zona segura</span>
          </div>
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
                <strong>78%</strong><small>batería</small>
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
              <span class="status-pill warn">PENDIENTE</span>
            </div>
            <div class="alert-content">
              <span class="warn-icon"><app-icon name="battery"></app-icon></span>
              <div>
                <strong>Batería baja detectada</strong>
                <p>La pulsera llegó al 20%</p>
                <small>Hoy, 9:18 AM</small>
              </div>
            </div>
            <button class="wide-secondary" routerLink="/alerts">Revisar alerta</button>
          </div>
        </section>
      </div>

      <section class="card caregivers">
        <div class="card-head">
          <div>
            <h3>Red de cuidado</h3>
            <p>3 cuidadores activos y disponibles</p>
          </div>
          <button class="text-btn" routerLink="/care-network">
            Gestionar red <app-icon name="arrow" [size]="16"></app-icon>
          </button>
        </div>
        <div class="caregiver-list">
          <div class="caregiver">
            <div class="avatar av0">VR</div>
            <div><strong>Valeria Ríos</strong><span>Cuidadora principal</span></div>
            <span class="availability"><i></i>En línea</span>
          </div>
          <div class="caregiver">
            <div class="avatar av1">JM</div>
            <div><strong>Javier Martínez</strong><span>Familiar</span></div>
            <span class="availability"><i></i>Disponible</span>
          </div>
          <div class="caregiver">
            <div class="avatar av2">LS</div>
            <div><strong>Lucía Santos</strong><span>Enfermera</span></div>
            <span class="availability"><i></i>Hasta las 18:00</span>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  currentTime = signal<string>('');
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
}

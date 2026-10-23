import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';
import { AlertDetailModalComponent } from '../../components/alert-detail-modal/alert-detail-modal.component';
import { AlertsStore } from '../../../application/alerts.store';

@Component({
  selector: 'app-alerts-view',
  standalone: true,
  imports: [CommonModule, IconComponent, AlertDetailModalComponent],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">Centro de alertas</p>
          <h1>Alertas y eventos</h1>
          <p>Revisa y atiende eventos importantes</p>
        </div>
      </div>

      <section class="card data-card">
        <div class="filter-row">
          @for (cat of categories; track cat) {
            <button [class.active]="store.filter() === cat" (click)="store.filter.set(cat)">
              {{ cat }}
            </button>
          }
        </div>

        @for (alert of store.filteredAlerts(); track alert.id) {
          <div class="alert-row">
            <span [class]="'event-icon ' + alert.type">
              <app-icon [name]="alert.type === 'warning' ? 'battery' : 'bell'"></app-icon>
            </span>
            <div>
              <strong>{{ alert.title }}</strong>
              <span>{{ alert.description }}</span>
              <small>{{ alert.timestamp }}</small>
            </div>
            <span [class]="'status-pill ' + (alert.status === 'Pendiente' ? 'danger' : 'safe')">
              {{ alert.status }}
            </span>
            <button class="text-btn" (click)="store.selectedAlert.set(alert)">
              Ver detalles <app-icon name="arrow" [size]="16"></app-icon>
            </button>
          </div>
        }
      </section>
    </div>

    @if (store.selectedAlert()) {
      <app-alert-detail-modal
        (close)="store.selectedAlert.set(null)"
        (resolve)="store.resolveSelectedAlert()"
      >
      </app-alert-detail-modal>
    }
  `,
})
export class AlertsViewComponent {
  store = inject(AlertsStore);
  categories = ['Todas', 'Emergencias SOS', 'Salida de zona', 'Batería baja', 'Inactividad'];
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';
import { AlertDetailModalComponent } from '../../components/alert-detail-modal/alert-detail-modal.component';
import { AlertsStore } from '../../../application/alerts.store';
import { I18nService } from '../../../../shared/services/i18n.service';

@Component({
  selector: 'app-alerts-view',
  standalone: true,
  imports: [CommonModule, IconComponent, AlertDetailModalComponent],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">{{ i18n.t('alerts.eyebrow') }}</p>
          <h1>{{ i18n.t('alerts.title') }}</h1>
          <p>{{ i18n.t('alerts.subtitle') }}</p>
        </div>
      </div>

      <section class="card data-card">
        <div class="filter-row">
          @for (cat of categories; track cat.id) {
            <button [class.active]="store.filter() === cat.id" (click)="store.filter.set(cat.id)">
              {{ i18n.t(cat.key) }}
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
            <span
              [class]="
                'status-pill ' +
                (alert.status === 'Pendiente'
                  ? 'danger'
                  : alert.status === 'Resuelta'
                    ? 'safe'
                    : 'warning')
              "
            >
              {{
                alert.status === 'Pendiente'
                  ? i18n.t('alerts.status.pending')
                  : alert.status === 'Resuelta'
                    ? i18n.t('alerts.status.resolved')
                    : i18n.t('alerts.status.attended')
              }}
            </span>
            <button class="text-btn" (click)="store.selectedAlert.set(alert)">
              {{ i18n.t('alerts.viewDetails') }}
              <app-icon [name]="'arrow'" [size]="16"></app-icon>
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
  i18n = inject(I18nService);
  store = inject(AlertsStore);

  categories = [
    { id: 'Todas', key: 'alerts.filter.all' },
    { id: 'Emergencias SOS', key: 'alerts.filter.sos' },
    { id: 'Salida de zona', key: 'alerts.filter.zone' },
    { id: 'Batería baja', key: 'alerts.filter.battery' },
    { id: 'Inactividad', key: 'alerts.filter.inactivity' },
  ];
}

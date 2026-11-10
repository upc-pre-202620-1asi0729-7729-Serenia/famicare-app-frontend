import { Injectable, computed, inject, signal } from '@angular/core';
import { LocalDbService } from '../../core/infrastructure/local-db.service';
import { AlertEvent } from '../domain/model/alert.entity';

@Injectable({ providedIn: 'root' })
export class AlertsStore {
  private db = inject(LocalDbService);

  readonly filter = signal<string>('Todas');
  readonly selectedAlert = signal<AlertEvent | null>(null);
  readonly alerts = this.db.alerts;

  readonly pendingAlertsCount = computed(() => {
    return this.alerts().filter((a) => a.status === 'Pendiente').length;
  });

  readonly filteredAlerts = computed(() => {
    const f = this.filter();
    if (f === 'Todas') return this.alerts();
    if (f === 'Emergencias SOS' || f === 'Salida de zona') {
      return this.alerts().filter((a) => a.type === 'critical');
    }
    if (f === 'Batería baja') return this.alerts().filter((a) => a.type === 'warning');
    if (f === 'Inactividad') return this.alerts().filter((a) => a.type === 'neutral');
    return this.alerts();
  });

  resolveAlert(id: string): void {
    this.db.updateAlertStatus(id, 'Resuelta');
    if (this.selectedAlert()?.id === id) {
      this.selectedAlert.set(null);
    }
  }

  attendAlert(id: string): void {
    this.db.updateAlertStatus(id, 'Atendida por Valeria');
    if (this.selectedAlert()?.id === id) {
      this.selectedAlert.set(null);
    }
  }

  resolveSelectedAlert(): void {
    const sel = this.selectedAlert();
    if (sel) {
      this.resolveAlert(sel.id);
    }
  }
}

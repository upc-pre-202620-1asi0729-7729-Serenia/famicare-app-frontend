import { Injectable, computed, signal } from '@angular/core';
import { AlertEvent } from '../domain/model/alert.entity';

@Injectable({ providedIn: 'root' })
export class AlertsStore {
  readonly filter = signal<string>('Todas');
  readonly selectedAlert = signal<AlertEvent | null>(null);

  readonly alerts = signal<AlertEvent[]>([
    {
      id: '1',
      type: 'critical',
      title: 'Salida de zona segura',
      description: 'Elena salió de Casa de Elena',
      timestamp: 'Hoy, 11:04 AM',
      status: 'Pendiente',
    },
    {
      id: '2',
      type: 'warning',
      title: 'Batería baja',
      description: 'La pulsera llegó al 20%',
      timestamp: 'Hoy, 9:18 AM',
      status: 'Atendida por Valeria',
    },
    {
      id: '3',
      type: 'neutral',
      title: 'Inactividad prolongada',
      description: 'Sin movimiento durante 45 minutos',
      timestamp: 'Ayer, 4:32 PM',
      status: 'Resuelta',
    },
  ]);

  readonly filteredAlerts = computed(() => {
    const f = this.filter();
    if (f === 'Todas') return this.alerts();
    if (f === 'Emergencias SOS' || f === 'Salida de zona')
      return this.alerts().filter((a) => a.type === 'critical');
    if (f === 'Batería baja') return this.alerts().filter((a) => a.type === 'warning');
    if (f === 'Inactividad') return this.alerts().filter((a) => a.type === 'neutral');
    return this.alerts();
  });

  resolveSelectedAlert(): void {
    const sel = this.selectedAlert();
    if (sel) {
      this.alerts.update((items) =>
        items.map((a) => (a.id === sel.id ? { ...a, status: 'Resuelta' } : a)),
      );
      this.selectedAlert.set(null);
    }
  }
}

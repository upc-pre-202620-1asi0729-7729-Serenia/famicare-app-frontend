import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AlertEvent } from '../domain/model/alert.entity';

interface BackendAlertResource {
  id: number;
  elderlyProfileId: number;
  type: 'CRITICAL' | 'WARNING' | 'NEUTRAL';
  category: string;
  title: string;
  description: string;
  status: 'PENDING' | 'ATTENDED' | 'RESOLVED';
  attendedBy: string;
  createdAt: string;
  resolvedAt: string;
}

@Injectable({ providedIn: 'root' })
export class AlertsStore {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/alerts`;
  private readonly elderlyProfileId = 1;

  readonly filter = signal<string>('Todas');
  readonly selectedAlert = signal<AlertEvent | null>(null);
  readonly alerts = signal<AlertEvent[]>([]);

  constructor() {
    this.loadAlerts();
  }

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

  loadAlerts(): void {
    this.http
      .get<BackendAlertResource[]>(`${this.apiUrl}?elderlyProfileId=${this.elderlyProfileId}`)
      .pipe(catchError(() => of([])))
      .subscribe((items) => {
        this.alerts.set(items.map((item) => this.mapToEntity(item)));
      });
  }

  resolveAlert(id: string): void {
    this.http
      .patch<BackendAlertResource>(`${this.apiUrl}/${id}/resolve`, {})
      .subscribe((updated) => {
        this.alerts.update((prev) =>
          prev.map((a) => (a.id === id ? this.mapToEntity(updated) : a)),
        );
        if (this.selectedAlert()?.id === id) {
          this.selectedAlert.set(null);
        }
      });
  }

  attendAlert(id: string): void {
    this.http
      .patch<BackendAlertResource>(`${this.apiUrl}/${id}/attend`, { attendedBy: 'Valeria Ríos' })
      .subscribe((updated) => {
        this.alerts.update((prev) =>
          prev.map((a) => (a.id === id ? this.mapToEntity(updated) : a)),
        );
        if (this.selectedAlert()?.id === id) {
          this.selectedAlert.set(null);
        }
      });
  }

  resolveSelectedAlert(): void {
    const sel = this.selectedAlert();
    if (sel) {
      this.resolveAlert(sel.id);
    }
  }

  private mapToEntity(dto: BackendAlertResource): AlertEvent {
    const typeMap: Record<string, AlertEvent['type']> = {
      CRITICAL: 'critical',
      WARNING: 'warning',
      NEUTRAL: 'neutral',
    };
    const statusMap: Record<string, AlertEvent['status']> = {
      PENDING: 'Pendiente',
      ATTENDED: 'Atendida por Valeria',
      RESOLVED: 'Resuelta',
    };

    return {
      id: String(dto.id),
      type: typeMap[dto.type] ?? 'neutral',
      title: dto.title,
      description: dto.description,
      timestamp: this.formatTimestamp(dto.createdAt),
      status: statusMap[dto.status] ?? 'Pendiente',
    };
  }

  private formatTimestamp(iso: string): string {
    if (!iso) return 'Reciente';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }
}

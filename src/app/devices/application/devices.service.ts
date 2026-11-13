import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeviceConfig } from '../../core/infrastructure/local-db.service';

@Injectable({ providedIn: 'root' })
export class DevicesService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/devices`;
  private readonly elderlyProfileId = 1;

  readonly currentDevice = signal<DeviceConfig | null>(null);

  constructor() {
    this.loadDevices();
  }

  loadDevices(): void {
    this.http
      .get<any[]>(`${this.apiUrl}?elderlyProfileId=${this.elderlyProfileId}`)
      .pipe(catchError(() => of([])))
      .subscribe((devices) => {
        if (devices.length > 0) {
          this.currentDevice.set(this.mapDevice(devices[devices.length - 1]));
        }
      });
  }

  pairDevice(pairingCode: string): Observable<DeviceConfig> {
    const pairPayload = { pairingCode, elderlyProfileId: this.elderlyProfileId };

    return this.http.post<any>(`${this.apiUrl}/pair`, pairPayload).pipe(
      catchError((err) => {
        if (err.status === 404) {
          return this.http
            .post<any>(this.apiUrl, { pairingCode })
            .pipe(switchMap(() => this.http.post<any>(`${this.apiUrl}/pair`, pairPayload)));
        }
        return throwError(() => err);
      }),
      map((res) => this.mapDevice(res)),
      tap((mapped) => this.currentDevice.set(mapped)),
    );
  }

  private mapDevice(dto: any): DeviceConfig {
    const code = dto.pairingCode ?? 'FAMI-0000';
    return {
      id: String(dto.id),
      deviceCode: code,
      modelName: `Pulsera FC-${code.slice(0, 6)}`,
      battery: dto.batteryLevel ?? 100,
      gpsSignal: 'Alta',
      status: dto.status === 'PAIRED' ? 'CONECTADA' : 'DESCONECTADA',
      reportIntervalMinutes: 2,
      fallSensitivity: 'Alta',
      lastSync: dto.lastHeartbeat
        ? new Date(dto.lastHeartbeat).toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Sincronizado',
    };
  }
}

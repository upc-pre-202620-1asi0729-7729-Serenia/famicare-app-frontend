import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateSafeZoneDto, SafeZone } from '../domain/model/safe-zone.entity';
import { RoutePoint } from '../domain/model/route-point.entity';

@Injectable({ providedIn: 'root' })
export class MonitoringStore {
  private http = inject(HttpClient);
  private readonly zonesUrl = `${environment.apiUrl}/safe-zones`;
  private readonly trackingUrl = `${environment.apiUrl}/monitor/tracking`;
  private readonly elderlyProfileId = 1;

  readonly safeZones = signal<SafeZone[]>([]);
  readonly isCreateModalOpen = signal(false);
  readonly routePoints = signal<RoutePoint[]>([]);

  constructor() {
    this.loadSafeZones();
    this.loadRouteHistory();
  }

  loadSafeZones(): void {
    this.http
      .get<any[]>(`${this.zonesUrl}?elderlyProfileId=${this.elderlyProfileId}`)
      .pipe(catchError(() => of([])))
      .subscribe((zones) => {
        this.safeZones.set(zones.map((z) => this.mapZone(z)));
      });
  }

  loadRouteHistory(): void {
    this.http
      .get<any[]>(`${this.trackingUrl}/locations/history?elderlyProfileId=${this.elderlyProfileId}`)
      .pipe(catchError(() => of([])))
      .subscribe((records) => {
        if (records.length === 0) return;
        this.routePoints.set(
          records.map((r, index) => ({
            time: r.recordedAt
              ? new Date(r.recordedAt).toLocaleTimeString('es-PE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '--:--',
            placeName:
              r.placeName || `${Number(r.latitude).toFixed(4)}, ${Number(r.longitude).toFixed(4)}`,
            status: index === 0 ? 'Zona segura' : 'En camino',
          })),
        );
      });
  }

  toggleZone(id: string): void {
    this.safeZones.update((prev) =>
      prev.map((z) => (z.id === id ? { ...z, isActive: !z.isActive } : z)),
    );
  }

  addZone(zoneDto: CreateSafeZoneDto): void {
    const baseLat = -12.118995;
    const baseLng = -77.033523;
    const payload = {
      elderlyProfileId: this.elderlyProfileId,
      name: zoneDto.name,
      latitude: zoneDto.lat ?? baseLat,
      longitude: zoneDto.lng ?? baseLng,
      radiusMeters: Math.max(50, Math.min(10000, zoneDto.radiusMeters || 150)),
    };

    this.http.post<any>(this.zonesUrl, payload).subscribe((created) => {
      const mapped = this.mapZone(created, zoneDto.address, zoneDto.iconType);
      this.safeZones.update((prev) => [...prev, mapped]);
      this.isCreateModalOpen.set(false);
    });
  }

  private mapZone(
    dto: any,
    fallbackAddress = 'Lima, Perú',
    fallbackIcon?: 'home' | 'pin',
  ): SafeZone {
    const name: string = dto.name ?? 'Zona Segura';
    return {
      id: String(dto.id),
      name,
      address: fallbackAddress,
      radiusMeters: dto.radiusMeters ?? 150,
      isActive: true,
      lat: Number(dto.latitude ?? dto.centerLatitude ?? -12.118995),
      lng: Number(dto.longitude ?? dto.centerLongitude ?? -77.033523),
      iconType: fallbackIcon ?? (name.toLowerCase().includes('casa') ? 'home' : 'pin'),
    };
  }
}

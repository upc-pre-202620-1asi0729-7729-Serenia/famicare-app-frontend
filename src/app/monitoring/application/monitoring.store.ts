import { Injectable, inject, signal } from '@angular/core';
import { LocalDbService } from '../../core/infrastructure/local-db.service';
import { CreateSafeZoneDto } from '../domain/model/safe-zone.entity';
import { RoutePoint } from '../domain/model/route-point.entity';

@Injectable({ providedIn: 'root' })
export class MonitoringStore {
  private db = inject(LocalDbService);

  readonly safeZones = this.db.safeZones;
  readonly isCreateModalOpen = signal(false);

  readonly routePoints = signal<RoutePoint[]>([
    { time: '09:02', placeName: 'Casa de Elena', status: 'Salida' },
    { time: '09:18', placeName: 'Parque Kennedy', status: 'Zona segura' },
    { time: '09:44', placeName: 'Av. José Pardo', status: 'En camino' },
    { time: '10:00', placeName: 'Casa de Elena', status: 'Llegada' },
  ]);

  toggleZone(id: string): void {
    this.db.toggleZoneState(id);
  }

  addZone(zoneDto: CreateSafeZoneDto): void {
    this.db.saveZone(zoneDto);
    this.isCreateModalOpen.set(false);
  }
}

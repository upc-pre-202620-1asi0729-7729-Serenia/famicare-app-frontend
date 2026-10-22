import { Injectable, signal } from '@angular/core';
import { SafeZone } from '../domain/model/safe-zone.entity';
import { RoutePoint } from '../domain/model/route-point.entity';

@Injectable({ providedIn: 'root' })
export class MonitoringStore {
  readonly safeZones = signal<SafeZone[]>([
    {
      id: '1',
      name: 'Casa de Elena',
      address: 'Calle Santiago 42',
      radiusMeters: 300,
      isActive: true,
      iconType: 'home',
    },
    {
      id: '2',
      name: 'Parque Castilla',
      address: 'Paseo de la Castellana',
      radiusMeters: 180,
      isActive: true,
      iconType: 'pin',
    },
  ]);

  readonly routePoints = signal<RoutePoint[]>([
    { time: '09:02', placeName: 'Casa de Elena', status: 'Salida' },
    { time: '09:18', placeName: 'Parque Castilla', status: 'Zona segura' },
    { time: '09:44', placeName: 'Avenida Principal', status: 'En camino' },
    { time: '10:00', placeName: 'Casa de Elena', status: 'Llegada' },
  ]);

  readonly isCreateModalOpen = signal(false);

  toggleZone(id: string): void {
    this.safeZones.update((zones) =>
      zones.map((z) => (z.id === id ? { ...z, isActive: !z.isActive } : z)),
    );
  }

  addZone(zone: Omit<SafeZone, 'id' | 'isActive'>): void {
    const newZone: SafeZone = {
      ...zone,
      id: Date.now().toString(),
      isActive: true,
    };
    this.safeZones.update((zones) => [...zones, newZone]);
    this.isCreateModalOpen.set(false);
  }
}

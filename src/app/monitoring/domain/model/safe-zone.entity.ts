export interface SafeZone {
  id: string;
  name: string;
  address: string;
  radiusMeters: number;
  isActive: boolean;
  lat: number;
  lng: number;
  iconType: 'home' | 'pin';
}

export type CreateSafeZoneDto = Omit<SafeZone, 'id' | 'isActive'>;

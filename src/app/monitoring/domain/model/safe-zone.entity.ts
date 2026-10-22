export interface SafeZone {
  id: string;
  name: string;
  address: string;
  radiusMeters: number;
  isActive: boolean;
  iconType: 'home' | 'pin';
}

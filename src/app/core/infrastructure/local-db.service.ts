import { Injectable, signal } from '@angular/core';
import { SafeZone } from '../../monitoring/domain/model/safe-zone.entity';
import { AlertEvent } from '../../alerts/domain/model/alert.entity';
import { Caregiver } from '../../care-network/domain/model/caregiver.entity';

export interface CardData {
  holderName: string;
  billingAddress: string;
  cardNumber: string;
  expDate: string;
  cvv: string;
}

export interface UserSubscription {
  planType: 'Free' | 'Familiar Plus' | 'Familiar Premium';
  priceMonthly: number;
  currency: 'PEN' | 'USD';
  renewalDate: string;
  isCancelled: boolean;
  cancelEffectiveDate?: string;
  savedCard?: CardData;
}

export interface UserAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  country: string;
  phone: string;
  elderlyId: string;
  subscription: UserSubscription;
  linkedDeviceIds: string[];
}

export interface DeviceConfig {
  id: string;
  deviceCode: string;
  modelName: string;
  battery: number;
  gpsSignal: 'Baja' | 'Media' | 'Alta';
  status: 'CONECTADA' | 'DESCONECTADA';
  reportIntervalMinutes: number;
  fallSensitivity: 'Baja' | 'Media' | 'Alta';
  lastSync: string;
}

export type SafeZoneEntity = SafeZone;

interface AppDatabase {
  user: UserAccount | null;
  safeZones: SafeZone[];
  alerts: AlertEvent[];
  caregivers: Caregiver[];
  device: DeviceConfig | null;
}

@Injectable({ providedIn: 'root' })
export class LocalDbService {
  private readonly STORAGE_KEY = 'famicare_db_v3';
  readonly VALID_NUMERIC_CODES = [
    '204800',
    '100100',
    '778899',
    '990011',
    '552233',
    '334455',
    '881122',
    '449900',
    '663344',
    '123456',
  ];

  readonly currentUser = signal<UserAccount | null>(null);
  readonly safeZones = signal<SafeZone[]>([]);
  readonly alerts = signal<AlertEvent[]>([]);
  readonly caregivers = signal<Caregiver[]>([]);
  readonly currentDevice = signal<DeviceConfig | null>(null);

  constructor() {
    this.initDatabase();
    this.loadAll();
  }

  private initDatabase(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const initialData: AppDatabase = {
        user: {
          id: 'usr_admin_1',
          firstName: 'Valeria',
          lastName: 'Ríos',
          email: 'valeria.rios@email.com',
          birthDate: '1988-06-14',
          country: 'Perú',
          phone: '+51 987 654 321',
          elderlyId: 'eld_admin_1',
          subscription: {
            planType: 'Familiar Premium',
            priceMonthly: 29.99,
            currency: 'PEN',
            renewalDate: nextMonth.toISOString(),
            isCancelled: false,
            savedCard: {
              holderName: 'Valeria Ríos',
              billingAddress: 'Av. José Pardo 500, Miraflores',
              cardNumber: '4111111111114321',
              expDate: '08/28',
              cvv: '123',
            },
          },
          linkedDeviceIds: ['204800'],
        },
        safeZones: [
          {
            id: '1',
            name: 'Casa de Elena',
            address: 'Av. José Pardo 500, Miraflores',
            radiusMeters: 300,
            isActive: true,
            lat: -12.118995,
            lng: -77.033523,
            iconType: 'home',
          },
          {
            id: '2',
            name: 'Parque Kennedy',
            address: 'Diagonal / Malecón Balta',
            radiusMeters: 180,
            isActive: true,
            lat: -12.1215,
            lng: -77.0295,
            iconType: 'pin',
          },
        ],
        alerts: [
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
        ],
        caregivers: [
          {
            initials: 'VR',
            name: 'Valeria Ríos',
            role: 'Cuidadora principal · Administradora',
            availability: 'En línea',
            schedule: 'Todos los días',
          },
          {
            initials: 'JM',
            name: 'Javier Martínez',
            role: 'Familiar · Solo lectura',
            availability: 'Disponible',
            schedule: 'Lun—Vie · 09:00—18:00',
          },
          {
            initials: 'LS',
            name: 'Lucía Santos',
            role: 'Enfermera · Alertas y ubicación',
            availability: 'Hasta las 18:00',
            schedule: 'Lun—Vie · 09:00—18:00',
          },
        ],
        device: {
          id: 'dev_1',
          deviceCode: '204800',
          modelName: 'Pulsera FC-2048',
          battery: 78,
          gpsSignal: 'Alta',
          status: 'CONECTADA',
          reportIntervalMinutes: 2,
          fallSensitivity: 'Alta',
          lastSync: 'Hace 2 minutos',
        },
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
    }
  }

  private loadAll(): void {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return;

    const data: AppDatabase = JSON.parse(raw);
    if (data.user) {
      this.checkSubscriptionExpiry(data.user);
      this.currentUser.set(data.user);
    }
    this.safeZones.set(data.safeZones || []);
    this.alerts.set(data.alerts || []);
    this.caregivers.set(data.caregivers || []);
    this.currentDevice.set(data.device || null);
  }

  private saveCurrentState(): void {
    const payload: AppDatabase = {
      user: this.currentUser(),
      safeZones: this.safeZones(),
      alerts: this.alerts(),
      caregivers: this.caregivers(),
      device: this.currentDevice(),
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
  }

  updateSubscription(newSub: UserSubscription): void {
    const user = this.currentUser();
    if (!user) return;
    user.subscription = newSub;
    this.currentUser.set({ ...user });
    this.saveCurrentState();
  }

  checkSubscriptionExpiry(user: UserAccount): void {
    if (user.subscription.isCancelled && user.subscription.cancelEffectiveDate) {
      const now = new Date();
      if (now >= new Date(user.subscription.cancelEffectiveDate)) {
        user.subscription = {
          planType: 'Free',
          priceMonthly: 0,
          currency: 'PEN',
          renewalDate: '',
          isCancelled: false,
        };
        this.saveCurrentState();
      }
    }
  }

  addDeviceToCurrentUser(code: string): boolean {
    const user = this.currentUser();
    if (!user) return false;

    if (!user.linkedDeviceIds.includes(code)) {
      user.linkedDeviceIds.push(code);
    }

    const newDevice: DeviceConfig = {
      id: 'dev_' + Date.now(),
      deviceCode: code,
      modelName: `Pulsera FC-${code.slice(0, 4)}`,
      battery: 100,
      gpsSignal: 'Alta',
      status: 'CONECTADA',
      reportIntervalMinutes: 2,
      fallSensitivity: 'Alta',
      lastSync: 'Recién sincronizado',
    };

    this.currentDevice.set(newDevice);
    this.currentUser.set({ ...user });
    this.saveCurrentState();
    return true;
  }

  linkDevice(code: string): boolean {
    return this.addDeviceToCurrentUser(code);
  }

  updateDeviceSettings(interval: number, sensitivity: 'Baja' | 'Media' | 'Alta'): void {
    const dev = this.currentDevice();
    if (dev) {
      const updated = { ...dev, reportIntervalMinutes: interval, fallSensitivity: sensitivity };
      this.currentDevice.set(updated);
      this.saveCurrentState();
    }
  }

  saveZone(dto: Partial<SafeZone> & { name: string; address: string; radiusMeters: number }): void {
    const baseLat = -12.1192;
    const baseLng = -77.0315;
    const offsetLat = (Math.random() - 0.5) * 0.008;
    const offsetLng = (Math.random() - 0.5) * 0.008;

    const newZone: SafeZone = {
      id: 'zone_' + Date.now(),
      name: dto.name,
      address: dto.address,
      radiusMeters: dto.radiusMeters,
      isActive: true,
      lat: dto.lat ?? Number((baseLat + offsetLat).toFixed(6)),
      lng: dto.lng ?? Number((baseLng + offsetLng).toFixed(6)),
      iconType: dto.iconType ?? (dto.name.toLowerCase().includes('casa') ? 'home' : 'pin'),
    };

    this.safeZones.update((prev) => [...prev, newZone]);
    this.saveCurrentState();
  }

  addSafeZone(name: string, address: string, radiusMeters: number): void {
    this.saveZone({ name, address, radiusMeters });
  }

  toggleSafeZone(id: string): void {
    this.safeZones.update((prev) =>
      prev.map((z) => (z.id === id ? { ...z, isActive: !z.isActive } : z)),
    );
    this.saveCurrentState();
  }

  toggleZoneState(id: string): void {
    this.toggleSafeZone(id);
  }

  updateAlertStatus(id: string, newStatus: AlertEvent['status']): void {
    this.alerts.update((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    this.saveCurrentState();
  }

  addCaregiver(caregiver: Caregiver): void {
    this.caregivers.update((prev) => [...prev, caregiver]);
    this.saveCurrentState();
  }
}

import { Injectable, signal } from '@angular/core';

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

export interface SafeZoneEntity {
  id: string;
  name: string;
  address: string;
  radiusMeters: number;
  isActive: boolean;
  lat: number;
  lng: number;
}

@Injectable({ providedIn: 'root' })
export class LocalDbService {
  private readonly STORAGE_KEY = 'famicare_db_v1';

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

  currentUser = signal<UserAccount | null>(null);
  safeZones = signal<SafeZoneEntity[]>([]);

  constructor() {
    this.initDatabase();
    this.loadActiveUser();
    this.loadZones();
  }

  private initDatabase(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const defaultUser: UserAccount = {
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
      };

      const defaultZones: SafeZoneEntity[] = [
        {
          id: '1',
          name: 'Casa de Elena',
          address: 'Av. José Pardo 500, Miraflores',
          radiusMeters: 300,
          isActive: true,
          lat: -12.118995,
          lng: -77.033523,
        },
        {
          id: '2',
          name: 'Parque Kennedy',
          address: 'Diagonal / Malecón Balta',
          radiusMeters: 180,
          isActive: true,
          lat: -12.1215,
          lng: -77.0295,
        },
      ];

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify({
          user: defaultUser,
          safeZones: defaultZones,
        }),
      );
    }
  }

  private getDb() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
  }

  private saveDb(db: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(db));
  }

  private loadActiveUser(): void {
    const db = this.getDb();
    if (db.user) {
      this.checkSubscriptionExpiry(db.user);
      this.currentUser.set(db.user);
    }
  }

  loadZones(): void {
    const db = this.getDb();
    this.safeZones.set(db.safeZones || []);
  }

  addSafeZone(name: string, address: string, radiusMeters: number): void {
    const db = this.getDb();
    const newZone: SafeZoneEntity = {
      id: 'zone_' + Date.now(),
      name,
      address,
      radiusMeters,
      isActive: true,
      lat: -12.118995 + (Math.random() - 0.5) * 0.005,
      lng: -77.033523 + (Math.random() - 0.5) * 0.005,
    };
    db.safeZones = [...(db.safeZones || []), newZone];
    this.saveDb(db);
    this.safeZones.set(db.safeZones);
  }

  toggleSafeZone(id: string): void {
    const db = this.getDb();
    db.safeZones = db.safeZones.map((z: SafeZoneEntity) =>
      z.id === id ? { ...z, isActive: !z.isActive } : z,
    );
    this.saveDb(db);
    this.safeZones.set(db.safeZones);
  }

  addDeviceToCurrentUser(code: string): boolean {
    const user = this.currentUser();
    if (!user || user.linkedDeviceIds.includes(code)) return false;
    user.linkedDeviceIds.push(code);
    const db = this.getDb();
    db.user = user;
    this.saveDb(db);
    this.currentUser.set({ ...user });
    return true;
  }

  updateSubscription(newSub: UserSubscription): void {
    const user = this.currentUser();
    if (!user) return;
    const db = this.getDb();
    user.subscription = newSub;
    db.user = user;
    this.saveDb(db);
    this.currentUser.set({ ...user });
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
        const db = this.getDb();
        db.user = user;
        this.saveDb(db);
      }
    }
  }
}

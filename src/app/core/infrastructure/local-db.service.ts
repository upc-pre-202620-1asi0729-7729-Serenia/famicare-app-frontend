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
  currency: 'PEN' | 'EUR';
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
  password: string;
  birthDate: string;
  country: string;
  phone: string;
  elderlyId?: string;
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
  private readonly SESSION_KEY = 'famicare_current_user_id';

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
    this.restoreSession();
  }

  private initDatabase(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const adminUser: UserAccount = {
        id: 'usr_admin_1',
        firstName: 'Serenia',
        lastName: 'Admin',
        email: 'admin@serenia.com',
        password: 'admintest',
        birthDate: '1988-06-14',
        country: 'Perú',
        phone: '+51 935 598 887',
        elderlyId: 'eld_admin_1',
        subscription: {
          planType: 'Familiar Premium',
          priceMonthly: 29.99,
          currency: 'PEN',
          renewalDate: nextMonth.toISOString(),
          isCancelled: false,
          savedCard: {
            holderName: 'Juan Estupiñan',
            billingAddress: 'Calle Santiago 42',
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
          address: 'Calle Santiago 42',
          radiusMeters: 300,
          isActive: true,
          lat: 40.4168,
          lng: -3.7038,
        },
        {
          id: '2',
          name: 'Parque Kennedy',
          address: 'Bajada Balta',
          radiusMeters: 180,
          isActive: true,
          lat: 40.4188,
          lng: -3.7018,
        },
      ];

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify({
          users: [adminUser],
          safeZones: defaultZones,
        }),
      );
    }
  }

  private getDb() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{"users":[],"safeZones":[]}');
  }

  private saveDb(db: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(db));
  }

  login(email: string, pass: string): boolean {
    const db = this.getDb();
    const user = db.users.find(
      (u: UserAccount) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass,
    );
    if (!user) return false;

    this.checkSubscriptionExpiry(user);
    this.currentUser.set(user);
    localStorage.setItem(this.SESSION_KEY, user.id);
    this.loadZones();
    return true;
  }

  register(newUser: Omit<UserAccount, 'id' | 'subscription' | 'linkedDeviceIds'>): boolean {
    const db = this.getDb();
    if (db.users.some((u: UserAccount) => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      return false;
    }

    const createdUser: UserAccount = {
      ...newUser,
      id: 'usr_' + Date.now(),
      subscription: {
        planType: 'Free',
        priceMonthly: 0,
        currency: 'PEN',
        renewalDate: '',
        isCancelled: false,
      },
      linkedDeviceIds: [],
    };

    db.users.push(createdUser);
    this.saveDb(db);
    return true;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.SESSION_KEY);
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
      lat: 40.4168 + (Math.random() - 0.5) * 0.005,
      lng: -3.7038 + (Math.random() - 0.5) * 0.005,
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
    db.users = db.users.map((u: UserAccount) => (u.id === user.id ? user : u));
    this.saveDb(db);
    this.currentUser.set({ ...user });
    return true;
  }

  updateSubscription(newSub: UserSubscription): void {
    const user = this.currentUser();
    if (!user) return;
    const db = this.getDb();
    user.subscription = newSub;
    db.users = db.users.map((u: UserAccount) => (u.id === user.id ? user : u));
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
        db.users = db.users.map((u: UserAccount) => (u.id === user.id ? user : u));
        this.saveDb(db);
      }
    }
  }

  private restoreSession(): void {
    const uid = localStorage.getItem(this.SESSION_KEY);
    const db = this.getDb();
    const user = db.users.find((u: UserAccount) => u.id === uid) || db.users[0];
    if (user) {
      this.checkSubscriptionExpiry(user);
      this.currentUser.set(user);
    }
    this.loadZones();
  }
}

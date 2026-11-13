import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserSubscription } from '../../core/infrastructure/local-db.service';

export interface PaymentMethodPayload {
  token: string;
  brand: string;
  lastFour: string;
  expirationMonth: number;
  expirationYear: number;
}

@Injectable({ providedIn: 'root' })
export class SubscriptionsService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/subscriptions`;
  private readonly userId = 1;

  readonly subscriptionId = signal<number | null>(null);
  readonly subscription = signal<UserSubscription>({
    planType: 'Free',
    priceMonthly: 0,
    currency: 'PEN',
    renewalDate: '',
    isCancelled: false,
  });

  constructor() {
    this.loadSubscription();
  }

  loadSubscription(): void {
    this.http
      .get<any>(`${this.apiUrl}?userId=${this.userId}`)
      .pipe(catchError(() => of(null)))
      .subscribe((res) => {
        if (res) {
          this.subscriptionId.set(res.id);
          this.subscription.set(this.mapSubscription(res));
        }
      });
  }

  savePlanAndCard(
    uiPlan: 'Familiar Plus' | 'Familiar Premium',
    payment: PaymentMethodPayload,
  ): Observable<UserSubscription> {
    const backendPlan = uiPlan === 'Familiar Plus' ? 'FAMILIAR_PLUS' : 'FAMILIAR_PREMIUM';
    const currentId = this.subscriptionId();

    const request$ = currentId
      ? this.http.patch<any>(`${this.apiUrl}/${currentId}/plan`, { planType: backendPlan })
      : this.http.post<any>(this.apiUrl, {
          userId: this.userId,
          planType: backendPlan,
          paymentMethod: payment,
        });

    return request$.pipe(
      tap((res) => this.subscriptionId.set(res.id)),
      map((res) => this.mapSubscription(res)),
      tap((mapped) => this.subscription.set(mapped)),
    );
  }

  updateCardOnly(payment: PaymentMethodPayload): Observable<UserSubscription> {
    const currentId = this.subscriptionId();
    if (!currentId) {
      return this.savePlanAndCard('Familiar Premium', payment);
    }

    return this.http.patch<any>(`${this.apiUrl}/${currentId}/payment-method`, payment).pipe(
      map((res) => this.mapSubscription(res)),
      tap((mapped) => this.subscription.set(mapped)),
    );
  }

  cancelSubscription(): void {
    const currentId = this.subscriptionId();
    if (!currentId) return;

    this.http.post<any>(`${this.apiUrl}/${currentId}/cancel`, {}).subscribe((res) => {
      this.subscription.set(this.mapSubscription(res));
    });
  }

  private mapSubscription(dto: any): UserSubscription {
    const planLabels: Record<string, UserSubscription['planType']> = {
      FREE: 'Free',
      FAMILIAR_PLUS: 'Familiar Plus',
      FAMILIAR_PREMIUM: 'Familiar Premium',
    };
    const pm = dto.paymentMethod ?? dto;
    const lastFour = pm.lastFour ?? pm.cardLastFour;

    return {
      planType: planLabels[dto.planType] ?? 'Familiar Premium',
      priceMonthly: Number(dto.priceMonthly ?? 0),
      currency: dto.currency ?? 'PEN',
      renewalDate: dto.currentPeriodEnd ?? '',
      isCancelled: Boolean(dto.cancelAtPeriodEnd),
      cancelEffectiveDate: dto.cancelEffectiveDate,
      savedCard: lastFour
        ? {
            holderName: 'Valeria Rios',
            billingAddress: 'Lima, Peru',
            cardNumber: `************${lastFour}`,
            expDate: `${String(pm.expirationMonth ?? pm.cardExpMonth ?? 12).padStart(2, '0')}/${String(
              pm.expirationYear ?? pm.cardExpYear ?? 2028,
            ).slice(-2)}`,
            cvv: '***',
          }
        : undefined,
    };
  }
}

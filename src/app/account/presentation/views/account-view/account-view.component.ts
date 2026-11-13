import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';
import { I18nService } from '../../../../shared/services/i18n.service';
import { SubscriptionsService } from '../../../application/subscriptions.service';
import { SubscriptionModalComponent } from '../../components/subscription-modal/subscription-modal.component';

@Component({
  selector: 'app-account-view',
  standalone: true,
  imports: [CommonModule, IconComponent, SubscriptionModalComponent],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">{{ i18n.t('account.eyebrow') }}</p>
          <h1>{{ i18n.t('account.title') }}</h1>
          <p>{{ i18n.t('account.subtitle') }}</p>
        </div>
      </div>

      <div class="two-col account">
        <section class="card">
          <h3>{{ i18n.t('account.details') }}</h3>
          <div class="account-profile">
            <div class="avatar big">VR</div>
            <div>
              <strong>Valeria Ríos</strong>
              <span>valeria.rios&#64;email.com</span>
            </div>
            <button class="outline-btn">{{ i18n.t('account.edit') }}</button>
          </div>
          <hr />
          <h3>{{ i18n.t('account.assignedElders') }}</h3>
          <div class="assigned">
            <div class="avatar elder">EM</div>
            <div>
              <strong>Elena Martínez</strong>
              <span>{{ i18n.t('account.elderAge') }}</span>
            </div>
            <app-icon name="arrow"></app-icon>
          </div>
        </section>

        <section class="card plan-card">
          <span class="status-pill safe">
            {{
              subService.subscription().isCancelled
                ? 'Cancelado'
                : i18n.t('account.activePlanBadge')
            }}
          </span>
          <h2>{{ subService.subscription().planType }}</h2>
          <p>{{ i18n.t('account.planFeatures') }}</p>
          <strong class="price">
            S/ {{ subService.subscription().priceMonthly | number: '1.2-2' }}
            <small>{{ i18n.t('account.perMonth') }}</small>
          </strong>
          <div class="renew">
            <app-icon name="check"></app-icon> {{ i18n.t('account.renewalDate') }}
          </div>
          @if (subService.subscription().savedCard; as card) {
            <div class="payment">
              <span>VISA</span>
              <div>
                <strong>•••• {{ card.cardNumber.slice(-4) }}</strong>
                <small>Vence {{ card.expDate }}</small>
              </div>
              <button class="text-btn" (click)="openModal('update-card')">
                {{ i18n.t('account.updateCard') }}
              </button>
            </div>
          }
          <button class="primary-btn" (click)="openModal('upgrade')">
            {{ i18n.t('account.changePlan') }}
          </button>
          @if (!subService.subscription().isCancelled && subService.subscriptionId()) {
            <button class="link-danger" (click)="subService.cancelSubscription()">
              {{ i18n.t('account.cancelSub') }}
            </button>
          }
        </section>
      </div>
    </div>

    @if (modalOpen()) {
      <app-subscription-modal
        [mode]="modalMode()"
        (close)="modalOpen.set(false)"
      ></app-subscription-modal>
    }
  `,
})
export class AccountViewComponent {
  i18n = inject(I18nService);
  subService = inject(SubscriptionsService);
  modalOpen = signal(false);
  modalMode = signal<'upgrade' | 'update-card'>('upgrade');

  openModal(mode: 'upgrade' | 'update-card'): void {
    this.modalMode.set(mode);
    this.modalOpen.set(true);
  }
}

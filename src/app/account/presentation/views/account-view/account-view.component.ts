import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';
import { I18nService } from '../../../../shared/services/i18n.service';

@Component({
  selector: 'app-account-view',
  standalone: true,
  imports: [CommonModule, IconComponent],
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
          <span class="status-pill safe">{{ i18n.t('account.activePlanBadge') }}</span>
          <h2>Familiar Premium</h2>
          <p>{{ i18n.t('account.planFeatures') }}</p>
          <strong class="price"
            >S/ 29,90<small>{{ i18n.t('account.perMonth') }}</small></strong
          >
          <div class="renew">
            <app-icon name="check"></app-icon> {{ i18n.t('account.renewalDate') }}
          </div>
          <div class="payment">
            <span>VISA</span>
            <div>
              <strong>•••• 4321</strong><small>{{ i18n.t('account.cardExpiry') }}</small>
            </div>
            <button class="text-btn">{{ i18n.t('account.updateCard') }}</button>
          </div>
          <button class="primary-btn">{{ i18n.t('account.changePlan') }}</button>
          <button class="link-danger">{{ i18n.t('account.cancelSub') }}</button>
        </section>
      </div>
    </div>
  `,
})
export class AccountViewComponent {
  i18n = inject(I18nService);
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteCaregiverModalComponent } from '../../components/invite-caregiver-modal/invite-caregiver-modal.component';
import { CareNetworkStore } from '../../../application/care-network.store';
import { I18nService } from '../../../../shared/services/i18n.service';

@Component({
  selector: 'app-care-network-view',
  standalone: true,
  imports: [CommonModule, InviteCaregiverModalComponent],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">{{ i18n.t('network.eyebrow') }}</p>
          <h1>{{ i18n.t('network.title') }}</h1>
          <p>{{ store.caregivers().length }} {{ i18n.t('network.activeCaregivers') }}</p>
        </div>
        <button class="primary-btn" (click)="store.isInviteModalOpen.set(true)">
          {{ i18n.t('network.inviteBtn') }}
        </button>
      </div>

      <div class="people-grid">
        @for (c of store.caregivers(); track c.name; let i = $index) {
          <section class="card person-card">
            <div [class]="'avatar big av' + (i % 3)">{{ c.initials }}</div>
            <span class="availability"><i></i>{{ c.availability }}</span>
            <h3>{{ c.name }}</h3>
            <p>{{ c.role }}</p>
            <hr />
            <small>{{ i18n.t('network.availability') }}</small>
            <strong>{{ c.schedule }}</strong>
            <button class="wide-secondary">{{ i18n.t('network.managePermissions') }}</button>
          </section>
        }
      </div>
    </div>

    @if (store.isInviteModalOpen()) {
      <app-invite-caregiver-modal
        (close)="store.isInviteModalOpen.set(false)"
        (invited)="store.invite($event)"
      >
      </app-invite-caregiver-modal>
    }
  `,
})
export class CareNetworkViewComponent {
  i18n = inject(I18nService);
  store = inject(CareNetworkStore);
}

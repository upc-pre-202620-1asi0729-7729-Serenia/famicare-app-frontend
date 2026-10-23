import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteCaregiverModalComponent } from '../../components/invite-caregiver-modal/invite-caregiver-modal.component';
import { CareNetworkStore } from '../../../application/care-network.store';

@Component({
  selector: 'app-care-network-view',
  standalone: true,
  imports: [CommonModule, InviteCaregiverModalComponent],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">Equipo familiar</p>
          <h1>Red de cuidado</h1>
          <p>{{ store.caregivers().length }} cuidadores activos para Elena</p>
        </div>
        <button class="primary-btn" (click)="store.isInviteModalOpen.set(true)">
          Invitar cuidador
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
            <small>DISPONIBILIDAD</small>
            <strong>{{ c.schedule }}</strong>
            <button class="wide-secondary">Gestionar permisos</button>
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
  store = inject(CareNetworkStore);
}

import { Injectable, inject, signal } from '@angular/core';
import { LocalDbService } from '../../core/infrastructure/local-db.service';
import { Caregiver } from '../domain/model/caregiver.entity';

@Injectable({ providedIn: 'root' })
export class CareNetworkStore {
  private db = inject(LocalDbService);

  readonly caregivers = this.db.caregivers;
  readonly isInviteModalOpen = signal(false);

  invite(data: { email: string; relationship: string; role: string }): void {
    const initials = data.email.slice(0, 2).toUpperCase();
    const newCaregiver: Caregiver = {
      initials,
      name: data.email.split('@')[0],
      role: `${data.relationship} · ${data.role}`,
      availability: 'Invitación enviada',
      schedule: 'Por confirmar',
    };
    this.db.addCaregiver(newCaregiver);
    this.isInviteModalOpen.set(false);
  }
}

import { Injectable, signal } from '@angular/core';
import { Caregiver } from '../domain/model/caregiver.entity';

@Injectable({ providedIn: 'root' })
export class CareNetworkStore {
  readonly caregivers = signal<Caregiver[]>([
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
  ]);

  readonly isInviteModalOpen = signal(false);

  invite(data: { email: string; relationship: string }): void {
    const initials = data.email.slice(0, 2).toUpperCase();
    this.caregivers.update((list) => [
      ...list,
      {
        initials,
        name: data.email.split('@')[0],
        role: `${data.relationship} · Pendiente`,
        availability: 'Invitado',
        schedule: 'Por confirmar',
      },
    ]);
    this.isInviteModalOpen.set(false);
  }
}

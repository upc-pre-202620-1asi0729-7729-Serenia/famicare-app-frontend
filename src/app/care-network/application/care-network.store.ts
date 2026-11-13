import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Caregiver } from '../domain/model/caregiver.entity';

interface BackendCaregiverResource {
  id: number;
  elderlyProfileId: number;
  initials: string;
  name: string;
  email: string;
  roleType: 'ADMINISTRATOR' | 'COLLABORATOR';
  role: string;
  availability: string;
  schedule: string;
  status: 'PENDING' | 'ACTIVE' | 'REVOKED';
  invitedAt: string;
}

@Injectable({ providedIn: 'root' })
export class CareNetworkStore {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/care-network`;
  private readonly elderlyProfileId = 1;

  readonly caregivers = signal<Caregiver[]>([]);
  readonly isInviteModalOpen = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.loadCaregivers();
  }

  loadCaregivers(): void {
    this.http
      .get<BackendCaregiverResource[]>(`${this.apiUrl}?elderlyProfileId=${this.elderlyProfileId}`)
      .pipe(catchError(() => of([])))
      .subscribe((items) => {
        this.caregivers.set(items.map((item) => this.mapToEntity(item)));
      });
  }

  invite(data: { fullName: string; email: string; relationship: string; role: string }): void {
    const derivedName =
      data.fullName.trim() ||
      data.email
        .split('@')[0]
        .replace(/[._-]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const payload = {
      elderlyProfileId: this.elderlyProfileId,
      fullName: derivedName,
      email: data.email.trim(),
      role: data.role === 'Control total' ? 'ADMINISTRATOR' : 'COLLABORATOR',
      relationshipLabel: `${data.relationship.trim()} · ${data.role}`,
      schedule: 'Por confirmar',
    };

    this.http.post<BackendCaregiverResource>(`${this.apiUrl}/invite`, payload).subscribe({
      next: (created) => {
        this.caregivers.update((prev) => [...prev, this.mapToEntity(created)]);
        this.errorMessage.set(null);
        this.isInviteModalOpen.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err.status === 409
            ? 'Este correo ya tiene una invitación.'
            : 'No se pudo enviar la invitación.',
        );
      },
    });
  }

  acceptInvitation(id: string): void {
    this.http
      .patch<BackendCaregiverResource>(`${this.apiUrl}/${id}/accept`, {})
      .subscribe((updated) => {
        this.caregivers.update((prev) =>
          prev.map((c) => (c.id === id ? this.mapToEntity(updated) : c)),
        );
      });
  }

  revokeAccess(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe(() => {
      this.caregivers.update((prev) => prev.filter((c) => c.id !== id));
    });
  }

  private mapToEntity(dto: BackendCaregiverResource): Caregiver {
    return {
      id: String(dto.id),
      initials: dto.initials,
      name: dto.name,
      email: dto.email,
      roleType: dto.roleType,
      role: dto.role,
      availability: dto.availability,
      schedule: dto.schedule,
      status: dto.status,
    };
  }
}

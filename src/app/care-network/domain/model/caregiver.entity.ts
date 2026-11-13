export interface Caregiver {
  id?: string;
  initials: string;
  name: string;
  email?: string;
  roleType?: 'ADMINISTRATOR' | 'COLLABORATOR';
  role: string;
  availability: string;
  schedule: string;
  status?: 'PENDING' | 'ACTIVE' | 'REVOKED';
}

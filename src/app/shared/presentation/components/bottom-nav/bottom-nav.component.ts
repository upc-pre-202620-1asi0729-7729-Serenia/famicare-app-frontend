import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent, IconName } from '../icon/icon.component';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="bottom-nav">
      @for (item of items; track item.route) {
        <button
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: item.route === '/' }"
        >
          <app-icon [name]="item.icon"></app-icon>
          <span>{{ item.label }}</span>
        </button>
      }
    </div>
  `,
})
export class BottomNavComponent {
  items: { label: string; route: string; icon: IconName }[] = [
    { label: 'Inicio', route: '/', icon: 'home' },
    { label: 'Ubicación', route: '/monitoring/location', icon: 'pin' },
    { label: 'Zonas', route: '/monitoring/safe-zones', icon: 'shield' },
    { label: 'Alertas', route: '/alerts', icon: 'bell' },
    { label: 'Red', route: '/care-network', icon: 'users' },
  ];
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent, IconName } from '../icon/icon.component';

interface NavItem {
  label: string;
  route: string;
  icon: IconName;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <aside [class.open]="isOpen">
      <div class="aside-top">
        <div class="logo">
          <div class="logo-mark"><app-icon name="pulse" [size]="24"></app-icon></div>
          <div>Fami<span>Care</span><small>Cuidamos contigo</small></div>
        </div>
        <button class="aside-close" (click)="closeSidebar.emit()" aria-label="Cerrar menú">
          <app-icon name="close"></app-icon>
        </button>
      </div>

      <nav>
        @for (item of navItems; track item.route) {
          <button
            [routerLink]="item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.route === '/' }"
            (click)="closeSidebar.emit()"
          >
            <app-icon [name]="item.icon"></app-icon>
            <span>{{ item.label }}</span>
            @if (item.badge) {
              <b>{{ item.badge }}</b>
            }
          </button>
        }
      </nav>

      <div class="care-card">
        <span class="online-dot"></span>
        <strong>Todo funciona bien</strong>
        <p>Dispositivo conectado</p>
      </div>

      <div class="aside-profile">
        <div class="avatar">VR</div>
        <div><strong>Valeria Ríos</strong><span>Plan Premium</span></div>
        <app-icon name="arrow" [size]="16"></app-icon>
      </div>
    </aside>
    @if (isOpen) {
      <div class="menu-overlay" (click)="closeSidebar.emit()"></div>
    }
  `,
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Inicio', route: '/', icon: 'home' },
    { label: 'Ubicación', route: '/monitoring/location', icon: 'pin' },
    { label: 'Zonas seguras', route: '/monitoring/safe-zones', icon: 'shield' },
    { label: 'Alertas', route: '/alerts', icon: 'bell', badge: 2 },
    { label: 'Red de cuidado', route: '/care-network', icon: 'users' },
    { label: 'Actividad y salud', route: '/activity', icon: 'pulse' },
    { label: 'Dispositivos', route: '/devices', icon: 'watch' },
    { label: 'Cuenta y suscripción', route: '/account', icon: 'user' },
    { label: 'Ayuda', route: '/help', icon: 'help' },
  ];
}

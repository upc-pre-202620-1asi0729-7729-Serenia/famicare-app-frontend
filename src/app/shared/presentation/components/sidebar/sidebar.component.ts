import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent, IconName } from '../icon/icon.component';
import { I18nService } from '../../../services/i18n.service';
import { ThemeService } from '../../../services/theme.service';
import { LocalDbService } from '../../../../core/infrastructure/local-db.service';

interface NavItem {
  key: string;
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
            <span>{{ i18n.t(item.key) }}</span>
            @if (item.badge) {
              <b>{{ item.badge }}</b>
            }
          </button>
        }
      </nav>

      <div class="care-card">
        <span class="online-dot"></span>
        <strong>{{ i18n.t('status.operational') }}</strong>
        <p>{{ i18n.t('status.connected') }}</p>
      </div>

      <div class="sidebar-controls">
        <div class="ctrl-row">
          <span>{{ theme.isDark() ? i18n.t('theme.dark') : i18n.t('theme.light') }}</span>
          <label class="switch">
            <input type="checkbox" [checked]="theme.isDark()" (change)="theme.toggleTheme()" />
            <i></i>
          </label>
        </div>
        <div class="ctrl-row">
          <span>{{ i18n.t('lang.label') }}</span>
          <div class="lang-btn-group">
            <button [class.active]="i18n.currentLang() === 'es'" (click)="i18n.setLanguage('es')">
              ES
            </button>
            <button [class.active]="i18n.currentLang() === 'en'" (click)="i18n.setLanguage('en')">
              EN
            </button>
          </div>
        </div>
      </div>

      <div class="aside-profile">
        <div class="avatar">
          {{ db.currentUser()?.firstName?.slice(0, 1)
          }}{{ db.currentUser()?.lastName?.slice(0, 1) }}
        </div>
        <div>
          <strong>{{ db.currentUser()?.firstName }} {{ db.currentUser()?.lastName }}</strong>
          <span>Plan {{ db.currentUser()?.subscription?.planType }}</span>
        </div>
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

  i18n = inject(I18nService);
  theme = inject(ThemeService);
  db = inject(LocalDbService);

  navItems: NavItem[] = [
    { key: 'nav.home', route: '/', icon: 'home' },
    { key: 'nav.location', route: '/monitoring/location', icon: 'pin' },
    { key: 'nav.zones', route: '/monitoring/safe-zones', icon: 'shield' },
    { key: 'nav.alerts', route: '/alerts', icon: 'bell', badge: 2 },
    { key: 'nav.network', route: '/care-network', icon: 'users' },
    { key: 'nav.activity', route: '/activity', icon: 'pulse' },
    { key: 'nav.devices', route: '/devices', icon: 'watch' },
    { key: 'nav.account', route: '/account', icon: 'user' },
    { key: 'nav.help', route: '/help', icon: 'help' },
  ];
}

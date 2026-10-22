import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <header>
      <button class="icon-btn mobile-menu" (click)="openMenu.emit()" aria-label="Abrir menú">
        <app-icon name="menu"></app-icon>
      </button>
      <div class="mobile-logo">
        <div class="logo-mark"><app-icon name="pulse" [size]="20"></app-icon></div>
      </div>
      <div class="profile-select">
        <div class="avatar elder">EM</div>
        <div><small>Cuidando a</small><strong>Elena Martínez</strong></div>
        <span class="chevron">⌄</span>
      </div>
      <button class="notification" aria-label="Notificaciones">
        <app-icon name="bell"></app-icon><i>2</i>
      </button>
      <div class="user-profile">
        <div class="avatar">VR</div>
        <div><strong>Valeria Ríos</strong><small>Administradora</small></div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  @Output() openMenu = new EventEmitter<void>();
}

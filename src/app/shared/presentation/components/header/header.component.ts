import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <header>
      <button
        class="icon-btn mobile-menu"
        (click)="openMenu.emit()"
        [attr.aria-label]="i18n.t('header.openMenu')"
      >
        <app-icon name="menu"></app-icon>
      </button>
      <div class="mobile-logo">
        <div class="logo-mark"><app-icon name="pulse" [size]="20"></app-icon></div>
      </div>
      <div class="profile-select">
        <div class="avatar elder">EM</div>
        <div>
          <small>{{ i18n.t('header.caringFor') }}</small>
          <strong>Elena Martínez</strong>
        </div>
        <span class="chevron">⌄</span>
      </div>
      <button class="notification" [attr.aria-label]="i18n.t('header.notifications')">
        <app-icon name="bell"></app-icon><i>2</i>
      </button>
      <div class="user-profile">
        <div class="avatar">VR</div>
        <div>
          <strong>Valeria Ríos</strong>
          <small>{{ i18n.t('header.role') }}</small>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  @Output() openMenu = new EventEmitter<void>();
  i18n = inject(I18nService);
}

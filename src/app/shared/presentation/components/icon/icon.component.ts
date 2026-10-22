import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconName =
  | 'home'
  | 'pin'
  | 'shield'
  | 'bell'
  | 'users'
  | 'pulse'
  | 'watch'
  | 'user'
  | 'help'
  | 'menu'
  | 'arrow'
  | 'battery'
  | 'steps'
  | 'close'
  | 'plus'
  | 'search'
  | 'check';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (name) {
        @case ('home') {
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10v10h14V10M9 20v-6h6v6" />
        }
        @case ('pin') {
          <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        }
        @case ('shield') {
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
          <path d="m9 12 2 2 4-5" />
        }
        @case ('bell') {
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
        }
        @case ('users') {
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        }
        @case ('pulse') {
          <path d="M3 12h4l2-7 4 14 2-7h6" />
        }
        @case ('watch') {
          <rect x="6" y="5" width="12" height="14" rx="3" />
          <path d="M9 5V2h6v3M9 19v3h6v-3M9 12h2l1-2 2 4 1-2h1" />
        }
        @case ('user') {
          <circle cx="12" cy="8" r="4" />
          <path d="M4 22a8 8 0 0 1 16 0" />
        }
        @case ('help') {
          <circle cx="12" cy="12" r="10" />
          <path d="M9.5 9a2.6 2.6 0 1 1 3.4 2.5c-.9.4-.9 1.1-.9 2M12 18h.01" />
        }
        @case ('menu') {
          <path d="M4 6h16M4 12h16M4 18h16" />
        }
        @case ('arrow') {
          <path d="m9 18 6-6-6-6" />
        }
        @case ('battery') {
          <rect x="2" y="7" width="18" height="10" rx="2" />
          <path d="M22 10v4M6 10v4M10 10v4M14 10v4" />
        }
        @case ('steps') {
          <path
            d="M7 14c-2 0-4 1.3-4 3s1.5 3 3.5 3S10 18.7 10 17V8M17 10c2 0 4-1.3 4-3s-1.5-3-3.5-3S14 5.3 14 7v9"
          />
        }
        @case ('close') {
          <path d="m6 6 12 12M18 6 6 18" />
        }
        @case ('plus') {
          <path d="M12 5v14M5 12h14" />
        }
        @case ('search') {
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        }
        @case ('check') {
          <path d="m5 12 4 4L19 6" />
        }
      }
    </svg>
  `,
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
  @Input() size = 20;
}

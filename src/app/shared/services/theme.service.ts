import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'famicare_theme';
  isDark = signal<boolean>(false);

  constructor() {
    const saved = localStorage.getItem(this.THEME_KEY);
    if (saved === 'dark') {
      this.setDark(true);
    }
  }

  toggleTheme(): void {
    this.setDark(!this.isDark());
  }

  private setDark(value: boolean): void {
    this.isDark.set(value);
    if (value) {
      document.body.classList.add('dark');
      localStorage.setItem(this.THEME_KEY, 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem(this.THEME_KEY, 'light');
    }
  }
}

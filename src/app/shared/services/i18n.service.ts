import { Injectable, signal } from '@angular/core';

export type SupportedLang = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly LANG_KEY = 'famicare_lang';
  currentLang = signal<SupportedLang>('es');
  private translations = signal<Record<string, string>>({});

  constructor() {
    const saved = (localStorage.getItem(this.LANG_KEY) as SupportedLang) || 'es';
    this.setLanguage(saved);
  }

  async setLanguage(lang: SupportedLang): Promise<void> {
    try {
      const response = await fetch(`/i18n/${lang}.json`);
      const data = await response.json();
      this.translations.set(data);
      this.currentLang.set(lang);
      localStorage.setItem(this.LANG_KEY, lang);
    } catch (err) {
      console.error(`Error loading translations for ${lang}:`, err);
    }
  }

  t(key: string): string {
    return this.translations()[key] || key;
  }
}

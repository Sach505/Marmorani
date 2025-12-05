// Locale configuration for next-intl
// Defines supported locales and default locale per ADR-004

export const locales = ['en', 'fr', 'it', 'es', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Locale display names in native form
export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  de: 'Deutsch',
};

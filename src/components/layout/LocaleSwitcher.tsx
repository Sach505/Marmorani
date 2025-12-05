"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Globe } from "lucide-react";
import { locales, localeNames, type Locale } from "@/i18n/config";

export function LocaleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const t = useTranslations("header");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setIsOpen(false);
    
    // Replace the locale segment in the current pathname
    // pathname is like /en/gallery or /fr/configurator
    const segments = pathname.split('/');
    // segments[0] is empty string, segments[1] is the locale
    segments[1] = newLocale;
    const newPath = segments.join('/') || `/${newLocale}`;
    
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t("currentLanguage", { language: localeNames[currentLocale] })}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
        <span className="sm:hidden">{currentLocale.toUpperCase()}</span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
          aria-hidden="true" 
        />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md border border-border bg-background py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
          role="listbox"
          aria-label="Select language"
        >
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => handleLocaleChange(locale)}
              disabled={isPending}
              className={`flex w-full items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-muted disabled:opacity-50 ${
                currentLocale === locale
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
              role="option"
              aria-selected={currentLocale === locale}
            >
              <span>{localeNames[locale]}</span>
              {currentLocale === locale && (
                <span className="text-gold">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

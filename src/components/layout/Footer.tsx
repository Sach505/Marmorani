"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("footer");
  const locale = useLocale();

  const legalLinks = [
    { name: t("privacy"), href: `/${locale}/privacy` },
    { name: t("terms"), href: `/${locale}/terms` },
    { name: t("cookies"), href: `/${locale}/cookies` },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold text-foreground">
              Marmorani
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("contact")}
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <a 
                  href="mailto:contact@marmorani.com" 
                  className="hover:text-foreground transition-colors"
                >
                  contact@marmorani.com
                </a>
              </p>
              <p>
                <a 
                  href="tel:+33123456789" 
                  className="hover:text-foreground transition-colors"
                >
                  +33 1 23 45 67 89
                </a>
              </p>
              <p className="pt-2 whitespace-pre-line">
                {t("address")}
              </p>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("legal")}
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {t("copyright", { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
}

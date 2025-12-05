"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, ShoppingBag } from "lucide-react";
import { LocaleSwitcher } from "./LocaleSwitcher";

interface HeaderProps {
  cartItemCount?: number;
}

export function Header({ cartItemCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("header");
  const locale = useLocale();

  const navigation = [
    { name: t("gallery"), href: `/${locale}/gallery` },
    { name: t("configurator"), href: `/${locale}/configurator` },
    { name: t("account"), href: `/${locale}/account` },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <div className="flex lg:flex-1">
          <Link href={`/${locale}`} className="-m-1.5 p-1.5">
            <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Marmorani
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground hover:bg-muted"
            aria-label={mobileMenuOpen ? t("closeMenu") : t("openMenu")}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side: Locale switcher + Cart */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
          <LocaleSwitcher />
          
          {/* Cart Icon */}
          <Link
            href={`/${locale}/cart`}
            className="relative -m-2 flex items-center p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={t("shoppingCart")}
          >
            <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            {cartItemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-mono font-medium text-white">
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background px-6 py-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Link href={`/${locale}`} className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  Marmorani
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-foreground hover:bg-muted"
                aria-label={t("closeMenu")}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-muted"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                <div className="py-6">
                  <div className="flex items-center justify-between">
                    <LocaleSwitcher />
                    
                    <Link
                      href={`/${locale}/cart`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="relative flex items-center gap-2 text-foreground"
                    >
                      <ShoppingBag className="h-6 w-6" aria-hidden="true" />
                      <span className="font-medium">{t("cart")}</span>
                      {cartItemCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-mono font-medium text-white">
                          {cartItemCount > 9 ? "9+" : cartItemCount}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  // List of all supported locales
  locales,
  
  // Default locale when no match
  defaultLocale,
  
  // Always show locale prefix in URL (e.g., /en/, /fr/)
  localePrefix: 'always',
});

export const config = {
  // Match all pathnames except:
  // - API routes (/api/*)
  // - Static files (_next, images, favicons, etc.)
  // - Public assets with extensions
  matcher: [
    // Match all pathnames except those starting with:
    // - api (API routes)
    // - _next (Next.js internals)
    // - _vercel (Vercel internals)
    // - Files with extensions (e.g., favicon.ico, *.svg)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};


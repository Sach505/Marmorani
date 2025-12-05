import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { hasLocale } from "next-intl";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header, Footer } from "@/components/layout";
import { locales, type Locale } from "@/i18n/config";
import "../globals.css";

// Display Font - Elegant serif for headings and hero text
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Body Font - Clean sans-serif for UI and paragraphs
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Mono Font - For prices, dimensions, technical data
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Marmorani | Luxury Custom Marble",
    template: "%s | Marmorani",
  },
  description:
    "Configure and order custom marble pieces tailored to your exact specifications. Premium quality, luxury craftsmanship, delivered to your door.",
  keywords: [
    "marble",
    "luxury marble",
    "custom marble",
    "Italian marble",
    "Carrara marble",
    "marble countertop",
    "marble table",
  ],
  authors: [{ name: "Marmorani" }],
  creator: "Marmorani",
  metadataBase: new URL("https://marmorani.com"),
  openGraph: {
    type: "website",
    siteName: "Marmorani",
    title: "Marmorani | Luxury Custom Marble",
    description:
      "Configure and order custom marble pieces tailored to your exact specifications.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marmorani | Luxury Custom Marble",
    description:
      "Configure and order custom marble pieces tailored to your exact specifications.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  
  // Validate locale
  if (!hasLocale(locales, locale)) {
    notFound();
  }

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${cormorantGaramond.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        <NextIntlClientProvider locale={locale as Locale} messages={messages}>
          <ThemeProvider defaultTheme="light" storageKey="marmorani-theme">
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}


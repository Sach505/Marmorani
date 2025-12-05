import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Transpile packages that need processing
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Enable Turbopack (Next.js 16 default)
  turbopack: {},
};

export default withNextIntl(nextConfig);

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin(
  './i18n.ts'
);
const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      },
      {
        protocol: "https",
        hostname: "placehold.co"
      }
    ]
  }
};

export default withNextIntl(nextConfig);

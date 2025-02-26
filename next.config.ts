import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin(
  './i18n.ts'
);
const nextConfig: NextConfig = {
  /* config options here */
  images:{
    dangerouslyAllowSVG: true,
    domains: ['cdn.sanity.io'], // Add the correct Sanity CDN domain here
    remotePatterns:[
      {
        protocol: "https",
        hostname: "*"
      }
    ]
  }
};

export default withNextIntl(nextConfig);

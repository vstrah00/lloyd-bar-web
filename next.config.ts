import type { NextConfig } from "next";

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

export default nextConfig;

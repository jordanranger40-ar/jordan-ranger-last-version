import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import './app/models/db/lib/services/cron'; 
const nextConfig: NextConfig = {
  images: {
    domains: ["plus.unsplash.com", "www.shutterstock.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

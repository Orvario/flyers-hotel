import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "0.0.0.0", "*.trycloudflare.com"],
  devIndicators: false,
  images: {
    qualities: [75, 85],
  },
};

export default nextConfig;

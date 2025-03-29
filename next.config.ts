import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "ecobuilt.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

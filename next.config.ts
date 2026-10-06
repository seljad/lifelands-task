import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dl.lifelands.ir",
        pathname: "/game/**",
      },
    ],
  },
};

export default nextConfig;

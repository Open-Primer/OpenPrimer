import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Correcting build error: allowedDevOrigins is not part of ExperimentalConfig in recent versions
  }
};

export default nextConfig;

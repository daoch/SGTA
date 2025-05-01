import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  eslint: {
    dirs: ["app", "components", "features", "lib", "hooks", "store"],
  },
};

export default nextConfig;

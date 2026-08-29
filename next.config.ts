import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ensure transpile for any pure esm math packages if needed
};

export default nextConfig;

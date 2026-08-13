import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output produces a minimal, self-contained server bundle -
  // required for the multi-stage production Dockerfile (contract §23).
  output: "standalone",
};

export default nextConfig;

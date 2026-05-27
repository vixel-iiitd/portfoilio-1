import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" is only for Docker — Vercel manages its own build pipeline
  ...(process.env.DOCKER_BUILD === "1" && { output: "standalone" }),
};

export default nextConfig;

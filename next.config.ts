import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/vercel-agent-preview",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

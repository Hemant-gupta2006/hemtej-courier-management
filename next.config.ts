import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // @ts-ignore - Next.js 16 specific configuration
    root: path.resolve("."),
  },
};

export default nextConfig;

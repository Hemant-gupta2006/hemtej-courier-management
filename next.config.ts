import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // @ts-ignore
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
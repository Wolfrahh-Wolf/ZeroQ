import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark oracledb as server-only (never bundled for the browser)
  serverExternalPackages: ["oracledb"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

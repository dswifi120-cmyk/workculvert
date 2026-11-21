import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@electric-sql/pglite"],
  allowedDevOrigins: ["*.e2b.app", "localhost", "127.0.0.1"],
};

export default nextConfig;

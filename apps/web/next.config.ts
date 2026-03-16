import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@devalaya/shared", "@devalaya/supabase"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "stream.mux.com",
      },
    ],
  },
};

export default nextConfig;

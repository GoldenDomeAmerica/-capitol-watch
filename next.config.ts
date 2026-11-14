import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bill pages, pageview counts, and sponsor state are read from Postgres
  // on each request. Cache Components would prerender an empty shell whenever
  // DATABASE_URL is absent at build time.
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

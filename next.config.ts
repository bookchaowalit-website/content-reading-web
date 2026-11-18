import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The old per-app portfolio list now lives on the main site (permanent: Next answers 308).
    return [{ source: "/more-projects", destination: "https://bookchaowalit.com/", permanent: true }];
  },
};

export default nextConfig;

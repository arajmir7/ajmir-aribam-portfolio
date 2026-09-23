import type { NextConfig } from "next";

const config: NextConfig = {
  agentRules: false,
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/writing", destination: "/notes", permanent: true },
      {
        source: "/writing/:slug",
        destination: "/notes/:slug",
        permanent: true,
      },
    ];
  },
};

export default config;

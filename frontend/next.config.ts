import type { NextConfig } from "next";

const config: NextConfig = {
  agentRules: false,
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
};

export default config;

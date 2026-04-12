import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  transpilePackages: [
    "@lifecoding/shared-types",
    "@lifecoding/config",
    "@lifecoding/event-bus",
    "@lifecoding/feature-flags",
    "@lifecoding/ui",
    "@lifecoding/domain-identity",
    "@lifecoding/domain-profile",
    "@lifecoding/domain-rules",
    "@lifecoding/domain-progress",
    "@lifecoding/domain-diary",
    "@lifecoding/domain-feed",
    "@lifecoding/domain-gamification",
    "@lifecoding/domain-notifications",
    "@lifecoding/domain-recommendations"
  ]
};

export default nextConfig;

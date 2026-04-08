import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dispatch ships as a static export under /dispatch on the existing
  // Cloudflare Worker + static assets deploy. The marketing site at
  // public/index.html and the brain endpoints in worker.js are unaffected.
  // See knowledge-bases/agavi-playbook/AGENTS.md "Worker API surface" and
  // /root/.claude/plans/v3-dispatch-and-playbook.md for the deploy story.
  output: "export",
  basePath: "/dispatch",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

import type { NextConfig } from "next";

/**
 * Security headers (contract §36/§62). No nonce-based CSP: per Next.js's
 * own docs (node_modules/next/dist/docs/01-app/02-guides/
 * content-security-policy.md), nonces require *every* page to be
 * dynamically rendered - a real performance regression (contract §74
 * ranks performance above novelty, and this app has no
 * dangerously-rendered user content to justify it: no
 * dangerouslySetInnerHTML except our own server-built, already-escaped
 * JSON-LD, and no third-party scripts). `'unsafe-inline'` on script-src is
 * needed either way for Next's inline hydration payload without a nonce -
 * empirically verified against every page with no CSP console violations
 * (see e2e/security-headers.spec.ts).
 */
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self' data:;
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Only honored by browsers over HTTPS - harmless to always send, and
  // saves a redirect round-trip once production is actually on HTTPS
  // (contract §36 "HTTPS en production").
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Standalone output produces a minimal, self-contained server bundle -
  // required for the multi-stage production Dockerfile (contract §23).
  output: "standalone",
  // Don't advertise the framework in responses (contract §36: minimal
  // information disclosure).
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

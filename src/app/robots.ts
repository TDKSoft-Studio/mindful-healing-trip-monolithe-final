import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

/**
 * contract §18/§60. Deliberately does NOT disallow /mentions-legales or
 * /politique-confidentialite: those pages already carry a per-page
 * `noindex` (contract §37 placeholders) - blocking them via robots.txt as
 * well would stop crawlers from ever seeing that noindex directive, which
 * can paradoxically leave the URL indexed without a snippet if it's
 * linked from elsewhere. noindex is the correct mechanism; robots.txt
 * stays permissive.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", siteConfig.siteUrl).toString(),
  };
}

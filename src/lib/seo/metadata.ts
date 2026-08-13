import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

/**
 * Site-wide SEO defaults (contract §18/§60). The historic logo is the one
 * real official image asset available - used as-is (never modified,
 * contract §2) as the fallback Open Graph/Twitter image for any page that
 * doesn't have a real photo yet (contract §21/§45: no real photography has
 * been supplied for trips/destinations, TODO_ASSET).
 */
const DEFAULT_OG_IMAGE = {
  url: "/brand/logo-mindfultrip-historic-transparent.png",
  width: 1240,
  height: 1240,
};

type BuildMetadataInput = {
  /** Plain page title - Next.js applies the root layout's `%s | ...`
   * template for the <title> tag automatically. Open Graph/Twitter don't
   * get that template applied, so this helper builds the full title for
   * those fields itself. */
  title: string;
  description: string;
  /** Path relative to the site root, e.g. "/voyages/paris-slug". */
  path: string;
  /** Relative or absolute image URL; defaults to the site logo. */
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  /** Set for pages that must never be indexed (contract §37 legal
   * placeholders with unconfirmed content). */
  noIndex?: boolean;
  /** False only for the homepage, whose title already *is* the site name -
   * appending it again would read "Mindful Healing Trips | Mindful Healing
   * Trips". */
  appendSiteName?: boolean;
};

/**
 * Builds a consistent Metadata object - title, description, canonical,
 * Open Graph, Twitter card - for every page (contract §18: every page
 * needs these, not just some). Centralized here instead of hand-repeated
 * in nine page files, so canonical/OG/Twitter can never silently drift
 * out of sync with each other (contract §66: a real, shared need).
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  imageWidth = DEFAULT_OG_IMAGE.width,
  imageHeight = DEFAULT_OG_IMAGE.height,
  noIndex = false,
  appendSiteName = true,
}: BuildMetadataInput): Metadata {
  const url = new URL(path, siteConfig.siteUrl).toString();
  const imageUrl = new URL(
    image ?? DEFAULT_OG_IMAGE.url,
    siteConfig.siteUrl,
  ).toString();
  const fullTitle = appendSiteName ? `${title} | ${siteConfig.name}` : title;

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: "fr_FR",
      type: "website",
      images: [{ url: imageUrl, width: imageWidth, height: imageHeight }],
    },
    twitter: {
      // "summary" rather than "summary_large_image": the only image
      // available today is the square logo, not a 1.91:1 photo - a large
      // card would crop it oddly.
      card: "summary",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}

import { describe, expect, it } from "vitest";

import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";

describe("buildMetadata", () => {
  it("builds canonical, Open Graph, and Twitter fields consistently", () => {
    const metadata = buildMetadata({
      title: "Nos voyages",
      description: "Découvrez tous les voyages.",
      path: "/voyages",
    });

    expect(metadata.title).toBe("Nos voyages");
    expect(metadata.description).toBe("Découvrez tous les voyages.");
    expect(metadata.alternates?.canonical).toBe(
      `${siteConfig.siteUrl}/voyages`,
    );

    const og = metadata.openGraph;
    expect(og?.title).toBe("Nos voyages | Mindful Healing Trips");
    expect(og?.url).toBe(`${siteConfig.siteUrl}/voyages`);
    expect(og?.siteName).toBe(siteConfig.name);

    const twitter = metadata.twitter as { title?: string; card?: string };
    expect(twitter.card).toBe("summary");
    expect(twitter.title).toBe("Nos voyages | Mindful Healing Trips");
  });

  it("falls back to the site logo when no image is provided", () => {
    const metadata = buildMetadata({
      title: "Reims",
      description: "Une destination.",
      path: "/destinations/reims",
    });

    const images = metadata.openGraph?.images;
    const image = Array.isArray(images) ? images[0] : images;
    expect((image as { url: string }).url).toBe(
      `${siteConfig.siteUrl}/brand/logo-mindfultrip-historic-transparent.png`,
    );
  });

  it("uses a per-page image when provided instead of the fallback logo", () => {
    const metadata = buildMetadata({
      title: "Paris",
      description: "Une destination.",
      path: "/destinations/paris",
      image: "/uploads/paris-hero.jpg",
    });

    const images = metadata.openGraph?.images;
    const image = Array.isArray(images) ? images[0] : images;
    expect((image as { url: string }).url).toBe(
      `${siteConfig.siteUrl}/uploads/paris-hero.jpg`,
    );
  });

  it("marks noIndex pages so they're excluded from search results", () => {
    const metadata = buildMetadata({
      title: "Mentions légales",
      description: "Page en attente de contenu confirmé.",
      path: "/mentions-legales",
      noIndex: true,
    });

    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("does not append the site name twice for the homepage", () => {
    const metadata = buildMetadata({
      title: siteConfig.name,
      description: siteConfig.description,
      path: "/",
      appendSiteName: false,
    });

    expect(metadata.openGraph?.title).toBe(siteConfig.name);
  });
});

import type { MetadataRoute } from "next";

import { listPublishedDestinations } from "@/features/destinations/queries";
import { listPublishedTrips } from "@/features/trips/queries";
import { siteConfig } from "@/lib/site-config";

/**
 * contract §18/§60. Sourced from the same repositories the pages
 * themselves use (never hand-listed), so a new published trip/destination
 * appears here automatically and a draft never does. Deliberately excludes
 * /mentions-legales and /politique-confidentialite - they carry a
 * `noindex` (contract §37), so listing them in the sitemap would send a
 * contradictory signal.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [trips, destinations] = await Promise.all([
    listPublishedTrips(),
    listPublishedDestinations(),
  ]);

  const url = (path: string) => new URL(path, siteConfig.siteUrl).toString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/voyages"), changeFrequency: "weekly", priority: 0.9 },
    { url: url("/destinations"), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/a-propos"), changeFrequency: "yearly", priority: 0.5 },
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.5 },
  ];

  const tripRoutes: MetadataRoute.Sitemap = trips.map((trip) => ({
    url: url(`/voyages/${trip.slug}`),
    lastModified: trip.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const destinationRoutes: MetadataRoute.Sitemap = destinations.map(
    (destination) => ({
      url: url(`/destinations/${destination.slug}`),
      lastModified: destination.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...tripRoutes, ...destinationRoutes];
}

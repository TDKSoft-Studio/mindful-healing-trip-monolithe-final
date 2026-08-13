import { prisma } from "@/lib/db/prisma";

/**
 * Trip data access (contract §38). Only published trips (publishedAt set)
 * are returned - draft trips must never leak to visitor-facing pages.
 */

export function listPublishedTrips() {
  return prisma.trip.findMany({
    where: { publishedAt: { not: null } },
    include: { destination: true },
    orderBy: { startDate: "asc" },
  });
}

/**
 * Trips worth surfacing on the homepage/listing as "upcoming": published,
 * and not yet finished or withdrawn (contract §13's status list minus the
 * terminal ones).
 */
export function listUpcomingTrips() {
  return prisma.trip.findMany({
    where: {
      publishedAt: { not: null },
      status: { in: ["UPCOMING", "OPEN", "LIMITED"] },
    },
    include: { destination: true },
    orderBy: { startDate: "asc" },
  });
}

export function getPublishedTripBySlug(slug: string) {
  return prisma.trip.findFirst({
    where: { slug, publishedAt: { not: null } },
    include: { destination: true },
  });
}

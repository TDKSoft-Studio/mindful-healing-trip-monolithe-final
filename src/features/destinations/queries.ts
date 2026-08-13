import { prisma } from "@/lib/db/prisma";

/**
 * Destination data access (contract §38: pages must not depend on data
 * hardcoded in components - this is the one place that changes if the
 * query needs change).
 *
 * Only `published` destinations are returned - Phase 7 admin will need an
 * unfiltered variant, not added yet (contract §66: no abstraction before
 * a real need).
 */

export function listPublishedDestinations() {
  return prisma.destination.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
  });
}

export function getPublishedDestinationBySlug(slug: string) {
  return prisma.destination.findFirst({
    where: { slug, published: true },
    include: {
      trips: {
        where: { publishedAt: { not: null } },
        orderBy: { startDate: "asc" },
      },
    },
  });
}

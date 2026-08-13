import { afterAll, describe, expect, it } from "vitest";

import {
  getPublishedTripBySlug,
  listPublishedTrips,
  listUpcomingTrips,
} from "@/features/trips/queries";
import { prisma } from "@/lib/db/prisma";

afterAll(async () => {
  await prisma.$disconnect();
});

describe("listPublishedTrips", () => {
  it("returns the seeded trips sorted by start date, with their destination", async () => {
    const trips = await listPublishedTrips();
    const slugs = trips.map((t) => t.slug);

    expect(slugs).toEqual([
      "paris-evasion-bien-etre-elegance", // 2026-07-31
      "berlin-en-famille-2026", // 2026-08-15
      "reims-2026-routes-du-champagne", // 2026-10-02
    ]);
    expect(trips[0]?.destination.slug).toBe("paris");
  });
});

describe("listUpcomingTrips", () => {
  it("excludes completed/closed trips - only Reims (UPCOMING) qualifies", async () => {
    const trips = await listUpcomingTrips();
    expect(trips.map((t) => t.slug)).toEqual([
      "reims-2026-routes-du-champagne",
    ]);
  });
});

describe("getPublishedTripBySlug", () => {
  it("returns the trip with its status and destination", async () => {
    const trip = await getPublishedTripBySlug("berlin-en-famille-2026");
    expect(trip?.status).toBe("CLOSED");
    expect(trip?.destination.slug).toBe("berlin");
  });

  it("returns null for an unpublished or unknown slug", async () => {
    expect(await getPublishedTripBySlug("nope")).toBeNull();
  });
});

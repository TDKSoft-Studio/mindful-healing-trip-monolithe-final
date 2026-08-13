import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/db/prisma";
import type { Trip } from "@prisma/client";

describe("Trips Integration", () => {
  it("should have all trips with slugs", async () => {
    const trips = await prisma.trip.findMany();
    const slugs = trips.map((t: Trip) => t.slug);
    expect(slugs).toContain("paris-essentiel");
    expect(slugs).toContain("bali-spirituel");
  });

  it("should sort trips by startDate", async () => {
    const trips = await prisma.trip.findMany({
      orderBy: { startDate: "asc" },
    });
    expect(trips.map((t: Trip) => t.slug)).toEqual([
      "paris-essentiel",
      "bali-spirituel",
    ]);
  });
});

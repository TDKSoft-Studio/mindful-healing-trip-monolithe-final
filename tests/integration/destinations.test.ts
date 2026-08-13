import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/db/prisma";
import type { Destination, Trip } from "@prisma/client";

describe("Destinations Integration", () => {
  it("should have all destinations with slugs", async () => {
    const destinations = await prisma.destination.findMany();
    const slugs = destinations.map((d: Destination) => d.slug);
    expect(slugs).toContain("paris");
    expect(slugs).toContain("bali");
  });

  it("should have published destinations", async () => {
    const destinations = await prisma.destination.findMany({
      where: { published: true },
    });
    expect(destinations.every((d: Destination) => d.published)).toBe(true);
  });

  it("should have trips with correct slugs", async () => {
    const paris = await prisma.destination.findUnique({
      where: { slug: "paris" },
      include: { trips: true },
    });
    expect(paris?.trips.map((t: Trip) => t.slug)).toContain("paris-essentiel");
  });
});

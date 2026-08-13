import { afterAll, describe, expect, it } from "vitest";

import {
  getPublishedDestinationBySlug,
  listPublishedDestinations,
} from "@/features/destinations/queries";
import { prisma } from "@/lib/db/prisma";

// Integration tests (contract §34): real Postgres, seeded via `task db:seed`
// - task ci runs migrate + seed before this suite. See tests/integration/README.md.

afterAll(async () => {
  await prisma.$disconnect();
});

describe("listPublishedDestinations", () => {
  it("returns the seeded destinations, published only, sorted by name", async () => {
    const destinations = await listPublishedDestinations();
    const slugs = destinations.map((d) => d.slug);

    expect(slugs).toEqual(["berlin", "paris", "reims"]); // alphabetical
    expect(destinations.every((d) => d.published)).toBe(true);
  });
});

describe("getPublishedDestinationBySlug", () => {
  it("returns a destination with its published trips included", async () => {
    const paris = await getPublishedDestinationBySlug("paris");

    expect(paris).not.toBeNull();
    expect(paris?.name).toBe("Paris");
    expect(paris?.trips.map((t) => t.slug)).toContain(
      "paris-evasion-bien-etre-elegance",
    );
  });

  it("returns null for an unknown slug", async () => {
    const result = await getPublishedDestinationBySlug(
      "does-not-exist-anywhere",
    );
    expect(result).toBeNull();
  });
});

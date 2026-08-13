import { afterAll, describe, expect, it } from "vitest";

import { createContactRequest } from "@/features/contact/mutations";
import { getPublishedTripBySlug } from "@/features/trips/queries";
import { prisma } from "@/lib/db/prisma";

const createdIds: string[] = [];

afterAll(async () => {
  // Keep the database re-runnable (contract §35 pattern): this feature has
  // no seed data of its own, so tests clean up what they create instead.
  if (createdIds.length > 0) {
    await prisma.contactRequest.deleteMany({
      where: { id: { in: createdIds } },
    });
  }
  await prisma.$disconnect();
});

describe("createContactRequest", () => {
  it("stores a submission with optional fields left null", async () => {
    const contactRequest = await createContactRequest({
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@example.com",
      message: "Bonjour, je souhaite des informations sur ce voyage.",
    });
    createdIds.push(contactRequest.id);

    expect(contactRequest.phone).toBeNull();
    expect(contactRequest.tripId).toBeNull();
    expect(contactRequest.participantsCount).toBeNull();
    expect(contactRequest.consentAt).toBeInstanceOf(Date);
  });

  it("links the submission to a trip when a tripId is provided", async () => {
    const trip = await getPublishedTripBySlug(
      "paris-evasion-bien-etre-elegance",
    );
    expect(trip).not.toBeNull();

    const contactRequest = await createContactRequest({
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@example.com",
      phone: "+33612345678",
      tripId: trip!.id,
      participantsCount: 2,
      message: "Est-ce que ce voyage est encore disponible pour deux ?",
    });
    createdIds.push(contactRequest.id);

    expect(contactRequest.tripId).toBe(trip!.id);
    expect(contactRequest.participantsCount).toBe(2);
  });
});

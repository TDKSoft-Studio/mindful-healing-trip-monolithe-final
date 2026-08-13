import { prisma } from "@/lib/db/prisma";

export type CreateContactRequestInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  tripId?: string;
  participantsCount?: number;
  message: string;
};

/**
 * Durably stores a contact submission (contract §17/§59), independent of
 * whether the follow-up notification emails succeed. Split out from the
 * Server Action so it can be integration-tested against a real database
 * without going through `next/headers`, which requires a live request
 * scope the Server Action itself depends on (contract §66: split only
 * where there's a real need - here, testability).
 */
export function createContactRequest(input: CreateContactRequestInput) {
  return prisma.contactRequest.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      tripId: input.tripId,
      participantsCount: input.participantsCount,
      message: input.message,
      consentAt: new Date(),
    },
  });
}

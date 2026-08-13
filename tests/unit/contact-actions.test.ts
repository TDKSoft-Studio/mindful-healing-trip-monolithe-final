import { beforeEach, describe, expect, it, vi } from "vitest";

// actions.ts's own dependencies are mocked here so this file tests its
// orchestration/branching in isolation - mutations.ts, rate-limit.ts, and
// schema.ts already have their own dedicated tests (integration/unit)
// covering their internals.
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));
vi.mock("@/features/trips/queries", () => ({
  getPublishedTripBySlug: vi.fn(),
}));
vi.mock("@/lib/email", () => ({
  getEmailService: vi.fn(),
}));
vi.mock("@/features/contact/mutations", () => ({
  createContactRequest: vi.fn(),
}));
vi.mock("@/features/contact/rate-limit", () => ({
  isRateLimited: vi.fn(),
}));

import { headers } from "next/headers";

import { getPublishedTripBySlug } from "@/features/trips/queries";
import { getEmailService } from "@/lib/email";

import { submitContactRequest } from "@/features/contact/actions";
import { createContactRequest } from "@/features/contact/mutations";
import { isRateLimited } from "@/features/contact/rate-limit";

const validFormData = () => {
  const data = new FormData();
  data.set("firstName", "Jean");
  data.set("lastName", "Dupont");
  data.set("email", "jean@example.com");
  data.set("message", "Bonjour, je souhaite des informations sur ce voyage.");
  data.set("consent", "on");
  data.set("website", "");
  return data;
};

function mockHeaders(entries: Record<string, string> = {}) {
  vi.mocked(headers).mockResolvedValue({
    get: (key: string) => entries[key] ?? null,
  } as unknown as Headers);
}

describe("submitContactRequest", () => {
  const sendMock = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    sendMock.mockClear().mockResolvedValue(undefined);
    vi.mocked(getEmailService).mockReturnValue({ send: sendMock });
    vi.mocked(isRateLimited).mockReturnValue(false);
    vi.mocked(getPublishedTripBySlug).mockResolvedValue(null);
    vi.mocked(createContactRequest).mockResolvedValue({
      id: "cr_1",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      phone: null,
      tripId: null,
      participantsCount: null,
      message: "Bonjour, je souhaite des informations sur ce voyage.",
      consentAt: new Date(),
      createdAt: new Date(),
    });
    mockHeaders();
  });

  it("returns field errors for invalid input without touching the database", async () => {
    const result = await submitContactRequest(
      { status: "idle" },
      new FormData(),
    );

    expect(result.status).toBe("error");
    expect(result.fieldErrors).toBeDefined();
    expect(createContactRequest).not.toHaveBeenCalled();
  });

  it("fakes success for a honeypot submission without storing or rate-limiting", async () => {
    const data = validFormData();
    data.set("website", "http://spam.example");

    const result = await submitContactRequest({ status: "idle" }, data);

    expect(result).toEqual({ status: "success" });
    expect(isRateLimited).not.toHaveBeenCalled();
    expect(createContactRequest).not.toHaveBeenCalled();
  });

  it("blocks a rate-limited identifier with a French error message", async () => {
    vi.mocked(isRateLimited).mockReturnValue(true);

    const result = await submitContactRequest(
      { status: "idle" },
      validFormData(),
    );

    expect(result.status).toBe("error");
    expect(result.formError).toContain("Trop de tentatives");
    expect(createContactRequest).not.toHaveBeenCalled();
  });

  it("derives the rate-limit identifier from x-forwarded-for when present", async () => {
    mockHeaders({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" });

    await submitContactRequest({ status: "idle" }, validFormData());

    expect(isRateLimited).toHaveBeenCalledWith("203.0.113.5");
  });

  it("falls back to x-real-ip, then 'unknown', when x-forwarded-for is absent", async () => {
    mockHeaders({ "x-real-ip": "198.51.100.7" });
    await submitContactRequest({ status: "idle" }, validFormData());
    expect(isRateLimited).toHaveBeenCalledWith("198.51.100.7");

    mockHeaders();
    await submitContactRequest({ status: "idle" }, validFormData());
    expect(isRateLimited).toHaveBeenCalledWith("unknown");
  });

  it("stores the request without a trip when tripSlug is empty", async () => {
    const result = await submitContactRequest(
      { status: "idle" },
      validFormData(),
    );

    expect(result).toEqual({ status: "success" });
    expect(getPublishedTripBySlug).not.toHaveBeenCalled();
    expect(createContactRequest).toHaveBeenCalledWith(
      expect.objectContaining({ tripId: undefined }),
    );
  });

  it("links the request to a trip when tripSlug resolves to a published trip", async () => {
    vi.mocked(getPublishedTripBySlug).mockResolvedValue({
      id: "trip_1",
      title: "Reims 2026",
    } as Awaited<ReturnType<typeof getPublishedTripBySlug>>);
    const data = validFormData();
    data.set("tripSlug", "reims-2026");

    await submitContactRequest({ status: "idle" }, data);

    expect(createContactRequest).toHaveBeenCalledWith(
      expect.objectContaining({ tripId: "trip_1" }),
    );
  });

  it("succeeds even when the referenced trip no longer exists", async () => {
    vi.mocked(getPublishedTripBySlug).mockResolvedValue(null);
    const data = validFormData();
    data.set("tripSlug", "does-not-exist");

    const result = await submitContactRequest({ status: "idle" }, data);

    expect(result).toEqual({ status: "success" });
    expect(createContactRequest).toHaveBeenCalledWith(
      expect.objectContaining({ tripId: undefined }),
    );
  });

  it("sends both notification emails without blocking the response", async () => {
    const result = await submitContactRequest(
      { status: "idle" },
      validFormData(),
    );

    // The response already resolved - email delivery is fire-and-forget
    // (contract §17/§59, and the timeout regression fix) - so this polls
    // rather than assuming both sends completed synchronously.
    expect(result).toEqual({ status: "success" });
    await vi.waitFor(() => expect(sendMock).toHaveBeenCalledTimes(2));
    expect(sendMock.mock.calls[0]?.[0]).toMatchObject({
      to: expect.stringContaining("@"),
      replyTo: "jean@example.com",
    });
    expect(sendMock.mock.calls[1]?.[0]).toMatchObject({
      to: "jean@example.com",
    });
  });

  it("includes trip, participants, and phone lines in the notification when present", async () => {
    vi.mocked(getPublishedTripBySlug).mockResolvedValue({
      id: "trip_1",
      title: "Reims 2026",
    } as Awaited<ReturnType<typeof getPublishedTripBySlug>>);
    vi.mocked(createContactRequest).mockResolvedValue({
      id: "cr_2",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      phone: "+33612345678",
      tripId: "trip_1",
      participantsCount: 3,
      message: "Bonjour, je souhaite des informations sur ce voyage.",
      consentAt: new Date(),
      createdAt: new Date(),
    });
    const data = validFormData();
    data.set("tripSlug", "reims-2026");
    data.set("participants", "3");
    data.set("phone", "+33612345678");

    await submitContactRequest({ status: "idle" }, data);

    await vi.waitFor(() => expect(sendMock).toHaveBeenCalledTimes(2));
    const notificationText = sendMock.mock.calls[0]?.[0]?.text as string;
    expect(notificationText).toContain("Voyage concerné : Reims 2026");
    expect(notificationText).toContain("Nombre de participants : 3");
    expect(notificationText).toContain("Téléphone : +33612345678");
  });

  it("does not fail the submission when email delivery throws", async () => {
    sendMock.mockRejectedValue(new Error("SMTP unreachable"));

    const result = await submitContactRequest(
      { status: "idle" },
      validFormData(),
    );

    expect(result).toEqual({ status: "success" });
    await vi.waitFor(() => expect(sendMock).toHaveBeenCalledTimes(2));
  });
});

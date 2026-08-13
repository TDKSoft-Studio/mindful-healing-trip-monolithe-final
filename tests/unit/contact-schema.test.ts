import { describe, expect, it } from "vitest";

import {
  contactFormSchema,
  isHoneypotTriggered,
} from "@/features/contact/schema";

const validInput = {
  firstName: "Jean",
  lastName: "Dupont",
  email: "jean@example.com",
  phone: "",
  tripSlug: "",
  participants: "",
  message: "Bonjour, je souhaite des informations sur ce voyage.",
  consent: "on",
  website: "",
};

describe("contactFormSchema", () => {
  it("accepts a valid submission and normalizes empty optional fields", () => {
    const result = contactFormSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBeUndefined();
      expect(result.data.tripSlug).toBeUndefined();
      expect(result.data.participants).toBeUndefined();
    }
  });

  it("coerces a participants string to a number", () => {
    const result = contactFormSchema.safeParse({
      ...validInput,
      participants: "3",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.participants).toBe(3);
  });

  it("requires first name, last name, and a valid email", () => {
    const result = contactFormSchema.safeParse({
      ...validInput,
      firstName: "",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path[0]);
      expect(paths).toContain("firstName");
      expect(paths).toContain("email");
    }
  });

  it("rejects a message that is too short", () => {
    const result = contactFormSchema.safeParse({
      ...validInput,
      message: "Court",
    });
    expect(result.success).toBe(false);
  });

  it("requires consent to be explicitly given", () => {
    const { consent: _consent, ...withoutConsent } = validInput;
    const result = contactFormSchema.safeParse(withoutConsent);
    expect(result.success).toBe(false);
  });

  it("never trusts the client alone (contract §17): a bad server-side payload always fails, no matter what the browser already checked", () => {
    // Simulates a request bypassing the browser entirely (e.g. curl).
    const result = contactFormSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("isHoneypotTriggered", () => {
  it("is false when the honeypot field is empty (real visitors)", () => {
    const parsed = contactFormSchema.parse(validInput);
    expect(isHoneypotTriggered(parsed)).toBe(false);
  });

  it("is true when the honeypot field is filled (bots), without failing validation", () => {
    // The schema must still accept it - a validation error would tip the
    // bot off that it was caught, instead of silently faking success.
    const result = contactFormSchema.safeParse({
      ...validInput,
      website: "http://spam.example",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(isHoneypotTriggered(result.data)).toBe(true);
    }
  });
});

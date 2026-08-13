import { describe, expect, it } from "vitest";

import { isRateLimited } from "@/features/contact/rate-limit";

describe("isRateLimited", () => {
  it("allows the first few submissions from a fresh identifier", () => {
    const id = `test-${Math.random()}`;
    const now = 1_700_000_000_000;
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(id, now + i)).toBe(false);
    }
  });

  it("blocks once an identifier exceeds the window's limit", () => {
    const id = `test-${Math.random()}`;
    const now = 1_700_000_000_000;
    for (let i = 0; i < 5; i++) {
      isRateLimited(id, now + i);
    }
    expect(isRateLimited(id, now + 5)).toBe(true);
  });

  it("resets once the window has passed", () => {
    const id = `test-${Math.random()}`;
    const now = 1_700_000_000_000;
    for (let i = 0; i < 6; i++) {
      isRateLimited(id, now + i);
    }
    // 11 minutes later - outside the 10 minute window.
    expect(isRateLimited(id, now + 11 * 60 * 1000)).toBe(false);
  });

  it("tracks identifiers independently", () => {
    const idA = `test-a-${Math.random()}`;
    const idB = `test-b-${Math.random()}`;
    const now = 1_700_000_000_000;
    for (let i = 0; i < 6; i++) {
      isRateLimited(idA, now + i);
    }
    expect(isRateLimited(idB, now)).toBe(false);
  });
});

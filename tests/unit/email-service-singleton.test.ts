import { describe, expect, it, vi } from "vitest";

// getEmailService() lazily creates a singleton (same pattern as
// src/lib/db/prisma.ts) - module state, so this needs its own fresh
// module instance to test the "not yet created" path independently of
// other test files.
describe("getEmailService", () => {
  it("creates the service once and reuses it on subsequent calls", async () => {
    vi.resetModules();
    const { getEmailService } = await import("@/lib/email");

    const first = getEmailService();
    const second = getEmailService();

    expect(second).toBe(first);
  });
});

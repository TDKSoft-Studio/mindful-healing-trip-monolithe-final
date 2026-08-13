import { afterEach, describe, expect, it, vi } from "vitest";

// siteConfig is a module-level constant evaluated at import time, so
// exercising its env-var fallbacks requires unsetting the vars and
// re-importing a fresh module instance rather than mutating process.env
// after the fact.
describe("siteConfig env var fallbacks", () => {
  const originalEnv = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  };

  afterEach(() => {
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    vi.resetModules();
  });

  it("falls back to localhost and the confirmed contact email when unset", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.CONTACT_EMAIL;
    vi.resetModules();

    const { siteConfig } = await import("@/lib/site-config");

    expect(siteConfig.siteUrl).toBe("http://localhost:3000");
    expect(siteConfig.contactEmail).toBe("info-healingtrip@nextgen-care.org");
  });

  it("uses the env vars when set (normal dev/prod configuration)", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";
    process.env.CONTACT_EMAIL = "hello@example.test";
    vi.resetModules();

    const { siteConfig } = await import("@/lib/site-config");

    expect(siteConfig.siteUrl).toBe("https://example.test");
    expect(siteConfig.contactEmail).toBe("hello@example.test");
  });
});

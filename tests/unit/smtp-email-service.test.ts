import { afterEach, describe, expect, it } from "vitest";

import { SmtpEmailService } from "@/lib/email/smtp-email-service";

describe("SmtpEmailService", () => {
  const originalEnv = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  };

  afterEach(() => {
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it("throws a clear error when SMTP_HOST is not configured", () => {
    delete process.env.SMTP_HOST;

    expect(() => new SmtpEmailService()).toThrow(/SMTP_HOST is not set/);
  });

  it("omits auth when no SMTP_USER is configured (Mailpit and similar)", () => {
    process.env.SMTP_HOST = "localhost";
    process.env.SMTP_PORT = "1025";
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASSWORD;

    const service = new SmtpEmailService();
    const transporter = (
      service as unknown as {
        transporter: { options: { auth?: unknown } };
      }
    ).transporter;

    expect(transporter.options.auth).toBeUndefined();
  });

  it("sends credentials when SMTP_USER is configured (real providers)", () => {
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_USER = "bob";
    process.env.SMTP_PASSWORD = "secret";

    const service = new SmtpEmailService();
    const transporter = (
      service as unknown as {
        transporter: { options: { auth?: { user: string; pass: string } } };
      }
    ).transporter;

    expect(transporter.options.auth).toEqual({ user: "bob", pass: "secret" });
  });

  it("defaults port to 587 and the from address to a placeholder when unset", () => {
    process.env.SMTP_HOST = "smtp.example.com";
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_USER;
    delete process.env.CONTACT_EMAIL;

    const service = new SmtpEmailService();
    const internals = service as unknown as {
      transporter: { options: { port?: number } };
      from: string;
    };

    expect(internals.transporter.options.port).toBe(587);
    expect(internals.from).toBe("no-reply@localhost");
  });
});

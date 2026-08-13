import net from "node:net";

import { afterEach, describe, expect, it } from "vitest";

import { SmtpEmailService } from "@/lib/email/smtp-email-service";

/**
 * Regression coverage for a real bug: SmtpEmailService used to rely on
 * nodemailer's defaults (2 min connection timeout, 30s greeting timeout,
 * 10 min socket timeout) - fine for a human's mail client, far too long
 * for a request handler. A slow/unreachable SMTP host (e.g. a container
 * still starting up) made the contact form's Server Action hang for
 * minutes instead of failing fast, which is what actually caused e2e
 * submissions to time out (see src/features/contact/actions.ts - email
 * sending is now also fire-and-forget for the same reason).
 *
 * This spins up a real TCP server that accepts the connection but never
 * speaks SMTP, simulating exactly that "hangs instead of refusing"
 * failure mode, and asserts `send()` gives up well within nodemailer's
 * defaults (bounded by the explicit timeouts configured in
 * SmtpEmailService).
 */
describe("SmtpEmailService timeouts", () => {
  let server: net.Server | undefined;
  const originalEnv = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  };

  afterEach(async () => {
    if (server) {
      await new Promise<void>((resolve) => server!.close(() => resolve()));
      server = undefined;
    }
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it("fails fast instead of hanging when the SMTP host accepts but never responds", async () => {
    server = net.createServer((socket) => {
      // Accept the TCP connection and then go silent - no SMTP greeting,
      // ever. This is what a not-yet-ready container looks like from the
      // client's side, unlike a closed port (which refuses immediately).
      socket.on("data", () => {});
    });

    const port = await new Promise<number>((resolve) => {
      server!.listen(0, "127.0.0.1", () => {
        resolve((server!.address() as net.AddressInfo).port);
      });
    });

    process.env.SMTP_HOST = "127.0.0.1";
    process.env.SMTP_PORT = String(port);
    process.env.SMTP_USER = "";
    process.env.SMTP_PASSWORD = "";

    const emailService = new SmtpEmailService();
    const start = Date.now();

    await expect(
      emailService.send({
        to: "test@example.com",
        subject: "test",
        text: "test",
      }),
    ).rejects.toThrow();

    // Nodemailer's own defaults would let this hang up to 30s (greeting)
    // or 2 min (connection) - well under either confirms the explicit
    // timeouts are actually being applied, not just documented.
    expect(Date.now() - start).toBeLessThan(10_000);
  }, 15_000);
});

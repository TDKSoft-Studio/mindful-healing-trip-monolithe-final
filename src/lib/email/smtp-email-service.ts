import nodemailer, { type Transporter } from "nodemailer";

import type { EmailMessage, EmailService } from "@/lib/email/types";

/**
 * SMTP implementation (contract §27/§29/§36): configurable via env vars,
 * credentials never leave the server (this file only ever runs server-side -
 * Server Actions and route handlers). Works against Mailpit locally and any
 * real SMTP provider in production without code changes, only env vars.
 */
export class SmtpEmailService implements EmailService {
  private transporter: Transporter;
  private from: string;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;

    if (!host) {
      throw new Error(
        "SMTP_HOST is not set - see .env.example for the required email variables.",
      );
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      // Mailpit and many local setups need no auth - only send credentials
      // when one is actually configured, rather than an empty/placeholder pair.
      auth: user ? { user, pass: password } : undefined,
    });

    this.from = process.env.CONTACT_EMAIL ?? "no-reply@localhost";
  }

  async send(message: EmailMessage): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: message.replyTo,
    });
  }
}

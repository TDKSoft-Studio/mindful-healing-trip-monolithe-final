import { SmtpEmailService } from "@/lib/email/smtp-email-service";
import type { EmailService } from "@/lib/email/types";

export type { EmailMessage, EmailService } from "@/lib/email/types";

let instance: EmailService | undefined;

/** Lazily-created singleton, same pattern as src/lib/db/prisma.ts. */
export function getEmailService(): EmailService {
  instance ??= new SmtpEmailService();
  return instance;
}

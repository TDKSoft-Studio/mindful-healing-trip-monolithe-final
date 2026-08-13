export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  /** Set when a visitor should get a direct reply, e.g. their own address. */
  replyTo?: string;
};

/**
 * Email abstraction (contract §29): the rest of the app depends on this
 * interface, never on a specific provider - swapping SMTP for a
 * transactional email API later is a new implementation of this
 * interface, not a rewrite of every call site.
 */
export interface EmailService {
  send(message: EmailMessage): Promise<void>;
}

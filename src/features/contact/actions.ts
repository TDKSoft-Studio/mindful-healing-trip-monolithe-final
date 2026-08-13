"use server";

import { headers } from "next/headers";

import { getPublishedTripBySlug } from "@/features/trips/queries";
import { getEmailService } from "@/lib/email";
import { siteConfig } from "@/lib/site-config";

import { createContactRequest } from "./mutations";
import { isRateLimited } from "./rate-limit";
import { contactFormSchema, isHoneypotTriggered } from "./schema";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Partial<Record<string, string>>;
  formError?: string;
};

async function getClientIdentifier(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return headerList.get("x-real-ip") ?? "unknown";
}

/**
 * Contact form submission (contract §17/§59).
 *
 * Order matters: honeypot and validation happen before rate limiting is
 * consumed, so a bot hammering the honeypot field doesn't burn through a
 * real visitor's rate-limit budget on a shared identifier... actually rate
 * limiting is per-IP, so this mostly protects against wasting a submission
 * slot on obviously-invalid input before checking the limit.
 */
export async function submitContactRequest(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = contactFormSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key] = issue.message;
      }
    }
    return { status: "error", fieldErrors };
  }

  const data = parsed.data;

  // Honeypot: pretend success without processing anything - a validation
  // or "blocked" message would tell the bot its submission was noticed.
  if (isHoneypotTriggered(data)) {
    return { status: "success" };
  }

  const identifier = await getClientIdentifier();
  if (isRateLimited(identifier)) {
    return {
      status: "error",
      formError:
        "Trop de tentatives. Merci de réessayer dans quelques minutes.",
    };
  }

  const trip = data.tripSlug
    ? await getPublishedTripBySlug(data.tripSlug)
    : null;

  const contactRequest = await createContactRequest({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    tripId: trip?.id,
    participantsCount: data.participants,
    message: data.message,
  });

  await notifyByEmail(contactRequest, trip?.title);

  return { status: "success" };
}

async function notifyByEmail(
  contactRequest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    participantsCount: number | null;
    message: string;
  },
  tripTitle: string | undefined,
): Promise<void> {
  const emailService = getEmailService();
  const tripLine = tripTitle ? `Voyage concerné : ${tripTitle}\n` : "";
  const participantsLine = contactRequest.participantsCount
    ? `Nombre de participants : ${contactRequest.participantsCount}\n`
    : "";
  const phoneLine = contactRequest.phone
    ? `Téléphone : ${contactRequest.phone}\n`
    : "";

  // Business notification. Best-effort: the request is already durably
  // stored above, so an email failure here must not fail the visitor's
  // submission - it's logged and can be followed up manually.
  try {
    await emailService.send({
      to: siteConfig.contactEmail,
      replyTo: contactRequest.email,
      subject: `Nouvelle demande de contact - ${contactRequest.firstName} ${contactRequest.lastName}`,
      text: `${tripLine}${participantsLine}${phoneLine}Email : ${contactRequest.email}\n\nMessage :\n${contactRequest.message}`,
    });
  } catch (error) {
    console.error("[contact] Failed to notify by email:", error);
  }

  // Courtesy auto-reply to the visitor - no SLA claimed, just confirms
  // receipt (contract §59 "confirmation").
  try {
    await emailService.send({
      to: contactRequest.email,
      subject: `${siteConfig.name} - Nous avons bien reçu votre message`,
      text: `Bonjour ${contactRequest.firstName},\n\nNous avons bien reçu votre message et reviendrons vers vous prochainement.\n\nÀ bientôt,\nL'équipe ${siteConfig.name}`,
    });
  } catch (error) {
    console.error("[contact] Failed to send visitor confirmation:", error);
  }
}

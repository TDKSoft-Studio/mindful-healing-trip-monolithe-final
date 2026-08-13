import { z } from "zod";

/**
 * Contact form validation (contract §17). This is the server-side source
 * of truth - the Server Action re-validates with this schema regardless
 * of what the browser already checked (contract §17: "Ne jamais faire
 * confiance uniquement aux validations frontend").
 *
 * Field choices not fully dictated by the contract's plain field list:
 * - phone/tripSlug/participants are optional - requiring a phone number or
 *   a specific trip for every enquiry (including general questions) would
 *   be friction with no stated justification (contract §44).
 * - `website` is a honeypot: real visitors never see or fill it (hidden in
 *   the UI). A submission is a bot if it's non-empty (contract §17
 *   anti-spam).
 */
const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { error: "Le prénom est requis." })
    .max(100),
  lastName: z.string().trim().min(1, { error: "Le nom est requis." }).max(100),
  email: z.email({ error: "Adresse email invalide." }).max(200),
  phone: z.preprocess(emptyToUndefined, z.string().trim().max(30).optional()),
  tripSlug: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(200).optional(),
  ),
  participants: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ error: "Nombre de participants invalide." })
      .int()
      .min(1)
      .max(50)
      .optional(),
  ),
  message: z
    .string()
    .trim()
    .min(10, { error: "Le message doit contenir au moins 10 caractères." })
    .max(5000),
  consent: z.literal("on", {
    error: "Vous devez accepter avant d'envoyer votre message.",
  }),
  // Deliberately NOT restricted to an empty value here - a bot filling it
  // must still pass schema validation so isHoneypotTriggered() can silently
  // fake success afterward, instead of the bot learning it was caught from
  // a validation error.
  website: z.string().max(200).optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

/** True when the honeypot field was filled - a real visitor never does. */
export function isHoneypotTriggered(input: Pick<ContactFormInput, "website">) {
  return Boolean(input.website);
}

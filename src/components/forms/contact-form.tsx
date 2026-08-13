"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import {
  submitContactRequest,
  type ContactFormState,
} from "@/features/contact/actions";

const SELECT_CLASSES =
  "w-full rounded-lg border border-brand-brown/30 bg-white px-3 py-2 text-foreground focus-visible:border-primary";

const INITIAL_STATE: ContactFormState = { status: "idle" };

type TripOption = { slug: string; title: string };

type ContactFormProps = {
  trips: TripOption[];
  defaultTripSlug?: string;
};

/**
 * Contact form (contract §17). Client component wrapping the
 * submitContactRequest Server Action via useActionState - progressive
 * enhancement: the <form> posts to the action even without JS (React
 * handles that natively), and useActionState only adds the pending/error
 * UI on top once JS is available.
 */
export function ContactForm({ trips, defaultTripSlug }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitContactRequest,
    INITIAL_STATE,
  );

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="border-primary/30 bg-primary/5 rounded-lg border p-6"
      >
        <p className="text-foreground text-lg font-semibold">
          Merci, votre message a bien été envoyé.
        </p>
        <p className="text-muted-foreground mt-1">
          Nous reviendrons vers vous dans les meilleurs délais.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {/* Honeypot (contract §17 anti-spam): hidden from real visitors,
          left structurally valid so a filled value fails silently via
          isHoneypotTriggered() instead of a validation error. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Site web</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.formError ? (
        <p
          role="alert"
          className="border-primary/30 bg-primary/5 text-foreground rounded-lg border p-4 text-sm font-semibold"
        >
          {state.formError}
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Prénom"
          name="firstName"
          required
          autoComplete="given-name"
          error={state.fieldErrors?.firstName}
        />
        <FormField
          label="Nom"
          name="lastName"
          required
          autoComplete="family-name"
          error={state.fieldErrors?.lastName}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          error={state.fieldErrors?.email}
        />
        <FormField
          label="Téléphone (optionnel)"
          name="phone"
          type="tel"
          autoComplete="tel"
          error={state.fieldErrors?.phone}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="tripSlug"
          className="text-foreground text-sm font-semibold"
        >
          Voyage concerné (optionnel)
        </label>
        <select
          id="tripSlug"
          name="tripSlug"
          defaultValue={defaultTripSlug ?? ""}
          className={SELECT_CLASSES}
        >
          <option value="">Aucun voyage en particulier</option>
          {trips.map((trip) => (
            <option key={trip.slug} value={trip.slug}>
              {trip.title}
            </option>
          ))}
        </select>
      </div>

      <FormField
        label="Nombre de participants (optionnel)"
        name="participants"
        type="number"
        min={1}
        max={50}
        error={state.fieldErrors?.participants}
      />

      <FormField
        label="Message"
        name="message"
        multiline
        required
        minLength={10}
        error={state.fieldErrors?.message}
      />

      <div className="flex items-start gap-2">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1"
          aria-describedby={
            state.fieldErrors?.consent ? "consent-error" : undefined
          }
        />
        <label htmlFor="consent" className="text-foreground text-sm">
          J&apos;accepte que ces informations soient utilisées pour me
          recontacter au sujet de ma demande.
        </label>
      </div>
      {state.fieldErrors?.consent ? (
        <p
          id="consent-error"
          role="alert"
          className="text-foreground -mt-4 text-sm font-semibold"
        >
          <span aria-hidden>⚠ </span>
          {state.fieldErrors.consent}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="self-start"
      >
        {isPending ? "Envoi en cours..." : "Envoyer le message"}
      </Button>
    </form>
  );
}

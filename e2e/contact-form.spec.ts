import { expect, test } from "@playwright/test";

// Completes contract §34's visitor journey ("-> soumission"), and covers
// the contact form's accessibility and anti-spam behaviour end-to-end.
// Submissions here are stored like any real one (no test-only sandbox) -
// acceptable for this non-production environment (contract §17/§59).

test("visitor can fill out and submit the contact form", async ({ page }) => {
  await page.goto("/contact");
  await expect(
    page.getByRole("heading", { name: "Nous contacter" }),
  ).toBeVisible();

  await page.getByRole("textbox", { name: "Prénom" }).fill("Camille");
  await page
    .getByRole("textbox", { name: "Nom", exact: true })
    .fill("Rousseau");
  await page
    .getByRole("textbox", { name: "Email" })
    .fill("camille.rousseau@example.com");
  await page
    .getByRole("textbox", { name: "Message" })
    .fill(
      "Bonjour, pourriez-vous me donner plus de détails sur vos prochains voyages ?",
    );
  await page.getByRole("checkbox").check();

  await page.getByRole("button", { name: "Envoyer le message" }).click();

  await expect(page.getByRole("status")).toContainText(
    "Merci, votre message a bien été envoyé.",
  );
});

test("submitting an empty form shows accessible field errors instead of silently failing", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Envoyer le message" }).click();

  // Server-side validation (contract §17: never trust the client alone) -
  // errors are rendered as role="alert" and tied to their field.
  await expect(page.getByRole("alert").first()).toBeVisible();
  await expect(page.getByText("Le prénom est requis.")).toBeVisible();
  await expect(page.getByText("Le nom est requis.")).toBeVisible();
  await expect(page).toHaveURL("/contact");
});

test("a filled honeypot field fakes success instead of exposing a validation error", async ({
  page,
}) => {
  await page.goto("/contact");

  await page.getByRole("textbox", { name: "Prénom" }).fill("Robo");
  await page.getByRole("textbox", { name: "Nom", exact: true }).fill("Bot");
  await page.getByRole("textbox", { name: "Email" }).fill("bot@example.com");
  await page
    .getByRole("textbox", { name: "Message" })
    .fill("Ceci est un message automatisé envoyé par un robot.");
  await page.getByRole("checkbox").check();
  // Real visitors never see or fill this field - simulates a bot that does.
  await page.locator("#website").fill("http://spam.example");

  await page.getByRole("button", { name: "Envoyer le message" }).click();

  await expect(page.getByRole("status")).toContainText(
    "Merci, votre message a bien été envoyé.",
  );
});

test("prefills the trip select from a ?voyage= query param", async ({
  page,
}) => {
  await page.goto("/contact?voyage=paris-evasion-bien-etre-elegance");
  await expect(page.locator("#tripSlug")).toHaveValue(
    "paris-evasion-bien-etre-elegance",
  );
});

test("ignores an unknown ?voyage= query param instead of leaving the select in a broken state", async ({
  page,
}) => {
  await page.goto("/contact?voyage=does-not-exist");
  await expect(page.locator("#tripSlug")).toHaveValue("");
});

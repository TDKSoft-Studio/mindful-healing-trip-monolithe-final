import { expect, test } from "@playwright/test";

// Contract §34 "Parcours visiteur": Accueil -> Nos voyages -> Voyage ->
// Contact. (The "-> soumission" leg lives in contact-form.spec.ts, which
// covers the form itself in more depth.)

test("visitor can go from the homepage to a trip and on to contact", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Voir tous les voyages" }).click();
  await expect(page).toHaveURL("/voyages");
  await expect(
    page.getByRole("heading", { name: "Nos voyages", level: 1 }),
  ).toBeVisible();

  await page
    .getByRole("link", {
      name: "Découvrir le voyage Reims 2026 - Sur les routes du Champagne",
    })
    .click();
  await expect(page).toHaveURL("/voyages/reims-2026-routes-du-champagne");
  await expect(
    page.getByRole("heading", {
      name: "Reims 2026 - Sur les routes du Champagne",
    }),
  ).toBeVisible();
  // Reims is UPCOMING - not bookable yet, and the message must say so
  // accurately rather than implying it used to be open (contract §9).
  await expect(
    page.getByText("Les réservations ne sont pas encore ouvertes"),
  ).toBeVisible();

  await page
    .getByRole("main")
    .getByRole("link", { name: "Nous contacter" })
    .click();
  await expect(page).toHaveURL("/contact");
  await expect(
    page.getByRole("heading", { name: "Nous contacter" }),
  ).toBeVisible();
});

test("a closed trip shows its status and does not offer to book", async ({
  page,
}) => {
  await page.goto("/voyages/berlin-en-famille-2026");
  await expect(page.getByText("Réservations clôturées")).toBeVisible();
  await expect(
    page.getByText("Les réservations pour ce voyage sont clôturées"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Réserver ce voyage" }),
  ).toHaveCount(0);
});

test("destination page lists its trips and works with real content", async ({
  page,
}) => {
  await page.goto("/destinations");
  await page.getByRole("link", { name: "Découvrir Reims" }).click();
  await expect(page).toHaveURL("/destinations/reims");
  await expect(
    page.getByRole("link", {
      name: "Découvrir le voyage Reims 2026 - Sur les routes du Champagne",
    }),
  ).toBeVisible();
});

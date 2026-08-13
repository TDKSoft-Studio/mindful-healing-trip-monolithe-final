import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Contract §19: WCAG 2.2 AA "autant que raisonnablement possible", with
// automated a11y tests where they add value. Contract §35 candidate pages
// for regression coverage: /, /voyages, /voyages/[slug],
// /destinations/[slug], /contact - extended in Phase 6 (contract §60,
// "passage dédié" WCAG) to the remaining public pages, including the
// noindex legal placeholders (accessible content matters independently
// of whether a page is indexed).

async function expectNoViolations(page: Page, path: string) {
  await page.goto(path);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const summary = results.violations
    .map(
      (violation) =>
        `${violation.id}: ${violation.help} (${violation.nodes
          .map((node) => node.target.join(" "))
          .join(", ")})`,
    )
    .join("\n");

  expect(results.violations, `${path}\n${summary}`).toEqual([]);
}

test.describe("Accessibility", () => {
  test("homepage", async ({ page }) => {
    await expectNoViolations(page, "/");
  });

  test("/voyages", async ({ page }) => {
    await expectNoViolations(page, "/voyages");
  });

  test("trip detail page", async ({ page }) => {
    await expectNoViolations(page, "/voyages/reims-2026-routes-du-champagne");
  });

  test("destination detail page", async ({ page }) => {
    await expectNoViolations(page, "/destinations/paris");
  });

  test("/contact", async ({ page }) => {
    await expectNoViolations(page, "/contact");
  });

  test("/destinations", async ({ page }) => {
    await expectNoViolations(page, "/destinations");
  });

  test("/a-propos", async ({ page }) => {
    await expectNoViolations(page, "/a-propos");
  });

  test("/mentions-legales", async ({ page }) => {
    await expectNoViolations(page, "/mentions-legales");
  });

  test("/politique-confidentialite", async ({ page }) => {
    await expectNoViolations(page, "/politique-confidentialite");
  });
});

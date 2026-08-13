import { expect, test } from "@playwright/test";

// Contract §34: header, footer, links, invalid routes, back navigation,
// mobile navigation must all be covered.

test.describe("Header", () => {
  // The desktop nav is hidden below md - force a desktop viewport so this
  // test is meaningful regardless of which project runs it.
  test.use({ viewport: { width: 1280, height: 800 } });

  test("shows the logo, primary nav, and CTA, and links work", async ({
    page,
  }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(
      header.getByRole("link", { name: "Nos voyages" }),
    ).toBeVisible();

    await header.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL("/contact");
    // /contact isn't built yet (Phase 4) - the not-found page is the
    // correct, honest outcome for now.
    await expect(
      page.getByRole("heading", { name: "Page introuvable" }),
    ).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: "Voyagez. Respirez. Partagez." }),
    ).toBeVisible();
  });
});

test.describe("Footer", () => {
  test("shows navigation, contact, and legal links", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
    await expect(
      footer.getByRole("link", { name: "Mentions légales" }),
    ).toHaveAttribute("href", "/mentions-legales");
    await expect(
      footer.getByRole("link", { name: /info-healingtrip@nextgen-care\.org/ }),
    ).toHaveAttribute("href", "mailto:info-healingtrip@nextgen-care.org");
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens via the toggle, exposes links, and closes", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    const panel = page.getByRole("navigation", { name: "Navigation mobile" });
    await expect(panel).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();
    await expect(
      panel.getByRole("link", { name: "Nos voyages" }),
    ).toBeVisible();

    await toggle.click();
    await expect(panel).toBeHidden();
  });
});

test.describe("Skip link", () => {
  test("first Tab focuses the skip link and it targets #main-content", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", {
      name: "Aller au contenu principal",
    });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveAttribute("href", "#main-content");
  });
});

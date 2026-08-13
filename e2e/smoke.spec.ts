import { expect, test } from "@playwright/test";

test.describe("Foundation smoke test", () => {
  test("homepage loads and shows the brand headline", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Voyagez. Respirez. Partagez." }),
    ).toBeVisible();
  });

  test("health endpoint reports ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();
    expect(await response.json()).toEqual({ status: "ok" });
  });

  test("unknown route renders the not-found page", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(
      page.getByRole("heading", { name: "Page introuvable" }),
    ).toBeVisible();
  });
});

import { expect, test } from "@playwright/test";

// Contract §18/§60 - sitemap, robots.txt, structured data, canonical URLs.

test.describe("SEO infrastructure", () => {
  test("robots.txt allows crawling and points to the sitemap", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain("Allow: /");
    expect(body).toContain("Sitemap:");
    expect(body).toContain("/sitemap.xml");
  });

  test("sitemap.xml lists public pages but not the noindex legal placeholders", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBeTruthy();
    const body = await response.text();

    expect(body).toContain("<loc>");
    expect(body).toContain("/voyages/reims-2026-routes-du-champagne</loc>");
    expect(body).toContain("/destinations/paris</loc>");
    expect(body).not.toContain("/mentions-legales</loc>");
    expect(body).not.toContain("/politique-confidentialite</loc>");
  });

  test("homepage carries canonical, Open Graph, and Organization structured data", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "http://localhost:3000",
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Mindful Healing Trips",
    );

    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    expect(JSON.parse(jsonLd ?? "{}")["@type"]).toBe("TravelAgency");
  });

  test("trip detail page carries TouristTrip structured data", async ({
    page,
  }) => {
    await page.goto("/voyages/reims-2026-routes-du-champagne");

    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const types = scripts.map((script) => JSON.parse(script)["@type"]);
    expect(types).toContain("TouristTrip");
  });

  test("legal placeholder pages are marked noindex", async ({ page }) => {
    await page.goto("/mentions-legales");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });
});

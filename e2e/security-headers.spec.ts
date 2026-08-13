import { expect, test } from "@playwright/test";

// Contract §36/§62 - security headers on every response, and no CSP
// violations from the app's own inline hydration scripts or interactive
// components (mobile nav, contact form).

test.describe("Security headers", () => {
  test("homepage response carries the expected security headers", async ({
    request,
  }) => {
    const response = await request.get("/");
    const headers = response.headers();

    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["content-security-policy"]).toContain(
      "frame-ancestors 'none'",
    );
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    // Contract §36 minimal information disclosure - don't advertise the
    // framework in responses.
    expect(headers["x-powered-by"]).toBeUndefined();
  });

  test("no CSP violations while navigating the public pages", async ({
    page,
  }) => {
    const violations: string[] = [];
    page.on("console", (msg) => {
      if (/Content Security Policy|Refused to/i.test(msg.text())) {
        violations.push(`${page.url()}: ${msg.text()}`);
      }
    });

    for (const path of [
      "/",
      "/voyages",
      "/destinations",
      "/a-propos",
      "/contact",
    ]) {
      await page.goto(path);
    }

    expect(violations).toEqual([]);
  });

  test("submitting the contact form triggers no CSP violation", async ({
    page,
  }) => {
    const violations: string[] = [];
    page.on("console", (msg) => {
      if (/Content Security Policy|Refused to/i.test(msg.text())) {
        violations.push(msg.text());
      }
    });

    await page.goto("/contact");
    await page.getByRole("textbox", { name: "Prénom" }).fill("Camille");
    await page
      .getByRole("textbox", { name: "Nom", exact: true })
      .fill("Rousseau");
    await page
      .getByRole("textbox", { name: "Email" })
      .fill("csp-check@example.com");
    await page
      .getByRole("textbox", { name: "Message" })
      .fill("Vérification de la politique de sécurité du contenu.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Envoyer le message" }).click();

    await expect(page.getByRole("status")).toContainText(
      "Merci, votre message a bien été envoyé.",
    );
    expect(violations).toEqual([]);
  });
});

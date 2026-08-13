import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Contract §19: WCAG 2.2 AA "autant que raisonnablement possible", with
// automated a11y tests where they add value - the homepage now has real
// layout (header, nav, footer) worth scanning, not just placeholder text.

test.describe("Accessibility", () => {
  test("homepage has no automatically detectable WCAG 2.0/2.1 A/AA violations", async ({
    page,
  }) => {
    await page.goto("/");
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

    expect(results.violations, summary).toEqual([]);
  });
});

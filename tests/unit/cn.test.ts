import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils/cn";

describe("cn", () => {
  it("joins truthy class names with a space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns an empty string when nothing is truthy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });

  it("resolves conflicting Tailwind utilities in favor of the later argument", () => {
    // Regression test: a plain string-join would keep both `underline` and
    // `no-underline`, and which one visually wins depends on Tailwind's
    // generated CSS order, not argument order - this broke Header nav
    // styling. tailwind-merge must make the later class win deterministically.
    expect(cn("underline", "no-underline")).toBe("no-underline");
    expect(cn("text-primary", "text-foreground")).toBe("text-foreground");
    expect(cn("p-6", "p-0")).toBe("p-0");
  });
});

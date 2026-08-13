import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary", "lcov"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "coverage/**",
        "**/*.spec.ts",
        "**/*.test.ts",
        "**/types/**",
        "**/generated/**",
        "**/prisma/**",
        "**/scripts/**",
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});

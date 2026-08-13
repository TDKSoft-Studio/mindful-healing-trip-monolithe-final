import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],

    exclude: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "e2e/**",
      "**/*.spec.ts",
      "**/*.spec.tsx",
    ],

    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary", "lcov"],

      exclude: [
        "node_modules/**",
        "dist/**",
        "coverage/**",
        "e2e/**",
        "tests/**",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/*.test.ts",
        "**/*.test.tsx",
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

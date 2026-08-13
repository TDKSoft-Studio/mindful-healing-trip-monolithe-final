import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./tests/setup-env.ts"],
    include: ["tests/**/*.test.ts"],
    exclude: ["e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      // Scoped to the business-logic/data-access layer - exactly what
      // contract §34 assigns to Unit/Integration tests ("logique métier,
      // helpers", "accès DB, repositories/services, formulaires, APIs").
      // React components/pages are deliberately out of scope: they're
      // Server/Client Components verified through Playwright (contract
      // §34's E2E section - "parcours visiteur", navigation,
      // accessibility), a different runner Vitest's coverage
      // instrumentation can't see into. Measuring them here would either
      // require a whole separate component-testing setup (React Testing
      // Library + jsdom) with no unit-level need behind it (contract §65),
      // or produce a misleadingly low number for code that IS covered,
      // just by a different tool.
      include: ["src/lib/**", "src/features/**"],
      exclude: [
        "src/generated/**",
        // Prisma client singleton - wiring, not branching logic; exercised
        // indirectly by every integration test but not meaningfully
        // unit-testable on its own.
        "src/lib/db/prisma.ts",
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});

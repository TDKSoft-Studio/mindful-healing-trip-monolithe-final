/**
 * Development database seed.
 *
 * Phase 1 (Foundation) only wires the DB connection - there are no models
 * yet, so this script just verifies connectivity. Phase 3 (Content/Data)
 * will replace this with real Trip/Destination seed data, built from the
 * content confirmed in docs/ENGINEERING_DISCOVERY.md (section 9) and
 * marked NEEDS_CONFIRMATION wherever the source material is ambiguous,
 * per the contract's rule against inventing commercial data.
 */
import { prisma } from "../src/lib/db/prisma";

async function main() {
  await prisma.$queryRaw`SELECT 1`;
  console.log(
    "[seed] Database connection OK. No models defined yet (Phase 1).",
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error("[seed] Failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });

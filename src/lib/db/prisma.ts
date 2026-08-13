import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client singleton.
 *
 * Next.js reloads modules in development (HMR), which would otherwise create
 * a new PrismaClient - and a new connection pool - on every edit. We cache
 * the instance on `globalThis` in non-production environments to avoid
 * exhausting the database's connection limit.
 *
 * Prisma ORM v7 requires an explicit driver adapter for SQL databases
 * (see docs/ARCHITECTURE.md) instead of connecting directly from the schema.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

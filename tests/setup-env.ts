/**
 * Vitest doesn't auto-load .env.local the way Next.js (dev/build) and the
 * Prisma CLI (via prisma.config.ts) do. Without this, DATABASE_URL is
 * undefined when integration tests import the Prisma singleton, and
 * @prisma/adapter-pg's underlying `pg` Pool falls back to connecting with
 * no user in the startup packet - which fails unpredictably (the first
 * query on a fresh pool connection can succeed before the real error
 * surfaces on a later one). Load the same file explicitly instead.
 */
import { config } from "dotenv";

config({ path: ".env.local" });

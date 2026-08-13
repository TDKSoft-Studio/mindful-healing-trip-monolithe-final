// Prisma ORM v7 configuration.
// v7 no longer auto-loads .env files or infers the seed command, so both
// are wired explicitly here. See docs/ARCHITECTURE.md for the DB strategy.
//
// Next.js's own convention is .env.local for local overrides (not .env) -
// dotenv's default `dotenv/config` only loads .env, so it's pointed at
// .env.local explicitly to use the same file Next.js reads.
import { config } from "dotenv";
config({ path: ".env.local" });

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});

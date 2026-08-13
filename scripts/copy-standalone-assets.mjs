// Next.js "standalone" output (next.config.ts) does not include static
// assets or the public/ folder by design - it expects the deploy target to
// copy them in. The Dockerfile does this for production images; this script
// does the same thing for local `pnpm start` / Playwright e2e runs, so
// there's exactly one code path instead of a Docker-only special case.
import { cpSync, existsSync, mkdirSync } from "node:fs";

function copy(from, to) {
  if (!existsSync(from)) return;
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

copy("public", ".next/standalone/public");
copy(".next/static", ".next/standalone/.next/static");

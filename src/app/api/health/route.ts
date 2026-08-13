import { NextResponse } from "next/server";

/**
 * Health check endpoint (contract §48-49).
 *
 * Deliberately minimal: no secrets, no dependency details in the response
 * body. Extend with a DB ping once the app has real traffic depending on
 * it - avoid coupling liveness to readiness prematurely.
 */
export function GET() {
  return NextResponse.json({ status: "ok" });
}

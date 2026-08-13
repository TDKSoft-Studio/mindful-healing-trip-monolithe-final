/**
 * Best-effort in-memory rate limiting (contract §17/§36: "rate limiting si
 * nécessaire"). Fixed-window per identifier (IP address in practice).
 *
 * Known limitation: state is per Node process. It resets on redeploy and
 * does not share state across multiple instances - fine for this site's
 * expected volume, but not a substitute for a shared store (e.g. Redis)
 * if traffic ever justifies it. Documented rather than silently assumed.
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 5;

const submissionsByIdentifier = new Map<string, number[]>();

/**
 * Records a submission attempt and returns whether the identifier has
 * exceeded the allowed rate. `now` is injectable for deterministic tests.
 */
export function isRateLimited(
  identifier: string,
  now: number = Date.now(),
): boolean {
  const recent = (submissionsByIdentifier.get(identifier) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );
  recent.push(now);
  submissionsByIdentifier.set(identifier, recent);

  return recent.length > MAX_SUBMISSIONS_PER_WINDOW;
}

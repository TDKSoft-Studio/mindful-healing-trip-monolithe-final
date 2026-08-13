/**
 * Merge class names, filtering out falsy values.
 *
 * A dedicated `clsx`/`tailwind-merge` combo isn't justified yet (contract
 * §65: no dependency without a real need) - this project doesn't yet have
 * components with conflicting Tailwind classes to reconcile. Revisit if
 * the design system (Phase 2) needs real conflict resolution.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

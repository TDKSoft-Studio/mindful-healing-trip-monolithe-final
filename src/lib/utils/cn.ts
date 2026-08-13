import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with correct Tailwind conflict resolution.
 *
 * A plain `classes.filter(Boolean).join(" ")` was enough until components
 * needed to *override* a base utility (e.g. Link's default `underline` vs
 * a nav item passing `no-underline`) - two conflicting Tailwind classes
 * both end up in the string, and which one wins is decided by Tailwind's
 * generated CSS order, not by argument order, which silently broke nav
 * styling. `tailwind-merge` resolves same-property conflicts deterministically
 * (last one wins, as the caller intends) - the standard fix (contract §65:
 * genuinely needed, not novelty; §7's shadcn/ui reference uses this exact
 * `cn()` pattern).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

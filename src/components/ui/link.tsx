import NextLink from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

type LinkProps = ComponentPropsWithoutRef<typeof NextLink>;

/**
 * Inline text link (contract §22) - distinct from Button: this is for links
 * inside body copy, footers, breadcrumbs, and nav menus. Underlined by
 * default; pass `className="no-underline"` (or a different text color) to
 * override - `cn()` resolves the conflict correctly via tailwind-merge.
 */
export function Link({ className, ...props }: LinkProps) {
  return (
    <NextLink
      className={cn(
        "text-primary underline underline-offset-4 hover:no-underline",
        className,
      )}
      {...props}
    />
  );
}

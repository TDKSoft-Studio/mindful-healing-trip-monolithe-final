import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/utils/cn";

type ContainerProps<T extends ElementType> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Max-width + horizontal padding wrapper - the single source of the page's
 * content width, so it doesn't get reinvented per-section (contract §66).
 */
export function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn("mx-auto w-full max-w-6xl px-6", className)}
      {...props}
    />
  );
}

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

const VARIANT_CLASSES = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-accent text-accent-foreground hover:bg-accent/90",
  outline:
    "border border-brand-brown/40 text-foreground hover:bg-brand-brown/5",
} as const;

const SIZE_CLASSES = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

type Variant = keyof typeof VARIANT_CLASSES;
type Size = keyof typeof SIZE_CLASSES;

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type ButtonAsLink = CommonProps &
  ComponentPropsWithoutRef<typeof Link> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Primary call-to-action component (contract §22). Renders a <button> by
 * default, or a Next.js <Link> when `href` is passed - one component for
 * both cases instead of a separate "LinkButton", since the visual language
 * is identical (contract §66: no abstraction split without a real need).
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );

  if (props.href !== undefined) {
    return <Link className={classes} {...props} />;
  }

  return <button className={classes} {...props} />;
}

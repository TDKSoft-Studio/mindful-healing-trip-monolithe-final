import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

const TONE_CLASSES = {
  neutral: "bg-brand-sand text-foreground",
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  strong: "bg-brand-brown text-brand-ivory",
} as const;

type Tone = keyof typeof TONE_CLASSES;

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  tone?: Tone;
};

/** Small pill label (contract §22) - generic; see StatusBadge for trip statuses. */
export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        TONE_CLASSES[tone],
        className,
      )}
      {...props}
    />
  );
}

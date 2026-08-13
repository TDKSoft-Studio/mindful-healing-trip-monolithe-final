import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

/**
 * Consistent section title treatment (contract §22). `title` renders as an
 * <h2> - pages own their <h1>, sections should not compete with it.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-primary text-sm font-semibold tracking-wide uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-heading text-foreground text-3xl font-semibold sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground max-w-2xl">{description}</p>
      ) : null}
    </div>
  );
}

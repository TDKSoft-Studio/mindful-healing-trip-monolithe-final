import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /**
   * Heading level (default 2). Pages should have exactly one <h1> - pass
   * `level={1}` when this *is* the page's main heading (e.g. a listing
   * page with no other h1), and leave the default when it labels a
   * section on a page that already has its own h1 (e.g. the homepage
   * hero).
   */
  level?: 1 | 2 | 3;
};

/**
 * Consistent section title treatment (contract §22).
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  level = 2,
}: SectionHeadingProps) {
  const Heading = `h${level}` as const;

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
      <Heading className="font-heading text-foreground text-3xl font-semibold sm:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className="text-muted-foreground max-w-2xl">{description}</p>
      ) : null}
    </div>
  );
}

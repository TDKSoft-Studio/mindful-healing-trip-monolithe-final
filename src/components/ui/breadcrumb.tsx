import { Fragment } from "react";

import { Link } from "@/components/ui/link";

export type BreadcrumbItem = { label: string; href?: string };

/**
 * Breadcrumb trail (contract §22). The current page is plain text with
 * aria-current="page", not a link - it doesn't navigate anywhere.
 */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Fil d'Ariane">
      <ol className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={item.label}>
              {index > 0 ? <li aria-hidden>/</li> : null}
              <li>
                {item.href && !isLast ? (
                  <Link href={item.href} className="text-muted-foreground">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={isLast ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

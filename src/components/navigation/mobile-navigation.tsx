"use client";

import { useState } from "react";

import { Link } from "@/components/ui/link";
import type { NavLink } from "@/lib/site-config";

/**
 * Mobile disclosure menu (contract §16/§22): simple, accessible, no
 * animation-heavy menu system. Closed = not rendered at all, so it's
 * removed from the tab order and the accessibility tree, not just hidden
 * visually (contract §19: keyboard navigation, no hover-only content).
 */
export function MobileNavigation({
  links,
  cta,
}: {
  links: NavLink[];
  cta: NavLink;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((value) => !value)}
        className="text-foreground inline-flex items-center justify-center rounded-lg p-2"
      >
        {/* Accessible name stays constant - aria-expanded is what
            communicates open/closed state to assistive tech, per the ARIA
            Authoring Practices disclosure pattern (not a changing label,
            which also made this button impossible to locate reliably in
            tests once its name flipped mid-interaction). */}
        <span className="sr-only">Menu</span>
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open ? (
        <nav
          id="mobile-nav-panel"
          aria-label="Navigation mobile"
          className="border-brand-brown/10 bg-background absolute inset-x-0 top-full border-t px-6 py-4 shadow-md"
        >
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-foreground text-base font-semibold no-underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={cta.href}
                onClick={() => setOpen(false)}
                className="text-primary text-base font-semibold no-underline"
              >
                {cta.label}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

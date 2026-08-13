import type { ReactNode } from "react";

export type AccordionItem = {
  question: string;
  answer: ReactNode;
};

/**
 * FAQ-style accordion (contract §22), built on native <details>/<summary>.
 * This gets keyboard support, screen-reader semantics, and toggle state for
 * free from the browser instead of hand-rolled ARIA (contract §19: "aria
 * uniquement lorsque nécessaire").
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="divide-brand-brown/10 divide-y">
      {items.map((item) => (
        <details key={item.question} className="group py-4">
          <summary className="text-foreground flex cursor-pointer list-none items-center justify-between gap-4 font-sans font-semibold marker:content-none">
            {item.question}
            <span
              aria-hidden
              className="text-primary transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="text-muted-foreground pt-3">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}

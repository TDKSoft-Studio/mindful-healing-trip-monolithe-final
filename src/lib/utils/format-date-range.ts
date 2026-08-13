const LOCALE = "fr-FR";

const dayFormatter = new Intl.DateTimeFormat(LOCALE, { day: "numeric" });
const monthFormatter = new Intl.DateTimeFormat(LOCALE, { month: "long" });
const fullFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** "31 juillet 2026" */
export function formatDate(date: Date): string {
  return fullFormatter.format(date);
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

/**
 * Formats a trip's date range the way a visitor reads it (contract §13/§14):
 * a single day trip is just its date; a multi-day trip reads "du X au Y
 * mois année", collapsing the shared month/year instead of repeating it.
 */
export function formatDateRange(start: Date, end: Date): string {
  if (sameDay(start, end)) {
    return formatDate(start);
  }

  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();
  const year = end.getUTCFullYear();

  if (sameMonth) {
    return `du ${dayFormatter.format(start)} au ${dayFormatter.format(end)} ${monthFormatter.format(end)} ${year}`;
  }

  if (sameYear) {
    return `du ${dayFormatter.format(start)} ${monthFormatter.format(start)} au ${dayFormatter.format(end)} ${monthFormatter.format(end)} ${year}`;
  }

  return `du ${formatDate(start)} au ${formatDate(end)}`;
}

import { describe, expect, it } from "vitest";

import { formatDate, formatDateRange } from "@/lib/utils/format-date-range";

describe("formatDate", () => {
  it("formats a single date in French", () => {
    expect(formatDate(new Date("2026-07-31"))).toBe("31 juillet 2026");
  });
});

describe("formatDateRange", () => {
  it("returns a single date for a same-day trip", () => {
    expect(
      formatDateRange(new Date("2026-07-31"), new Date("2026-07-31")),
    ).toBe("31 juillet 2026");
  });

  it("collapses the month/year for a range within the same month", () => {
    expect(
      formatDateRange(new Date("2026-08-15"), new Date("2026-08-22")),
    ).toBe("du 15 au 22 août 2026");
    expect(
      formatDateRange(new Date("2026-10-02"), new Date("2026-10-10")),
    ).toBe("du 2 au 10 octobre 2026");
  });

  it("repeats the month for a range spanning two months in the same year", () => {
    expect(
      formatDateRange(new Date("2026-07-28"), new Date("2026-08-03")),
    ).toBe("du 28 juillet au 3 août 2026");
  });

  it("repeats the full date for a range spanning two years", () => {
    expect(
      formatDateRange(new Date("2026-12-28"), new Date("2027-01-03")),
    ).toBe("du 28 décembre 2026 au 3 janvier 2027");
  });
});

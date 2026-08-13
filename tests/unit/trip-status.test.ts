import { describe, expect, it } from "vitest";

import {
  getTripStatusLabel,
  isBookable,
  TRIP_STATUSES,
} from "@/lib/trip-status";

describe("getTripStatusLabel", () => {
  it("returns the contract-specified French label for each status", () => {
    expect(getTripStatusLabel("UPCOMING")).toBe("À venir");
    expect(getTripStatusLabel("OPEN")).toBe("Réservations ouvertes");
    expect(getTripStatusLabel("LIMITED")).toBe("Dernières places");
    expect(getTripStatusLabel("SOLD_OUT")).toBe("Complet");
    expect(getTripStatusLabel("CLOSED")).toBe("Réservations clôturées");
    expect(getTripStatusLabel("COMPLETED")).toBe("Terminé");
  });

  it("has a label for every status in the enum", () => {
    for (const status of TRIP_STATUSES) {
      expect(getTripStatusLabel(status)).toBeTruthy();
    }
  });
});

describe("isBookable", () => {
  it("is true only for OPEN and LIMITED trips", () => {
    expect(isBookable("OPEN")).toBe(true);
    expect(isBookable("LIMITED")).toBe(true);
  });

  it("is never true for a finished or closed trip (contract §9)", () => {
    expect(isBookable("COMPLETED")).toBe(false);
    expect(isBookable("CLOSED")).toBe(false);
    expect(isBookable("CANCELLED")).toBe(false);
    expect(isBookable("SOLD_OUT")).toBe(false);
    expect(isBookable("DRAFT")).toBe(false);
    expect(isBookable("UPCOMING")).toBe(false);
  });
});

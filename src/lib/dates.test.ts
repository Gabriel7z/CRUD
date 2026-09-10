import { describe, expect, it } from "vitest";
import {
  countdownParts,
  getNextEvent,
  progressPct,
} from "./dates";
import type { EventItem } from "./types";

const event = (
  id: string,
  starts_at: string,
): EventItem => ({
  id,
  title: id,
  description: "",
  starts_at,
  location: "Templo",
  kind: "culto",
});

describe("getNextEvent", () => {
  it("escolhe o próximo encontro futuro", () => {
    const now = new Date("2026-09-10T12:00:00.000Z");
    const next = getNextEvent(
      [
        event("passado", "2026-09-01T19:00:00.000Z"),
        event("depois", "2026-09-20T19:00:00.000Z"),
        event("proximo", "2026-09-12T19:00:00.000Z"),
      ],
      now,
    );
    expect(next?.id).toBe("proximo");
  });

  it("retorna nulo quando não há agenda futura", () => {
    const now = new Date("2026-09-10T12:00:00.000Z");
    expect(getNextEvent([event("passado", "2026-09-01T19:00:00.000Z")], now)).toBeNull();
  });
});

describe("countdownParts", () => {
  it("quebra o tempo restante", () => {
    const now = new Date("2026-09-10T12:00:00.000Z");
    const target = new Date("2026-09-12T14:30:00.000Z");
    expect(countdownParts(target, now)).toEqual({
      days: 2,
      hours: 2,
      minutes: 30,
      totalMs: 2 * 86_400_000 + 2 * 3_600_000 + 30 * 60_000,
    });
  });
});

describe("progressPct", () => {
  it("limita a 100%", () => {
    expect(progressPct(150, 100)).toBe(100);
    expect(progressPct(25, 100)).toBe(25);
    expect(progressPct(10, 0)).toBe(0);
  });
});

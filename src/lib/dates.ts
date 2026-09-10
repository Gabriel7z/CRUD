import type { EventItem } from "./types";

export function daysFromNow(days: number, hours = 19, minutes = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

export function getNextEvent(
  events: EventItem[],
  now = new Date(),
): EventItem | null {
  const upcoming = events
    .filter((event) => new Date(event.starts_at).getTime() >= now.getTime())
    .sort(
      (a, b) =>
        new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
    );
  return upcoming[0] ?? null;
}

export function countdownParts(target: Date, now = new Date()) {
  const ms = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    totalMs: ms,
  };
}

const BR_TZ = "America/Sao_Paulo";

export function formatWhen(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: BR_TZ,
  }).format(new Date(iso));
}

export function formatDay(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: BR_TZ,
  }).format(new Date(iso));
}

export function progressPct(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}

export function unitLabel(unit: "oracao" | "reais" | "pessoas"): string {
  if (unit === "reais") return "R$";
  if (unit === "pessoas") return "pessoas";
  return "orações";
}

import { useEffect, useState } from "react";
import { countdownParts } from "../lib/dates";

export function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const parts = countdownParts(new Date(target), now);

  const cells = [
    { label: "dias", value: parts.days },
    { label: "horas", value: parts.hours },
    { label: "min", value: parts.minutes },
  ];

  return (
    <div className="mt-5 grid grid-cols-3 gap-2">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="rounded-2xl bg-white/10 px-2 py-3 text-center text-cream"
        >
          <p className="font-display text-3xl leading-none">{cell.value}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-gold">
            {cell.label}
          </p>
        </div>
      ))}
    </div>
  );
}

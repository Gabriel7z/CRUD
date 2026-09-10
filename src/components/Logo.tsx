export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 64 64"
        className={compact ? "h-9 w-9" : "h-12 w-12"}
        aria-hidden
      >
        <circle cx="32" cy="32" r="30" fill="#E7F3EF" />
        <circle cx="32" cy="32" r="24" fill="none" stroke="#C9A44A" strokeWidth="1.6" />
        <path
          d="M32 14c8 10 14 16 14 24a14 14 0 1 1-28 0c0-8 6-14 14-24Z"
          fill="#0E3A36"
        />
        <path
          d="M32 22c5 7 9 11 9 17a9 9 0 1 1-18 0c0-6 4-10 9-17Z"
          fill="#1C7A6C"
        />
      </svg>
      <div className="leading-tight">
        <p className="font-display text-lg tracking-wide text-cream md:text-xl">
          Grupo Manancial
        </p>
        {!compact && (
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            Jovens ADESA 829
          </p>
        )}
      </div>
    </div>
  );
}

export function InkLogo() {
  return (
    <div className="flex items-center gap-3 text-ink">
      <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden>
        <circle cx="32" cy="32" r="30" fill="#0E3A36" />
        <circle cx="32" cy="32" r="24" fill="none" stroke="#C9A44A" strokeWidth="1.6" />
        <path
          d="M32 14c8 10 14 16 14 24a14 14 0 1 1-28 0c0-8 6-14 14-24Z"
          fill="#E7F3EF"
        />
        <path
          d="M32 22c5 7 9 11 9 17a9 14 0 1 1-18 0c0-6 4-10 9-17Z"
          fill="#1C7A6C"
        />
      </svg>
      <div className="leading-tight">
        <p className="font-display text-xl text-deep">Grupo Manancial</p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-spring">
          Jovens ADESA 829
        </p>
      </div>
    </div>
  );
}

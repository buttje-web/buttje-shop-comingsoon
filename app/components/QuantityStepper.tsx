"use client";

// Mengenauswahl: Minus / Zahlenfeld (Direkteingabe) / Plus.
// Erlaubt beliebig grosse Mengen (B2B, 50+). Minimum 1.

export default function QuantityStepper({
  value,
  onChange,
  disabled = false,
  min = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
  min?: number;
}) {
  const clamp = (n: number) => (Number.isFinite(n) && n >= min ? Math.floor(n) : min);

  return (
    <div className="inline-flex min-h-[44px] items-stretch border border-line-strong">
      <button
        type="button"
        aria-label="Menge verringern"
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className="w-11 text-lg leading-none transition-colors enabled:hover:text-accent disabled:opacity-30"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        value={value}
        disabled={disabled}
        aria-label="Menge"
        onChange={(e) => onChange(clamp(parseInt(e.target.value, 10)))}
        className="w-16 border-x border-line-strong bg-transparent text-center text-sm font-semibold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Menge erhöhen"
        disabled={disabled}
        onClick={() => onChange(clamp(value + 1))}
        className="w-11 text-lg leading-none transition-colors enabled:hover:text-accent disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}

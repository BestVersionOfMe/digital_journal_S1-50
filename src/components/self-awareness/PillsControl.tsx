"use client";

import { OPTIONS_1_TO_5, PILL_BUTTON_GAP_REM } from "@/lib/self-awareness";

type Props = {
  value: string | null;
  onChange: (next: string) => void;
  ariaLabelledBy?: string;
};

export function PillsControl({ value, onChange, ariaLabelledBy }: Props) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={ariaLabelledBy}
      className="flex w-full min-w-0 flex-wrap justify-stretch gap-y-2"
      style={{ gap: `${PILL_BUTTON_GAP_REM}rem` }}
    >
      {OPTIONS_1_TO_5.map((n) => {
        const selected = value === n;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(n)}
            className={[
              "min-h-[2.75rem] min-w-[2.5rem] flex-1 rounded-full border px-2 py-[0.45rem] text-[0.95rem] font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-bvm-action/20",
              selected
                ? "border-bvm-action bg-bvm-action text-white shadow-[0_4px_12px_rgba(31,95,174,0.22)]"
                : "border-bvm-softBorder bg-white text-bvm-text hover:border-bvm-activeBorder hover:bg-[#EAF4FF]",
            ].join(" ")}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

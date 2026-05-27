"use client";

import { SEGMENTED_SOLID_BG } from "@/lib/self-awareness";

type Props = {
  value: string | null;
  onChange: (next: string) => void;
  ariaLabelledBy?: string;
};

export function SegmentedControl({ value, onChange, ariaLabelledBy }: Props) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={ariaLabelledBy}
      className="flex w-full min-w-0 flex-1 overflow-hidden rounded-lg border border-bvm-softBorder bg-white"
    >
      {SEGMENTED_SOLID_BG.map((bg, i) => {
        const n = String(i + 1);
        const selected = value === n;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(n)}
            className={[
              "min-h-[2.75rem] flex-1 border-r border-bvm-softBorder px-1 py-[0.45rem] text-[0.95rem] font-semibold text-bvm-text transition-all duration-150 last:border-r-0 hover:border-bvm-activeBorder hover:bg-[#EAF4FF] active:brightness-[0.98] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-bvm-action/20",
              selected
                ? i === 4
                  ? "z-[1] border-bvm-title bg-bvm-title text-white shadow-[0_4px_12px_rgba(5,43,99,0.24)]"
                  : "z-[1] border-bvm-action bg-bvm-action text-white shadow-[0_4px_12px_rgba(31,95,174,0.22)]"
                : "",
            ].join(" ")}
            style={{
              backgroundColor: selected ? undefined : bg,
              backgroundImage: "none",
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

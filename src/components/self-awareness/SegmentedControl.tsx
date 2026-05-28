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
      className="flex w-full min-w-0 flex-1 overflow-hidden rounded-md border border-[rgba(30,60,90,0.14)]"
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
              "min-h-[2.75rem] flex-1 border-r border-[rgba(30,60,90,0.14)] px-1 py-[0.45rem] text-[0.95rem] font-semibold transition-[filter,box-shadow,color] last:border-r-0 active:brightness-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bvm-action/25 [@media(hover:hover)]:hover:brightness-[1.03]",
              selected
                ? "z-[1] text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.55),0_8px_18px_-14px_rgba(5,43,99,0.55)]"
                : "text-[#1a1a1a]",
            ].join(" ")}
            style={{
              backgroundColor: selected ? "#052B63" : bg,
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

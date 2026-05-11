"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  COMPASSION_PROMPTS,
  compassionSuggestionToAnswer,
  JOURNAL_GLASS_BORDER,
} from "@/lib/self-awareness";
import { useJournalStorage } from "@/hooks/useJournalStorage";

const slideVariants = {
  enter: (dir: number) =>
    dir === 0
      ? { x: 0, opacity: 1, filter: "blur(0px)" }
      : {
          x: dir > 0 ? 56 : -56,
          opacity: 0,
          filter: "blur(5px)",
        },
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({
    x: dir > 0 ? -56 : 56,
    opacity: 0,
    filter: "blur(5px)",
  }),
};

function IconRefresh({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0113.657-5.657M20 15a8 8 0 01-13.657 5.657"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconExit({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconNextCircle() {
  return (
    <span
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white shadow-sm"
      aria-hidden
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18l6-6-6-6"
          stroke="#2B6A9E"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** SELF COMPASSION — one question per card; Next / Back with slide “page” transition. */
export function SelfCompassionSection() {
  const { state, setCompassion } = useJournalStorage();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const total = COMPASSION_PROMPTS.length;
  const current = COMPASSION_PROMPTS[step];
  const value = state.compassion[current.id] ?? "";

  const setValue = useCallback(
    (v: string) => {
      setCompassion((c) => ({ ...c, [current.id]: v }));
    },
    [current.id, setCompassion],
  );

  const resetCurrent = useCallback(() => {
    setCompassion((c) => ({ ...c, [current.id]: "" }));
  }, [current.id, setCompassion]);

  const exitWorkshop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goNext = useCallback(() => {
    if (step < total - 1) {
      setDirection(1);
      setStep((s) => s + 1);
      return;
    }
    document.getElementById("feedback")?.scrollIntoView({ behavior: "smooth" });
  }, [step, total]);

  const goBack = useCallback(() => {
    if (step <= 0) return;
    setDirection(-1);
    setStep((s) => s - 1);
  }, [step]);

  const applySuggestion = useCallback(
    (text: string) => {
      setCompassion((c) => ({
        ...c,
        [current.id]: compassionSuggestionToAnswer(text),
      }));
    },
    [current.id, setCompassion],
  );

  const isFirst = step === 0;

  return (
    <div className="w-full pt-8 pb-14 sm:pt-10 sm:pb-16">
      <div className="mx-auto max-w-[26rem] px-4 sm:max-w-[28rem] sm:px-5">
        <p className="mb-6 text-center text-[0.8125rem] leading-relaxed text-slate-600 sm:mb-7 sm:text-[0.875rem]">
          <span className="text-balance">
            Being kind to ourselves isn&apos;t always our first instinct but it&apos;s one of the most
            powerful habits we can build.
          </span>
        </p>

        <div
          className={`overflow-hidden rounded-[1.35rem] border-2 bg-white/90 shadow-[0_8px_30px_rgba(80,70,120,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] ${JOURNAL_GLASS_BORDER.selfCompassion}`}
          style={{ perspective: "1000px" }}
        >
          <div className="border-b border-slate-200/40 px-4 py-3 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.6875rem] font-medium tracking-wide text-slate-500 sm:text-[0.75rem]">
                Workshop — Best Version of Me
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={resetCurrent}
                  className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear this answer"
                >
                  <IconRefresh className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={exitWorkshop}
                  className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Scroll to top"
                >
                  <IconExit className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 pb-2 pt-4 sm:px-6 sm:pt-5">
            <div className="relative min-h-[18rem] sm:min-h-[19rem]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4 sm:space-y-5"
                >
                  <label
                    htmlFor={`sa-card-${current.id}`}
                    className="block text-[0.9375rem] font-medium leading-snug text-slate-800 sm:text-[1rem]"
                  >
                    {current.prompt}
                  </label>

                  <div className="relative">
                    <textarea
                      id={`sa-card-${current.id}`}
                      name={current.id}
                      rows={5}
                      placeholder="| type your answer here..."
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="min-h-[9.5rem] w-full resize-y rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 pr-12 text-[0.9375rem] leading-relaxed text-slate-800 shadow-[inset_0_2px_6px_rgba(0,0,0,0.04)] placeholder:text-slate-400 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
                    />
                    <span
                      className="pointer-events-none absolute bottom-3 right-3 text-xl opacity-70"
                      aria-hidden
                    >
                      🙂
                    </span>
                  </div>

                  <div>
                    <p className="mb-2.5 flex items-center gap-1.5 text-[0.8125rem] text-slate-500">
                      <span aria-hidden>💡</span>
                      <span>Need help?</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {current.suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => applySuggestion(s)}
                          className="rounded-full border border-[#c9c4e8]/80 bg-[#e8e6fa] px-3 py-1.5 text-[0.75rem] font-medium text-slate-700 shadow-[0_2px_4px_rgba(100,90,160,0.12)] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:text-[0.8125rem]"
                        >
                          [{s}]
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 pb-4 sm:mt-7 sm:pb-5">
              <button
                type="button"
                onClick={goBack}
                disabled={isFirst}
                className={`flex items-center rounded-full p-2 transition-colors ${
                  isFirst
                    ? "cursor-not-allowed text-slate-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
                aria-label="Previous question"
              >
                <IconChevronLeft />
              </button>

              <button
                type="button"
                onClick={goNext}
                className="group flex items-center gap-2 rounded-full pl-2 pr-1 text-[0.9375rem] font-semibold text-bvm-title transition-colors hover:text-[#245a87]"
              >
                <span>Next</span>
                <IconNextCircle />
              </button>
            </div>

            <div
              className="flex gap-1.5 border-t border-slate-200/50 px-4 py-4 sm:px-6"
              role="progressbar"
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={total}
              aria-label="Question progress"
            >
              {COMPASSION_PROMPTS.map((p, i) => (
                <div
                  key={p.id}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    i === step ? "bg-bvm-title" : "bg-slate-200/90"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

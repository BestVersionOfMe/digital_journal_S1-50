"use client";

import { useCallback, useMemo, useState } from "react";
import {
  JOURNAL_GLASS_BORDER,
  JOURNAL_GLASS_PANEL_BASE,
  RATING_SKILLS,
  RATING_TABLE_WIDTH_PCT,
  todayIsoDateLocal,
  type SkillRatingSnapshot,
} from "@/lib/self-awareness";
import { useJournalStorage } from "@/hooks/useJournalStorage";
import { SegmentedControl } from "./SegmentedControl";

const scaleStripLabelClass =
  "text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-[0.6875rem]";

const skillNameClass =
  "text-[0.8125rem] font-medium leading-[1.45] tracking-[0.01em] text-slate-800 sm:text-[0.875rem]";

function formatSnapshotTime(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getRatingIncrease(
  current: SkillRatingSnapshot,
  previous: SkillRatingSnapshot | undefined,
  skillId: string,
): number {
  if (!previous) return 0;
  const currentValue = Number(current.ratings[skillId]);
  const previousValue = Number(previous.ratings[skillId]);
  if (!Number.isFinite(currentValue) || !Number.isFinite(previousValue)) return 0;
  return Math.max(0, currentValue - previousValue);
}

/** Whole-page title + lead + skills rating (sits above all six anchor sections). */
export function SelfAwarenessIntroAndSkills() {
  const { state, setRatings, saveSkillRatingSnapshot, removeSkillRatingSnapshot } =
    useJournalStorage();
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const setRating = useCallback(
    (sid: string, v: string | null) => {
      setRatings((r) => ({ ...r, [sid]: v }));
      setSavedMessage(null);
    },
    [setRatings],
  );

  const allRatingsComplete = useMemo(
    () => RATING_SKILLS.every(({ id }) => state.ratings[id] != null),
    [state.ratings],
  );

  const savedToday = useMemo(() => todayIsoDateLocal(), []);

  const handleSaveSnapshot = useCallback(() => {
    if (!allRatingsComplete) return;
    saveSkillRatingSnapshot(savedToday);
    setSavedMessage(`Saved a new entry for ${savedToday}.`);
  }, [allRatingsComplete, saveSkillRatingSnapshot, savedToday]);

  return (
    <div className="bvm-page mx-auto max-w-[40rem] px-5 pb-12 pt-10 text-slate-800 sm:max-w-[42rem] sm:px-8 sm:pb-16 sm:pt-12">
      <section
        className={`mt-2 sm:mt-3 ${JOURNAL_GLASS_PANEL_BASE} ${JOURNAL_GLASS_BORDER.skillsRating}`}
        aria-labelledby="sa-rating-block-title"
      >
        <div className="mb-7 border-b border-slate-200/35 pb-6 sm:mb-8 sm:pb-7">
          <h2
            id="sa-rating-block-title"
            className="font-display text-center text-[1.125rem] font-semibold tracking-[0.05em] text-bvm-title sm:text-[1.25rem]"
          >
            <span className="text-balance">SKILLS RATING</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[26rem] text-center text-[0.8125rem] leading-relaxed text-slate-600 sm:text-[0.84375rem]">
            <span className="text-balance">
              Rate each area from 1 (very weak) to 5 (very strong).
            </span>
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border-2 border-sky-300/40 bg-gradient-to-br from-white/95 via-white/75 to-bvm-tableHeader/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
          <div
            className="grid min-h-[4.5rem] items-stretch"
            style={{
              // fix: 1.05fr -> 0.9fr
              gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.5fr)",
            }}
          >
            <div className="flex items-center border-r border-slate-200/35 px-3 py-3.5 sm:px-4 break-words">
              <p className={`${scaleStripLabelClass} text-left leading-snug`}>
                SELF-AWARENESS SKILLS RATING
              </p>
            </div>
            <div
              className="min-w-0 bg-white/30"
              style={{ width: `${RATING_TABLE_WIDTH_PCT}%`, maxWidth: "100%" }}
            >
              <table
                className="h-full w-full border-collapse text-center text-[0.7rem] font-medium leading-tight text-slate-700 [&_td]:align-top"
                style={{ tableLayout: "fixed" }}
              >
                <tbody>
                  <tr>
                    {(
                      [
                        { n: "1", lines: ["Very", "Weak"] },
                        { n: "2", lines: ["Weak"] },
                        { n: "3", lines: ["Moderate"] },
                        { n: "4", lines: ["Strong"] },
                        { n: "5", lines: ["Very", "Strong"] },
                      ] as const
                    ).map((col) => (
                      <td key={col.n} className="w-[20%] align-top px-1 py-3 sm:px-1.5">
                        <div className="flex flex-col items-center">
                          <span className="text-[0.75rem] font-semibold tabular-nums leading-none text-slate-900">
                            {col.n}
                          </span>
                          <div className="mt-1.5 flex min-h-[2.625rem] w-full flex-col items-center justify-center gap-0 text-[0.55rem] sm:text-[0.625rem] font-normal leading-[1.25] text-slate-600 sm:min-h-[2.75rem]">
                            {col.lines.map((line) => (
                              /* add: break-words and tracking-tighter*/
                              <span key={`${col.n}-${line}`} className="block w-full text-center break-words tracking-tighter sm:tracking-normal">
                                {line}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-3 divide-y divide-slate-200/35">
          {RATING_SKILLS.map(({ id: sid, label }) => {
            const v = state.ratings[sid];
            const labelId = `sa-skill-${sid}`;
            return (
              <div
                key={sid}
                className="grid items-center gap-x-3 gap-y-2.5 py-[1.125rem] first:pt-3 sm:gap-x-4 sm:py-5"
                style={{
                  // fix: 1.05fr -> 0.9fr
                  gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.5fr)",
                }}
              >
                <div id={labelId} className={`${skillNameClass} pr-1 break-words`}>
                  {label}
                </div>
                <div className="min-w-0 w-full pl-0">
                  <SegmentedControl
                    value={v}
                    onChange={(n) => setRating(sid, n)}
                    ariaLabelledBy={labelId}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 border-t border-slate-200/35 pt-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[1rem] font-semibold text-slate-800">Saved rating records</h3>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-slate-600">
                Save multiple entries in one day and compare each entry with the one before it.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveSnapshot}
              disabled={!allRatingsComplete}
              className="shrink-0 rounded-xl bg-bvm-title px-5 py-3 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-bvm-title/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save current rating
            </button>
          </div>

          {!allRatingsComplete ? (
            <p className="mt-3 text-[0.78rem] font-medium text-slate-500">
              Complete all six ratings before saving an entry.
            </p>
          ) : savedMessage ? (
            <p className="mt-3 text-[0.78rem] font-medium text-bvm-title">
              {savedMessage}
            </p>
          ) : null}

          <div className="mt-5 space-y-3">
            {state.skillRatingSnapshots.length === 0 ? (
              <div className="rounded-xl border border-slate-200/80 bg-white/50 px-4 py-4">
                <p className="text-[0.875rem] leading-relaxed text-slate-600">
                  No saved rating records yet.
                </p>
              </div>
            ) : (
              state.skillRatingSnapshots.map((snapshot, index) => {
                const previousSnapshot = state.skillRatingSnapshots[index + 1];

                return (
                  <article
                    key={snapshot.id}
                    className="rounded-xl border border-slate-200/80 bg-white/50 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-[0.95rem] font-semibold text-slate-800">
                          {snapshot.date}
                        </h4>
                        <p className="mt-0.5 text-[0.75rem] text-slate-500">
                          {formatSnapshotTime(snapshot.createdAt)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkillRatingSnapshot(snapshot.id)}
                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/60 hover:text-bvm-title focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
                        aria-label={`Delete rating record for ${snapshot.date}`}
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M4 7h16" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
                          <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {RATING_SKILLS.map(({ id, label }) => {
                        const increase = getRatingIncrease(snapshot, previousSnapshot, id);

                        return (
                          <div
                            key={`${snapshot.id}-${id}`}
                            className="rounded-lg border border-slate-200/70 bg-white/60 px-3 py-2"
                          >
                            <p
                              className="truncate text-[0.7rem] font-medium text-slate-500"
                              title={label}
                            >
                              {label}
                            </p>
                            <p className="mt-0.5 flex items-baseline gap-1.5 text-[1rem] font-semibold tabular-nums text-bvm-title">
                              <span>{snapshot.ratings[id] ?? "-"}</span>
                              {increase > 0 ? (
                                <span className="text-[0.7rem] font-semibold text-emerald-600">
                                  +{increase}
                                </span>
                              ) : null}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

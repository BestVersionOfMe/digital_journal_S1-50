"use client";

import { useCallback, useMemo, useState } from "react";
import {
  JOURNAL_COLLAPSE_BUTTON_CLASS,
  JOURNAL_GLASS_BORDER,
  JOURNAL_GLASS_PANEL_BASE,
  JOURNAL_ICON_BUTTON_CLASS,
  JOURNAL_PRIMARY_BUTTON_CLASS,
  JOURNAL_RECORD_CARD_CLASS,
  RATING_SKILLS,
  RATING_TABLE_WIDTH_PCT,
  todayIsoDateLocal,
  type SkillRatingSnapshot,
} from "@/lib/self-awareness";
import { useJournalStorage } from "@/hooks/useJournalStorage";
import { SegmentedControl } from "./SegmentedControl";

const scaleStripLabelClass =
  "text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-bvm-muted sm:text-[0.6875rem]";

const skillNameClass =
  "text-[0.8125rem] font-medium leading-[1.45] tracking-[0.01em] text-bvm-fg sm:text-[0.875rem]";

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
  const [ratingRecordsOpen, setRatingRecordsOpen] = useState(true);

  const setRating = useCallback(
    (sid: string, v: string | null) => {
      setRatings((r) => ({ ...r, [sid]: v }));
    },
    [setRatings],
  );

  const allRatingsComplete = useMemo(
    () => RATING_SKILLS.every(({ id }) => state.ratings[id] != null),
    [state.ratings],
  );

  const savedToday = useMemo(() => todayIsoDateLocal(), []);
  const hasSavedRatingRecords = state.skillRatingSnapshots.length > 0;

  const handleSaveSnapshot = useCallback(() => {
    if (!allRatingsComplete) return;
    saveSkillRatingSnapshot(savedToday);
  }, [allRatingsComplete, saveSkillRatingSnapshot, savedToday]);

  return (
    <div className="bvm-page mx-auto max-w-[40rem] px-5 pb-6 pt-8 text-bvm-fg sm:max-w-[42rem] sm:px-8 sm:pb-8 sm:pt-10">
      <section
        className={`mt-2 sm:mt-3 ${JOURNAL_GLASS_PANEL_BASE} ${JOURNAL_GLASS_BORDER.skillsRating}`}
        aria-labelledby="sa-rating-block-title"
      >
        <div className="mb-6 border-b border-bvm-border pb-5 sm:mb-7 sm:pb-6">
          <h2
            id="sa-rating-block-title"
            className="font-display text-center text-[1.125rem] font-semibold tracking-[0.05em] text-bvm-title sm:text-[1.25rem]"
          >
            <span className="text-balance">SKILLS RATING</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[26rem] text-center text-[0.8125rem] leading-relaxed text-bvm-muted sm:text-[0.84375rem]">
            <span className="text-balance">
              Rate each area from 1 (very weak) to 5 (very strong).
            </span>
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-bvm-border bg-gradient-to-br from-white via-white/90 to-bvm-tableHeader/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <div
            className="grid min-h-[4.5rem] items-stretch"
            style={{
              // fix: 1.05fr -> 0.9fr
              gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.5fr)",
            }}
          >
            <div className="flex items-center break-words border-r border-bvm-border px-3 py-3.5 sm:px-4">
              <p className={`${scaleStripLabelClass} text-left leading-snug`}>
                SELF-AWARENESS SKILLS RATING
              </p>
            </div>
            <div
              className="min-w-0 bg-bvm-softBlue/45"
              style={{ width: `${RATING_TABLE_WIDTH_PCT}%`, maxWidth: "100%" }}
            >
              <table
                className="h-full w-full border-collapse text-center text-[0.7rem] font-medium leading-tight text-bvm-muted [&_td]:align-top"
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
                      <td key={col.n} className="w-[20%] align-top px-0.5 py-3 sm:px-1.5">
                        <div className="flex flex-col items-center">
                          <span className="text-[0.75rem] font-semibold tabular-nums leading-none text-bvm-fg">
                            {col.n}
                          </span>
                          <div className="mt-1.5 flex min-h-[2.625rem] w-full flex-col items-center justify-center gap-0 text-[0.55rem] font-normal leading-[1.25] text-bvm-muted sm:min-h-[2.75rem] sm:text-[0.625rem]">
                            {col.lines.map((line) => (
                              /* add: break-words and tracking-tighter*/
                              <span key={`${col.n}-${line}`} className="block w-full break-words text-center tracking-tighter [overflow-wrap:anywhere] sm:tracking-normal">
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

        <div className="mt-3 divide-y divide-bvm-border/80">
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

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={handleSaveSnapshot}
            disabled={!allRatingsComplete}
            className={`shrink-0 ${JOURNAL_PRIMARY_BUTTON_CLASS}`}
          >
            Save current rating
          </button>
        </div>

        {hasSavedRatingRecords ? (
          <div className="mt-5 border-t border-bvm-border pt-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-[1.08rem] font-semibold tracking-[0.025em] text-bvm-title">
                Saved rating records
              </h3>
                <button
                  type="button"
                  className={JOURNAL_COLLAPSE_BUTTON_CLASS}
                  aria-expanded={ratingRecordsOpen}
                  onClick={() => setRatingRecordsOpen((open) => !open)}
                >
                  {ratingRecordsOpen ? "Collapse" : "Expand"}
                </button>
            </div>
            <p className="mt-2 text-[0.82rem] font-medium text-bvm-muted">
              {state.skillRatingSnapshots.length} saved rating record
              {state.skillRatingSnapshots.length === 1 ? "" : "s"}
            </p>

              {ratingRecordsOpen ? (
                <div className="mt-4 space-y-3">
                  {state.skillRatingSnapshots.map((snapshot, index) => {
                    const previousSnapshot = state.skillRatingSnapshots[index + 1];

                    return (
                      <article key={snapshot.id} className={JOURNAL_RECORD_CARD_CLASS}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-[0.95rem] font-semibold text-bvm-fg">
                          {snapshot.date}
                        </h4>
                        <p className="mt-0.5 text-[0.75rem] text-bvm-muted">
                          {formatSnapshotTime(snapshot.createdAt)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkillRatingSnapshot(snapshot.id)}
                        className={JOURNAL_ICON_BUTTON_CLASS}
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
                            className="rounded-xl border border-bvm-border bg-bvm-softBlue/40 px-3 py-2"
                          >
                            <p
                              className="truncate text-[0.7rem] font-medium text-bvm-muted"
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
                  })}
                </div>
              ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}

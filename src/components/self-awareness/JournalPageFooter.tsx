"use client";

import { useMemo, useState } from "react";
import { useJournalStorage } from "@/hooks/useJournalStorage";
import {
  buildSelfAwarenessReport,
  JOURNAL_COLLAPSE_BUTTON_CLASS,
  JOURNAL_GLASS_BORDER,
  JOURNAL_GLASS_PANEL_BASE,
  JOURNAL_RECORDS_SHELL_CLASS,
  JOURNAL_SUBHEADING_CLASS,
  STORAGE_KEY,
} from "@/lib/self-awareness";

export function JournalPageFooter() {
  const { state } = useJournalStorage();
  const [reportOpen, setReportOpen] = useState(false);
  const report = useMemo(() => buildSelfAwarenessReport(state), [state]);

  return (
    <div className="mx-auto max-w-[40rem] px-5 pb-12 sm:max-w-[42rem] sm:px-8">
      <section
        className={`${JOURNAL_GLASS_PANEL_BASE} ${JOURNAL_GLASS_BORDER.emotionalAwareness}`}
        aria-labelledby="self-awareness-report-heading"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="self-awareness-report-heading" className={JOURNAL_SUBHEADING_CLASS}>
            SELF-AWARENESS REPORT
          </h2>
          <button
            type="button"
            className={JOURNAL_COLLAPSE_BUTTON_CLASS}
            aria-expanded={reportOpen}
            onClick={() => setReportOpen((open) => !open)}
          >
            {reportOpen ? "Collapse" : "Expand"}
          </button>
        </div>
        <p className="mt-3 text-[0.85rem] leading-relaxed text-bvm-muted">
          All saved page inputs are stored locally in one journal record: {STORAGE_KEY}.
        </p>

        {reportOpen ? (
          <pre
            className={`${JOURNAL_RECORDS_SHELL_CLASS} mt-5 max-h-[28rem] overflow-auto whitespace-pre-wrap text-[0.78rem] leading-6 text-bvm-fg`}
          >
            {report}
          </pre>
        ) : (
          <div className={`${JOURNAL_RECORDS_SHELL_CLASS} mt-5`}>
            <p className="text-[0.85rem] text-bvm-muted">
              Expand to view the combined report for this Self-Awareness page.
            </p>
          </div>
        )}
      </section>

      <footer className="mt-6 flex justify-start sm:mt-8">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-400/40 bg-white/30 text-sm font-medium tabular-nums text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
          aria-hidden
        >
          1
        </div>
      </footer>
    </div>
  );
}

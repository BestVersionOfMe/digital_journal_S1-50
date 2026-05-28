"use client";

import { useJournalStorage } from "@/hooks/useJournalStorage";
import {
  buildSelfAwarenessReportHtml,
  JOURNAL_GLASS_BORDER,
  JOURNAL_GLASS_PANEL_BASE,
  JOURNAL_PRIMARY_BUTTON_CLASS,
  JOURNAL_SUBHEADING_CLASS,
  STORAGE_KEY,
} from "@/lib/self-awareness";

export function JournalPageFooter() {
  const { state } = useJournalStorage();

  const handleExportPdf = () => {
    const frame = document.createElement("iframe");
    frame.title = "Self-Awareness PDF export";
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    document.body.appendChild(frame);

    const reportWindow = frame.contentWindow;
    const reportDocument = reportWindow?.document;
    if (!reportWindow || !reportDocument) {
      frame.remove();
      return;
    }

    const cleanup = () => {
      window.setTimeout(() => frame.remove(), 0);
    };

    reportWindow.onafterprint = cleanup;
    reportDocument.open();
    reportDocument.write(buildSelfAwarenessReportHtml(state));
    reportDocument.close();
    window.setTimeout(() => {
      reportWindow.focus();
      reportWindow.print();
    }, 250);
    window.setTimeout(() => {
      if (document.body.contains(frame)) frame.remove();
    }, 60000);
  };

  return (
    <div className="mx-auto max-w-[40rem] px-5 pb-12 sm:max-w-[42rem] sm:px-8">
      <section
        className={`${JOURNAL_GLASS_PANEL_BASE} ${JOURNAL_GLASS_BORDER.emotionalAwareness}`}
        aria-labelledby="self-awareness-report-heading"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="self-awareness-report-heading" className={`${JOURNAL_SUBHEADING_CLASS} text-left`}>
              SELF-AWARENESS REPORT
            </h2>
            <p className="mt-3 text-[0.85rem] leading-relaxed text-bvm-muted">
              Export a print-ready PDF report from the saved local journal record: {STORAGE_KEY}.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportPdf}
            className={`${JOURNAL_PRIMARY_BUTTON_CLASS} shrink-0 px-5 py-3`}
          >
            Export PDF
          </button>
        </div>
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

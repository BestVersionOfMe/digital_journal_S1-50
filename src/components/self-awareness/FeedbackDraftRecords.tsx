"use client";

import {
  JOURNAL_COLLAPSE_BUTTON_CLASS,
  JOURNAL_ICON_BUTTON_CLASS,
  JOURNAL_RECORD_CARD_CLASS,
  JOURNAL_RECORDS_SHELL_CLASS,
  type FeedbackDraftRecord,
} from "@/lib/self-awareness";

type Props = {
  headingId: string;
  title: string;
  emptyText: string;
  records: FeedbackDraftRecord[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
};

function formatRecordDate(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;
  return date.toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TrashIcon() {
  return (
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
  );
}

export function FeedbackDraftRecords({
  headingId,
  title,
  emptyText,
  records,
  open,
  onOpenChange,
  onDelete,
}: Props) {
  const hasRecords = records.length > 0;

  return (
    <section className="mt-8 border-t border-bvm-border pt-5" aria-labelledby={headingId}>
      <div className="flex items-center justify-between gap-3">
        <h3
          id={headingId}
          className="font-display text-[1.08rem] font-semibold tracking-[0.025em] text-bvm-title"
        >
          {title}
        </h3>
        {hasRecords ? (
          <button
            type="button"
            className={JOURNAL_COLLAPSE_BUTTON_CLASS}
            aria-expanded={open}
            onClick={() => onOpenChange(!open)}
          >
            {open ? "Collapse" : "Expand"}
          </button>
        ) : null}
      </div>

      {hasRecords ? (
        <p className="mt-2 text-[0.82rem] font-medium text-bvm-muted">
          {records.length} saved feedback record{records.length === 1 ? "" : "s"}
        </p>
      ) : null}

      {!hasRecords ? (
        <div className={`${JOURNAL_RECORDS_SHELL_CLASS} mt-4 px-4 py-8`}>
          <p className="text-center text-[0.9rem] leading-relaxed text-bvm-muted">
            {emptyText}
          </p>
        </div>
      ) : open ? (
        <div className="mt-4 space-y-3">
          {records.map((record, index) => (
            <article key={record.id} className={JOURNAL_RECORD_CARD_CLASS}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-[0.95rem] font-semibold text-bvm-fg">
                    Record {records.length - index}
                  </h4>
                  <p className="mt-0.5 text-[0.75rem] text-bvm-muted">
                    {formatRecordDate(record.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(record.id)}
                  className={JOURNAL_ICON_BUTTON_CLASS}
                  aria-label={`Delete feedback record ${records.length - index}`}
                >
                  <TrashIcon />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-bvm-muted">
                    Draft
                  </p>
                  <p className="mt-1 whitespace-pre-wrap rounded-xl border border-bvm-border bg-bvm-softBlue/35 px-4 py-3 text-[0.9rem] leading-relaxed text-bvm-fg">
                    {record.draftText}
                  </p>
                </div>
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-bvm-muted">
                    Reflection
                  </p>
                  <p className="mt-1 rounded-xl border border-bvm-border bg-white/70 px-4 py-3 text-[0.9rem] leading-relaxed text-bvm-fg">
                    {record.feelText}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

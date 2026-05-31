"use client";

import { useState } from "react";
import { useJournalStorage } from "@/hooks/useJournalStorage";
import {
  JOURNAL_GLASS_BORDER,
  JOURNAL_GLASS_PANEL_BASE,
  JOURNAL_PRIMARY_BUTTON_CLASS,
} from "@/lib/self-awareness";
import { FeedbackDraftRecords } from "@/components/self-awareness/FeedbackDraftRecords";

type Props = { headingId: string; embedded?: boolean };

const WHO_OPTIONS = [
  { id: "Mentor / Teacher", icon: "mentor", label: "Mentor" },
  { id: "Manager / Supervisor", icon: "briefcase", label: "Manager" },
  { id: "Teammate / Peer", icon: "team", label: "Teammate" },
];

const QUESTION_DECK = [
  {
    id: "q1",
    text: "What's one thing I did really well?",
    tip: "Confidence & Strengths",
  },
  {
    id: "q2",
    text: "What's one thing I could improve next time?",
    tip: "Constructive Criticism",
  },
  {
    id: "q3",
    text: "If you were in my shoes, what would you have done differently?",
    tip: "Actionable Alternatives",
  },
  {
    id: "q4",
    text: "Do you have any advice for me on how to improve?",
    tip: "Open-ended, Broad Wisdom.",
  },
];

function RecipientIcon({ type }: { type: string }) {
  if (type === "briefcase") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M9 7V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "team") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 19c.5-3 2-5 4-5s3.5 2 4 5M12 19c.5-3 2-5 4-5s3.5 2 4 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5 20c.8-4.2 3.2-6.5 7-6.5s6.2 2.3 7 6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 4.5 12 3l4 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8.5 14.5c-1.5-1.1-2.5-2.8-2.5-4.8A6 6 0 0 1 18 9.7c0 2-1 3.7-2.5 4.8-.8.6-1.2 1.2-1.3 2H9.8c-.1-.8-.5-1.4-1.3-2Z" />
    </svg>
  );
}

async function copyTextToClipboard(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  }
}

export function SeekingFeedbackSection({ headingId, embedded = false }: Props) {
  const {
    state,
    setSeekingFeedbackText,
    setSeekingFeedbackSubmitted,
    saveSeekingFeedbackRecord,
    removeSeekingFeedbackRecord,
  } = useJournalStorage();

  const [subStep, setSubStep] = useState(1);
  const [customWho, setCustomWho] = useState("");
  const [what, setWhat] = useState("");
  const [selectedQ, setSelectedQ] = useState("");
  const [useReflection, setUseReflection] = useState("");
  const [recordsOpen, setRecordsOpen] = useState(true);
  const [copyStatus, setCopyStatus] = useState("");

  const text = state.seekingFeedbackText;
  const trimmed = text.trim();
  const locked = state.seekingFeedbackSubmitted && trimmed.length > 0;
  const activeSubStep = locked ? 3 : subStep;
  const isInfoReady = customWho.trim().length > 0 && what.trim().length > 0;

  const handleGenerate = () => {
    const name = customWho.trim();
    const topic = what.trim();
    const question = selectedQ.trim();
    let template = "";

    if (question === QUESTION_DECK[0].text) {
      template = `Hi ${name},\n\nI'm currently reflecting on ${topic} and want to identify my strengths so I can keep building on them.\n\nCould you let me know: ${question}\n\nThanks for your time!`;
    } else if (question === QUESTION_DECK[1].text) {
      template = `Hi ${name},\n\nI'm always looking for ways to grow, especially regarding ${topic}. I'd love to get your honest feedback to help me level up.\n\n${question}\n\nI really appreciate your insights.`;
    } else if (question === QUESTION_DECK[2].text) {
      template = `Hi ${name},\n\nI've been thinking about ${topic} and wanted to get your take on it. I really respect your experience and would love to learn from your approach.\n\n${question}\n\nThank you!`;
    } else if (question === QUESTION_DECK[3].text) {
      template = `Hi ${name},\n\nI'm working on developing my skills in ${topic}, and your guidance would mean a lot to me.\n\n${question}\n\nThanks so much for your support.`;
    } else {
      template = `Hi ${name},\n\nI'm trying to reflect on and improve ${topic}. I really value your perspective.\n\n${question}\n\nThank you!`;
    }

    setSeekingFeedbackText(template);
    setSeekingFeedbackSubmitted(false);
    setUseReflection("");
    setCopyStatus("");
    setSubStep(3);
  };

  const handleStartOver = () => {
    setSubStep(1);
    setCustomWho("");
    setWhat("");
    setSelectedQ("");
    setUseReflection("");
    setCopyStatus("");
    setSeekingFeedbackText("");
    setSeekingFeedbackSubmitted(false);
  };

  const handleCopyDraft = async () => {
    if (trimmed.length === 0) return;
    const copied = await copyTextToClipboard(trimmed);
    if (copied) {
      setSeekingFeedbackSubmitted(true);
      setCopyStatus("Draft copied. Add how it felt after using it.");
    } else {
      setCopyStatus("Copy did not work. Please copy the draft manually.");
    }
  };

  const handleSubmitRecord = () => {
    if (trimmed.length === 0 || useReflection.trim().length === 0) return;
    saveSeekingFeedbackRecord(trimmed, useReflection);
    handleStartOver();
  };

  const content = (
    <section
      className={`relative ${JOURNAL_GLASS_PANEL_BASE} ${JOURNAL_GLASS_BORDER.seekingFeedback} min-h-[420px] p-6 transition-all duration-500 sm:p-8`}
      aria-labelledby={headingId}
    >
      <div className="pb-6">
        <p className="font-display text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-bvm-title">
          Seeking Feedback
        </p>
        <h2 className="text-[1.1rem] font-bold tracking-tight text-slate-800">
          Craft your Feedback Request
        </h2>
        <p className="mt-1 text-[0.9rem] text-slate-500">
          {"Let's build a specific, actionable message."}
        </p>
      </div>

      <div className="animate-fade-in">
        {activeSubStep === 1 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <label className="mb-3 block text-[0.95rem] font-semibold text-slate-800">
                1. Who are you asking?
              </label>
              <input
                type="text"
                placeholder="Enter name or role..."
                value={customWho}
                onChange={(e) => setCustomWho(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-4 py-2.5 text-[0.9375rem] focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
              />
              <div className="mt-3 flex flex-wrap gap-2.5">
                {WHO_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCustomWho(customWho === opt.id ? "" : opt.id)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-all ${
                      customWho === opt.id
                        ? "border-[#7b8fd4] bg-[#7b8fd4]/10 text-[#5468b1]"
                        : "border-slate-200/90 bg-white/60 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <RecipientIcon type={opt.icon} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                2. What topic?
              </label>
              <input
                type="text"
                placeholder="e.g., my presentation, the code I just merged..."
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-4 py-2.5 text-[0.9375rem] focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                disabled={!isInfoReady}
                onClick={() => setSubStep(2)}
                className="inline-flex items-center gap-2 rounded-xl bg-bvm-title px-5 py-2.5 text-[0.95rem] font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {activeSubStep === 2 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <label
                htmlFor="seeking-feedback-question"
                className="block text-[0.95rem] font-semibold text-slate-800"
              >
                3. Choose a powerful question
              </label>
              <textarea
                id="seeking-feedback-question"
                rows={3}
                value={selectedQ}
                onChange={(e) => setSelectedQ(e.target.value)}
                placeholder="Write your own question first..."
                className="mt-3 w-full resize-y rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-[0.9375rem] leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
              />
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-slate-500">
                Or choose a suggested question below.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {QUESTION_DECK.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setSelectedQ(selectedQ === q.text ? "" : q.text)}
                    className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                      selectedQ === q.text
                        ? "border-[#7b8fd4] bg-[#7b8fd4]/5 ring-1 ring-[#7b8fd4]"
                        : "border-slate-200/80 bg-white/50 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`text-[0.9375rem] font-semibold ${
                        selectedQ === q.text ? "text-[#5468b1]" : "text-slate-800"
                      }`}
                    >
                      &quot;{q.text}&quot;
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[0.8125rem] leading-relaxed text-slate-500">
                      <LightbulbIcon className="h-3.5 w-3.5 text-bvm-action" />
                      {q.tip}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex item-center justify-end gap-6 pt-4">
              <button
                type="button"
                onClick={() => setSubStep(1)}
                className="text-[0.8125rem] font-medium text-slate-500 underline decoration-transparent underline-offset-4 transition-colors hover:text-slate-800 hover:decoration-slate-300"
              >
                Back
              </button>

              <button
                type="button"
                disabled={selectedQ.trim().length === 0}
                onClick={handleGenerate}
                className="rounded-xl bg-bvm-title px-5 py-2.5 text-[0.95rem] font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-40"
              >
                Generate
              </button>
            </div>
          </div>
        )}

        {activeSubStep === 3 && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[1rem] font-bold text-slate-800">Your Draft</h3>
              <div className="flex items-center gap-5">
                {!locked ? (
                  <button
                    type="button"
                    onClick={() => setSubStep(2)}
                    className="text-[0.8125rem] font-medium text-slate-500 underline decoration-transparent underline-offset-4 transition-colors hover:text-slate-800 hover:decoration-slate-300"
                  >
                    Back
                  </button>
                ) : null}
                {locked ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSeekingFeedbackSubmitted(false);
                      setCopyStatus("");
                    }}
                    className={`${JOURNAL_PRIMARY_BUTTON_CLASS} px-5 py-2.5`}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={trimmed.length === 0}
                    onClick={handleCopyDraft}
                    className={`${JOURNAL_PRIMARY_BUTTON_CLASS} px-5 py-2.5`}
                  >
                    Copy
                  </button>
                )}
              </div>
            </div>

            {locked ? (
              <div className="min-h-[8rem] whitespace-pre-wrap rounded-xl border border-bvm-border bg-bvm-softBlue/35 px-5 py-4 text-[0.9375rem] leading-relaxed text-bvm-fg">
                {text}
              </div>
            ) : (
              <textarea
                rows={8}
                value={text}
                onChange={(e) => setSeekingFeedbackText(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-5 py-4 text-[0.9375rem] text-slate-800 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
              />
            )}

            {copyStatus ? (
              <p className="text-right text-[0.78rem] font-medium text-bvm-muted">
                {copyStatus}
              </p>
            ) : null}

            {locked ? (
              <div className="rounded-2xl border border-bvm-border bg-white/70 px-4 py-4">
                <label
                  htmlFor="seeking-feedback-feel"
                  className="mb-2 block text-[0.85rem] font-semibold text-bvm-fg"
                >
                  How did using this feedback request feel?
                </label>
                <textarea
                  id="seeking-feedback-feel"
                  rows={3}
                  value={useReflection}
                  onChange={(e) => setUseReflection(e.target.value)}
                  placeholder="Write what happened after you used this draft..."
                  className="w-full resize-y rounded-xl border border-bvm-border bg-white px-4 py-3 text-[0.9375rem] leading-relaxed text-bvm-fg placeholder:text-bvm-muted/70 focus:border-bvm-action focus:outline-none focus:ring-2 focus:ring-bvm-action/20"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={useReflection.trim().length === 0}
                    onClick={handleSubmitRecord}
                    className={`${JOURNAL_PRIMARY_BUTTON_CLASS} px-5 py-2.5`}
                  >
                    Submit record
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <FeedbackDraftRecords
        headingId={`${headingId}-records`}
        title="MY SEEKING FEEDBACK RECORDS"
        emptyText="Copy a feedback request and add how it felt to start a record."
        records={state.seekingFeedbackRecords}
        open={recordsOpen}
        onOpenChange={setRecordsOpen}
        onDelete={removeSeekingFeedbackRecord}
      />
    </section>
  );

  if (embedded) return content;

  return (
    <div className="mx-auto max-w-[40rem] px-5 pb-16 pt-8 sm:max-w-[42rem] sm:px-8 sm:pb-20 sm:pt-10">
      {content}
    </div>
  );
}

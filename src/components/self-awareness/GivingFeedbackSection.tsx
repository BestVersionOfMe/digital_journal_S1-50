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

const RECIPIENT_OPTIONS = [
  { id: "Classmate", icon: "person", label: "Classmate" },
  { id: "Teammate", icon: "team", label: "Teammate" },
  { id: "Friend", icon: "friend", label: "Friend" },
  { id: "Group member", icon: "group", label: "Group member" },
];

const GLOW_PRESETS = [
  {
    id: "clear-idea",
    text: "Explaining the main idea clearly",
    tip: "Clear communication",
  },
  {
    id: "team-support",
    text: "Working well with the group and supporting others",
    tip: "Teamwork",
  },
  {
    id: "strong-effort",
    text: "Putting in strong effort and staying focused",
    tip: "Effort",
  },
  {
    id: "confident-sharing",
    text: "Showing confidence and sharing your ideas",
    tip: "Confidence",
  },
];

const GROW_PRESETS = [
  {
    id: "pacing",
    text: "Pausing a little more so the audience can follow",
    tip: "Pacing",
  },
  {
    id: "specific-detail",
    text: "Adding one more example or detail to make your point stronger",
    tip: "Specific evidence",
  },
  {
    id: "active-listening",
    text: "Listening carefully to others before responding",
    tip: "Active listening",
  },
  {
    id: "preparation",
    text: "Practising the next step earlier so it feels smoother",
    tip: "Preparation",
  },
];

type PresetOption = {
  id: string;
  text: string;
  tip: string;
};

function SunGlowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.9" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="12"
          y1="2"
          x2="12"
          y2="4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  );
}

function SproutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20v-4M5 12c2-4 6-5 7-8 1 3 5 4 7 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 14c2-2 5-2 8 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
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

function RecipientIcon({ type }: { type: string }) {
  if (type === "team" || type === "group") {
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

  if (type === "friend") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M7.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 19c.5-3 1.7-5 3.5-5 1.4 0 2.4 1.1 3 3M13.5 17c.6-1.9 1.6-3 3-3 1.8 0 3 2 3.5 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5 14.5 12 16l1.5-1.5"
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
    </svg>
  );
}

function PresetCards({
  accent,
  options,
  value,
  onChange,
}: {
  accent: "glow" | "grow";
  options: PresetOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const selectedClasses =
    accent === "glow"
      ? "border-pink-300 bg-pink-50/80 ring-1 ring-pink-200"
      : "border-teal-300 bg-teal-50/80 ring-1 ring-teal-200";
  const selectedText = accent === "glow" ? "text-pink-700" : "text-teal-700";

  return (
    <div className="mt-3 grid grid-cols-2 gap-2.5 sm:gap-3">
      {options.map((option) => {
        const selected = value === option.text;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(selected ? "" : option.text)}
            className={`flex min-h-[8rem] flex-col items-start rounded-xl border p-3 text-left transition-all sm:min-h-[7.5rem] sm:p-4 ${
              selected
                ? selectedClasses
                : "border-slate-200/80 bg-white/50 hover:bg-white"
            }`}
          >
            <span
              className={`text-[0.78rem] font-semibold leading-snug sm:text-[0.9375rem] ${
                selected ? selectedText : "text-slate-800"
              }`}
            >
              {option.text}
            </span>
            <span className="mt-2 inline-flex items-center gap-1.5 text-[0.7rem] leading-relaxed text-slate-500 sm:text-[0.8125rem]">
              <LightbulbIcon className="h-3.5 w-3.5 text-bvm-action" />
              {option.tip}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function sentenceFragment(value: string, presets: PresetOption[]): string {
  if (value.length === 0) return value;
  if (!presets.some((preset) => preset.text === value)) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
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

export function GivingFeedbackSection({ headingId, embedded = false }: Props) {
  const {
    state,
    setGivingFeedbackText,
    setGivingFeedbackSubmitted,
    saveGivingFeedbackRecord,
    removeGivingFeedbackRecord,
  } = useJournalStorage();
  const [subStep, setSubStep] = useState(1);
  const [customRecipient, setCustomRecipient] = useState("");
  const [topic, setTopic] = useState("");
  const [glow, setGlow] = useState("");
  const [grow, setGrow] = useState("");
  const [useReflection, setUseReflection] = useState("");
  const [recordsOpen, setRecordsOpen] = useState(true);
  const [copyStatus, setCopyStatus] = useState("");

  const text = state.givingFeedbackText;
  const trimmed = text.trim();
  const locked = state.givingFeedbackSubmitted && trimmed.length > 0;
  const activeSubStep = locked ? 3 : subStep;
  const infoReady = customRecipient.trim().length > 0 && topic.trim().length > 0;
  const glowGrowReady = glow.trim().length > 0 && grow.trim().length > 0;

  const handleGenerate = () => {
    const name = customRecipient.trim();
    const feedbackTopic = topic.trim();
    const glowText = sentenceFragment(glow.trim(), GLOW_PRESETS);
    const growText = sentenceFragment(grow.trim(), GROW_PRESETS);

    const draft = `Hi ${name},

I wanted to share some feedback about ${feedbackTopic}.

I think you did really well with ${glowText}. One thing that could make it even stronger next time is ${growText}.

I hope this is helpful.`;

    setGivingFeedbackText(draft);
    setGivingFeedbackSubmitted(false);
    setUseReflection("");
    setCopyStatus("");
    setSubStep(3);
  };

  const handleStartOver = () => {
    setSubStep(1);
    setCustomRecipient("");
    setTopic("");
    setGlow("");
    setGrow("");
    setUseReflection("");
    setCopyStatus("");
    setGivingFeedbackText("");
    setGivingFeedbackSubmitted(false);
  };

  const handleCopyDraft = async () => {
    if (trimmed.length === 0) return;
    const copied = await copyTextToClipboard(trimmed);
    if (copied) {
      setGivingFeedbackSubmitted(true);
      setCopyStatus("Draft copied. Add how it felt after using it.");
    } else {
      setCopyStatus("Copy did not work. Please copy the draft manually.");
    }
  };

  const handleSubmitRecord = () => {
    if (trimmed.length === 0 || useReflection.trim().length === 0) return;
    saveGivingFeedbackRecord(trimmed, useReflection);
    handleStartOver();
  };

  const content = (
    <section
      className={`relative ${JOURNAL_GLASS_PANEL_BASE} ${JOURNAL_GLASS_BORDER.givingFeedback}`}
      aria-labelledby={headingId}
    >
      <div className="pb-6">
        <p className="font-display text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-bvm-title">
          Giving Feedback
        </p>
        <h2 className="text-[1.1rem] font-bold tracking-tight text-slate-800">
          Craft your Glow &amp; Grow Feedback
        </h2>
        <p className="mt-1 text-[0.9rem] text-slate-500">
          Build a specific, supportive message for someone else.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3 rounded-xl bg-slate-100/90 px-4 py-3.5">
          <SunGlowIcon className="mt-0.5 h-7 w-7 shrink-0 text-pink-400" />
          <div>
            <p className="font-display text-[0.8rem] font-bold uppercase tracking-wide text-pink-500">
              Glow
            </p>
            <p className="mt-1 text-[0.9rem] leading-relaxed text-slate-700">
              Start with something positive the person did really well.
            </p>
          </div>
        </div>

        <div className="flex gap-3 rounded-xl bg-slate-100/90 px-4 py-3.5">
          <SproutIcon className="mt-0.5 h-7 w-7 shrink-0 text-teal-500" />
          <div>
            <p className="font-display text-[0.8rem] font-bold uppercase tracking-wide text-teal-600">
              Grow
            </p>
            <p className="mt-1 text-[0.9rem] leading-relaxed text-slate-700">
              Suggest one thing they could improve or work on next time.
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-8">
        <div className="animate-fade-in">
          {activeSubStep === 1 && (
            <div className="space-y-6">
              <div>
                <p className="mb-3 block text-[0.95rem] font-semibold text-slate-800">
                  1. Who are you giving feedback to?
                </p>
                <input
                  id="giving-feedback-recipient"
                  type="text"
                  value={customRecipient}
                  onChange={(e) => setCustomRecipient(e.target.value)}
                  placeholder="Enter name or role..."
                  className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-4 py-2.5 text-[0.9375rem] text-slate-800 placeholder:text-slate-400 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
                />
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {RECIPIENT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setCustomRecipient(customRecipient === option.id ? "" : option.id)
                      }
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-all ${
                        customRecipient === option.id
                          ? "border-pink-300 bg-pink-50 text-pink-700"
                          : "border-slate-200/90 bg-white/60 text-slate-600 hover:bg-white"
                      }`}
                    >
                      <RecipientIcon type={option.icon} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="giving-feedback-topic"
                  className="mb-2 block text-[0.95rem] font-semibold text-slate-800"
                >
                  2. What are you giving feedback about?
                </label>
                <input
                  id="giving-feedback-topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., their presentation, teamwork, class activity..."
                  className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-4 py-2.5 text-[0.9375rem] text-slate-800 placeholder:text-slate-400 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  disabled={!infoReady}
                  onClick={() => setSubStep(2)}
                  className="rounded-xl bg-bvm-title px-5 py-2.5 text-[0.95rem] font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {activeSubStep === 2 && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="giving-feedback-glow"
                  className="mb-2 block text-[0.95rem] font-semibold text-slate-800"
                >
                  3. Glow: what did they do well?
                </label>
                <p className="mb-3 text-[0.8125rem] leading-relaxed text-slate-500">
                  Write your own first, or choose a preset below.
                </p>
                <textarea
                  id="giving-feedback-glow"
                  rows={4}
                  value={glow}
                  onChange={(e) => setGlow(e.target.value)}
                  placeholder="Describe one specific strength or positive action..."
                  className="w-full resize-y rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-[0.9375rem] leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
                />
                <PresetCards
                  accent="glow"
                  options={GLOW_PRESETS}
                  value={glow}
                  onChange={setGlow}
                />
              </div>

              <div>
                <label
                  htmlFor="giving-feedback-grow"
                  className="mb-2 block text-[0.95rem] font-semibold text-slate-800"
                >
                  4. Grow: what could they improve next time?
                </label>
                <p className="mb-3 text-[0.8125rem] leading-relaxed text-slate-500">
                  Write your own next step first, or choose a preset below.
                </p>
                <textarea
                  id="giving-feedback-grow"
                  rows={4}
                  value={grow}
                  onChange={(e) => setGrow(e.target.value)}
                  placeholder="Suggest one clear, supportive next step..."
                  className="w-full resize-y rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-[0.9375rem] leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
                />
                <PresetCards
                  accent="grow"
                  options={GROW_PRESETS}
                  value={grow}
                  onChange={setGrow}
                />
              </div>

              <div className="flex items-center justify-end gap-6 pt-4">
                <button
                  type="button"
                  onClick={() => setSubStep(1)}
                  className="text-[0.8125rem] font-medium text-slate-500 underline decoration-transparent underline-offset-4 transition-colors hover:text-slate-800 hover:decoration-slate-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!glowGrowReady}
                  onClick={handleGenerate}
                  className="rounded-xl bg-bvm-title px-5 py-2.5 text-[0.95rem] font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  Generate
                </button>
              </div>
            </div>
          )}

          {activeSubStep === 3 && (
            <div className="space-y-6">
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
                        setGivingFeedbackSubmitted(false);
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
                  id="giving-feedback-glow-grow"
                  name="givingFeedback"
                  rows={8}
                  value={text}
                  onChange={(e) => setGivingFeedbackText(e.target.value)}
                  className="w-full resize-y rounded-xl border border-slate-200/80 bg-white/70 px-5 py-4 text-[0.9375rem] leading-relaxed text-slate-800 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
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
                    htmlFor="giving-feedback-feel"
                    className="mb-2 block text-[0.85rem] font-semibold text-bvm-fg"
                  >
                    How did sharing this feedback feel?
                  </label>
                  <textarea
                    id="giving-feedback-feel"
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
      </div>

      <FeedbackDraftRecords
        headingId={`${headingId}-records`}
        title="MY GIVING FEEDBACK RECORDS"
        emptyText="Copy a feedback draft and add how it felt to start a record."
        records={state.givingFeedbackRecords}
        open={recordsOpen}
        onOpenChange={setRecordsOpen}
        onDelete={removeGivingFeedbackRecord}
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

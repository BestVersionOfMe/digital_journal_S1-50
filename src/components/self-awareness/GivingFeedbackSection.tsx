"use client";

import { useState } from "react";
import { useJournalStorage } from "@/hooks/useJournalStorage";
import { JOURNAL_GLASS_BORDER, JOURNAL_GLASS_PANEL_BASE } from "@/lib/self-awareness";

type Props = { headingId: string; embedded?: boolean };

const RECIPIENT_OPTIONS = [
  { id: "Classmate", label: "Classmate" },
  { id: "Teammate", label: "Teammate" },
  { id: "Friend", label: "Friend" },
  { id: "Group member", label: "Group member" },
];

const GLOW_PRESETS = [
  {
    id: "clear-idea",
    text: "explaining the main idea clearly",
    tip: "Clear communication",
  },
  {
    id: "team-support",
    text: "working well with the group and supporting others",
    tip: "Teamwork",
  },
  {
    id: "strong-effort",
    text: "putting in strong effort and staying focused",
    tip: "Effort",
  },
  {
    id: "confident-sharing",
    text: "showing confidence and sharing your ideas",
    tip: "Confidence",
  },
];

const GROW_PRESETS = [
  {
    id: "pacing",
    text: "pausing a little more so the audience can follow",
    tip: "Pacing",
  },
  {
    id: "specific-detail",
    text: "adding one more example or detail to make your point stronger",
    tip: "Specific evidence",
  },
  {
    id: "active-listening",
    text: "listening carefully to others before responding",
    tip: "Active listening",
  },
  {
    id: "preparation",
    text: "practising the next step earlier so it feels smoother",
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
    <div className="mb-3 grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const selected = value === option.text;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(selected ? "" : option.text)}
            className={`flex min-h-[7.5rem] flex-col items-start rounded-xl border p-4 text-left transition-all ${
              selected
                ? selectedClasses
                : "border-slate-200/80 bg-white/50 hover:bg-white"
            }`}
          >
            <span
              className={`text-[0.9375rem] font-semibold leading-snug ${
                selected ? selectedText : "text-slate-800"
              }`}
            >
              {option.text}
            </span>
            <span className="mt-2 text-[0.8125rem] leading-relaxed text-slate-500">
              {option.tip}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

export function GivingFeedbackSection({ headingId, embedded = false }: Props) {
  const {
    state,
    setGivingFeedbackText,
    setGivingFeedbackSubmitted,
  } = useJournalStorage();
  const [subStep, setSubStep] = useState(1);
  const [customRecipient, setCustomRecipient] = useState("");
  const [topic, setTopic] = useState("");
  const [glow, setGlow] = useState("");
  const [grow, setGrow] = useState("");

  const text = state.givingFeedbackText;
  const trimmed = text.trim();
  const locked = state.givingFeedbackSubmitted && trimmed.length > 0;
  const activeRecipient = customRecipient;
  const infoReady = activeRecipient.trim().length > 0 && topic.trim().length > 0;
  const glowGrowReady = glow.trim().length > 0 && grow.trim().length > 0;

  const handleGenerate = () => {
    const name = activeRecipient.trim();
    const feedbackTopic = topic.trim();
    const glowText = glow.trim();
    const growText = grow.trim();

    const draft = `Hi ${name},

I wanted to share some feedback about ${feedbackTopic}.

I think you did really well with ${glowText}. One thing that could make it even stronger next time is ${growText}.

I hope this is helpful.`;

    setGivingFeedbackText(draft);
    setGivingFeedbackSubmitted(false);
    setSubStep(3);
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
              <p className="font-display text-[0.8rem] font-bold uppercase tracking-wide text-pink-500">Glow</p>
              <p className="mt-1 text-[0.9rem] leading-relaxed text-slate-700">
                Start with something positive the person did really well.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-xl bg-slate-100/90 px-4 py-3.5">
            <SproutIcon className="mt-0.5 h-7 w-7 shrink-0 text-teal-500" />
            <div>
              <p className="font-display text-[0.8rem] font-bold uppercase tracking-wide text-teal-600">Grow</p>
              <p className="mt-1 text-[0.9rem] leading-relaxed text-slate-700">
                Suggest one thing they could improve or work on next time.
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-8">
          {locked ? (
            <div className="animate-fade-in">
              <div className="mb-4 flex items-center justify-between pr-2">
                <h3 className="text-[1rem] font-bold text-slate-800">Your Feedback</h3>
                <button
                  type="button"
                  onClick={() => {
                    setGivingFeedbackSubmitted(false);
                    setSubStep(3);
                  }}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/60 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200/80"
                  aria-label="Edit feedback"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="min-h-[6rem] whitespace-pre-wrap rounded-xl border border-slate-200/80 bg-[#f3e8f5]/35 px-5 py-4 text-[0.9375rem] leading-relaxed text-slate-800">
                {text}
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              {subStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <p className="mb-3 block text-[0.95rem] font-semibold text-slate-800">
                      1. Who are you giving feedback to?
                    </p>
                    <input
                      id="giving-feedback-recipient"
                      type="text"
                      value={customRecipient}
                      onChange={(e) => {
                        const next = e.target.value;
                        setCustomRecipient(next);
                      }}
                      placeholder="Enter name or role..."
                      className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-4 py-2.5 text-[0.9375rem] text-slate-800 placeholder:text-slate-400 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
                    />
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {RECIPIENT_OPTIONS.map((option) => {
                        const selected = customRecipient === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              setCustomRecipient(selected ? "" : option.id);
                            }}
                            className={`rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-all ${
                              selected
                                ? "border-pink-300 bg-pink-50 text-pink-700"
                                : "border-slate-200/90 bg-white/60 text-slate-600 hover:bg-white"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
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

              {subStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="giving-feedback-glow"
                      className="mb-2 block text-[0.95rem] font-semibold text-slate-800"
                    >
                      3. Glow: what did they do well?
                    </label>
                    <p className="mb-3 text-[0.8125rem] leading-relaxed text-slate-500">
                      Choose a preset or write your own.
                    </p>
                    <PresetCards
                      accent="glow"
                      options={GLOW_PRESETS}
                      value={glow}
                      onChange={setGlow}
                    />
                    <textarea
                      id="giving-feedback-glow"
                      rows={4}
                      value={glow}
                      onChange={(e) => setGlow(e.target.value)}
                      placeholder="Describe one specific strength or positive action..."
                      className="w-full resize-y rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-[0.9375rem] leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
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
                      Choose one supportive next step, then adjust it if needed.
                    </p>
                    <PresetCards
                      accent="grow"
                      options={GROW_PRESETS}
                      value={grow}
                      onChange={setGrow}
                    />
                    <textarea
                      id="giving-feedback-grow"
                      rows={4}
                      value={grow}
                      onChange={(e) => setGrow(e.target.value)}
                      placeholder="Suggest one clear, supportive next step..."
                      className="w-full resize-y rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-[0.9375rem] leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
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

              {subStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-[1rem] font-bold text-slate-800">Your Draft</h3>
                  <textarea
                    id="giving-feedback-glow-grow"
                    name="givingFeedback"
                    rows={8}
                    value={text}
                    onChange={(e) => setGivingFeedbackText(e.target.value)}
                    className="w-full resize-y rounded-xl border border-slate-200/80 bg-white/70 px-5 py-4 text-[0.9375rem] leading-relaxed text-slate-800 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
                  />
                  <div className="flex items-center justify-end gap-6 pt-4">
                    <button
                      type="button"
                      onClick={() => setSubStep(2)}
                      className="text-[0.8125rem] font-medium text-slate-500 underline decoration-transparent underline-offset-4 transition-colors hover:text-slate-800 hover:decoration-slate-300"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={trimmed.length === 0}
                      onClick={() => setGivingFeedbackSubmitted(true)}
                      className="rounded-xl bg-bvm-title px-5 py-2.5 text-[0.95rem] font-semibold uppercase text-white shadow-md transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
  );

  if (embedded) return content;

  return (
    <div className="mx-auto max-w-[40rem] px-5 pb-16 pt-8 sm:max-w-[42rem] sm:px-8 sm:pb-20 sm:pt-10">
      {content}
    </div>
  );
}

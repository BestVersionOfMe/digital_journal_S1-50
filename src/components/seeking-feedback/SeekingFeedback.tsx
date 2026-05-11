"use client";

import { useState } from "react";
import { useJournalStorage } from "@/hooks/useJournalStorage";
import { JOURNAL_GLASS_BORDER, JOURNAL_GLASS_PANEL_BASE } from "@/lib/self-awareness";

type Props = { headingId: string; embedded?: boolean };

const WHO_OPTIONS = [
  { id: "Mentor / Teacher", icon: "👨‍🏫", label: "Mentor" },
  { id: "Manager / Supervisor", icon: "💼", label: "Manager" },
  { id: "Teammate / Peer", icon: "👥", label: "Teammate" },
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

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

export function SeekingFeedbackSection({ headingId, embedded = false }: Props) {
  const { state, setSeekingFeedbackText, setSeekingFeedbackSubmitted } = useJournalStorage();


  // 1: Who/What, 2: Question, 3: Draft
  const [subStep, setSubStep] = useState(1);
  const [customWho, setCustomWho] = useState("");
  const [what, setWhat] = useState("");
  const [selectedQ, setSelectedQ] = useState("");

  const text = state.seekingFeedbackText;
  const locked = state.seekingFeedbackSubmitted && text.trim().length > 0;

  const activeWho = customWho;
  const isInfoReady = activeWho.trim().length > 0 && what.trim().length > 0;

  const handleGenerate = () => {
    const name = activeWho.trim();
    const topic = what.trim();
    let template = "";

    if (selectedQ === QUESTION_DECK[0].text) {
      // Scene 1：What's one thing I did really well?
      template = `Hi ${name},\n\nI'm currently reflecting on ${topic} and want to identify my strengths so I can keep building on them.\n\nCould you let me know: ${selectedQ}\n\nThanks for your time!`;

    } else if (selectedQ === QUESTION_DECK[1].text) {
      // Scene 2：What's one thing I could improve next time?
      template = `Hi ${name},\n\nI'm always looking for ways to grow, especially regarding ${topic}. I'd love to get your honest feedback to help me level up.\n\n${selectedQ}\n\nI really appreciate your insights.`;

    } else if (selectedQ === QUESTION_DECK[2].text) {
      // Scene 3：If you were in my shoes...
      template = `Hi ${name},\n\nI've been thinking about ${topic} and wanted to get your take on it. I really respect your experience and would love to learn from your approach.\n\n${selectedQ}\n\nThank you!`;

    } else if (selectedQ === QUESTION_DECK[3].text) {
      // Sence 4：Do you have any advice...
      template = `Hi ${name},\n\nI'm working on developing my skills in ${topic}, and your guidance would mean a lot to me.\n\n${selectedQ}\n\nThanks so much for your support.`;

    } else {
      template = `Hi ${name},\n\nI'm trying to reflect on and improve ${topic}. I really value your perspective.\n\n${selectedQ}\n\nThank you!`;
    }

    setSeekingFeedbackText(template);
    setSubStep(3);
  };

  const handleStartOver = () => {
    setSubStep(1);
    setCustomWho("");
    setWhat("");
    setSelectedQ("");
    setSeekingFeedbackText("");
  };

  const content = (
      <section

        className={`relative ${JOURNAL_GLASS_PANEL_BASE} ${JOURNAL_GLASS_BORDER.seekingFeedback} p-6 sm:p-8 min-h-[420px] transition-all duration-500`}
        aria-labelledby={headingId}
      >

        <div className="pb-6">
          <p className="font-display text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-bvm-title">
            Seeking Feedback
          </p>
          <h2 className="text-[1.1rem] font-bold text-slate-800 tracking-tight">Craft your Feedback Request</h2>
          <p className="mt-1 text-[0.9rem] text-slate-500">{"Let's build a specific, actionable message."}</p>
        </div>

        {locked ? (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4 pr-2">
              <h3 className="text-[1rem] font-bold text-slate-800">Your Request</h3>
              <button
                type="button"
                onClick={() => setSeekingFeedbackSubmitted(false)}
                className="rounded-lg p-2 text-slate-500 hover:text-bvm-title transition-colors"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="whitespace-pre-wrap rounded-xl border border-slate-200/80 bg-[#e8e4f2]/35 px-5 py-4 text-[0.9375rem] text-slate-800">
              {text}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">

            {/* STEP 1: WHO & WHAT */}
            {subStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-[0.95rem] font-semibold text-slate-800 mb-3">1. Who are you asking?</label>
                  <input
                    type="text"
                    placeholder="Enter name or role..."
                    value={customWho}
                    onChange={(e) => {
                      const next = e.target.value;
                      setCustomWho(next);
                    }}
                    className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-4 py-2.5 text-[0.9375rem] focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
                  />
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {WHO_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          const selected = customWho === opt.id;
                          setCustomWho(selected ? "" : opt.id);
                        }}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-all ${customWho === opt.id ? "border-[#7b8fd4] bg-[#7b8fd4]/10 text-[#5468b1]" : "border-slate-200/90 bg-white/60 text-slate-600 hover:bg-white"
                          }`}
                      >
                        <span>{opt.icon}</span> {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[0.95rem] font-semibold text-slate-800 mb-2">2. What topic?</label>
                  <input
                    type="text"
                    placeholder="e.g., my presentation, the code I just merged..."
                    value={what}
                    onChange={(e) => setWhat(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-4 py-2.5 text-[0.9375rem] focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    disabled={!isInfoReady}
                    onClick={() => setSubStep(2)}
                    className="inline-flex items-center gap-2 rounded-xl bg-bvm-title px-5 py-2.5 text-[0.95rem] font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    Next
                    <span aria-hidden>≫</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: QUESTION SELECTION */}
            {subStep === 2 && (
              <div className="animate-fade-in space-y-6">
                <div>
                  <label className="block text-[0.95rem] font-semibold text-slate-800">3. Choose a powerful question</label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {QUESTION_DECK.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQ(selectedQ === q.text ? "" : q.text)}
                      className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${selectedQ === q.text ? "border-[#7b8fd4] bg-[#7b8fd4]/5 ring-1 ring-[#7b8fd4]" : "border-slate-200/80 bg-white/50 hover:bg-white"
                        }`}
                    >
                      <span className={`text-[0.9375rem] font-semibold ${selectedQ === q.text ? 'text-[#5468b1]' : 'text-slate-800'}`}>{'"'}{q.text}{'"'}</span>
                      <span className="mt-2 text-[0.8125rem] text-slate-500 leading-relaxed">💡 {q.tip}</span>
                    </button>
                  ))}
                </div>
                <div className="pt-4 flex item-center justify-end gap-6">

                  <button
                    onClick={() => setSubStep(1)}
                    className="text-[0.8125rem] font-medium text-slate-500 transition-colors hover:text-slate-800 underline decoration-transparent hover:decoration-slate-300 underline-offset-4"
                  >
                    ← Back
                  </button>

                  <button
                    disabled={selectedQ === ""}
                    onClick={handleGenerate}
                    className="rounded-xl bg-bvm-title px-5 py-2.5 text-[0.95rem] font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-40"
                  >
                    Generate
                    <span aria-hidden>✨</span>
                  </button>

                </div>
              </div>
            )}

            {/* STEP 3: DRAFT & SUBMIT */}
            {subStep === 3 && (
              <div className="animate-fade-in space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[1rem] font-bold text-slate-800">Your Draft</h3>
                </div>
                <textarea
                  rows={8}
                  value={text}
                  onChange={(e) => setSeekingFeedbackText(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-5 py-4 text-[0.9375rem] text-slate-800 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
                />
                <div className="pt-4 flex items-center justify-end gap-6">

                  <button
                    onClick={() => setSubStep(2)}
                    className="text-[0.8125rem] font-medium text-slate-500 transition-colors hover:text-slate-800 underline decoration-transparent hover:decoration-slate-300 underline-offset-4"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setSeekingFeedbackSubmitted(true)}
                    className="rounded-xl bg-bvm-title px-5 py-2.5 text-[0.95rem] font-semibold uppercase text-white shadow-md hover:-translate-y-0.5 disabled:opacity-40"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
  );

  if (embedded) return content;

  return (
    <div className="mx-auto max-w-[40rem] px-5 pb-16 pt-8 sm:max-w-[42rem] sm:px-8 sm:pb-20 sm:pt-10">
      {content}
    </div>
  );
}

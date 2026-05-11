"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { JOURNAL_GLASS_BORDER, JOURNAL_GLASS_PANEL_BASE } from "@/lib/self-awareness";
import {
  clearSelfCompassionWorkshop,
  defaultSelfCompassionWorkshop,
  loadSelfCompassionWorkshop,
  saveSelfCompassionWorkshop,
  type SelfCompassionWorkshopSnapshot,
} from "@/lib/self-compassion-storage";

/** Align with Seeking Feedback / Giving Feedback / Self Reflection body & fields */
const scBody = "text-[0.9375rem] leading-[1.75] text-slate-600 sm:text-[1rem]";
const scPrompt =
  "text-[0.95rem] font-semibold leading-snug text-slate-800 sm:text-[1rem]";
const scPartLabel =
  "mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-slate-500 sm:text-[0.7rem]";
const scTextarea =
  "mt-3 w-full resize-y rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-[0.9375rem] leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20";
const scChip =
  "rounded-full border border-slate-200/90 bg-white/70 px-3 py-1.5 text-[0.8125rem] font-medium text-slate-700 transition-colors hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-bvm-title/20";
const scBtnPrimary =
  "rounded-xl bg-bvm-title px-5 py-3 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-bvm-title/90 disabled:cursor-not-allowed disabled:opacity-40";
const scBtnSecondary =
  "rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-[0.9375rem] font-semibold text-slate-800 shadow-sm transition-colors hover:bg-white";

/** Tighter insets + wider text block vs default glass (align with Seeking Feedback content / rim ratio) */
const scCardInset = "px-4 py-6 sm:px-6 sm:py-7";

const scResetBtn =
  "shrink-0 rounded-lg px-2.5 py-1.5 text-[0.8125rem] font-semibold text-slate-500 transition-colors hover:bg-slate-100/80 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-bvm-title/25";

function snapshotFromState(
  step: number,
  isCompleted: boolean,
  showReview: boolean,
  q1Answer: string,
  q2Answer: string,
  q3Answer: string,
  q4Answer: string,
  q5Answer: string,
  blankAnswers: Record<string, string>,
  customModes: Record<string, boolean>,
  q8Choice: string | null,
  q9Choice: string | null,
  reallyChoice: string | null,
  q10Answer: string,
): SelfCompassionWorkshopSnapshot {
  return {
    step,
    isCompleted,
    showReview,
    q1Answer,
    q2Answer,
    q3Answer,
    q4Answer,
    q5Answer,
    blankAnswers: { ...blankAnswers },
    customModes: { ...customModes },
    q8Choice,
    q9Choice,
    reallyChoice,
    q10Answer,
  };
}

export default function SelfCompassion() {
  const [hydrated, setHydrated] = useState(false);

  const [step, setStep] = useState(1);
  const totalSteps = 8;

  // Check 
  const [isCompleted, setIsCompleted] = useState(false);

  // Review
  const [showReview, setShowReview] = useState(false);

  // Part 1: Q1 - Q5
  const [q1Answer, setQ1Answer] = useState('');
  const [q2Answer, setQ2Answer] = useState('');
  const [q3Answer, setQ3Answer] = useState('');
  const [q4Answer, setQ4Answer] = useState('');
  const [q5Answer, setQ5Answer] = useState('');

  // Part 2: Q6 / Q7
  const [blankAnswers, setBlankAnswers] = useState<Record<string, string>>({});
  const [customModes, setCustomModes] = useState<Record<string, boolean>>({});


  // Part 3: Q8 - Q10
  const [q8Choice, setQ8Choice] = useState<string | null>(null);
  const [q9Choice, setQ9Choice] = useState<string | null>(null);
  const [reallyChoice, setReallyChoice] = useState<string | null>(null);
  const [q10Answer, setQ10Answer] = useState("");

  // Q8 is negative and Q10 is true
  const [showFeedback, setShowFeedback] = useState(false);

  const applySnapshot = useCallback((s: SelfCompassionWorkshopSnapshot) => {
    setStep(s.step);
    setIsCompleted(s.isCompleted);
    setShowReview(s.showReview);
    setQ1Answer(s.q1Answer);
    setQ2Answer(s.q2Answer);
    setQ3Answer(s.q3Answer);
    setQ4Answer(s.q4Answer);
    setQ5Answer(s.q5Answer);
    setBlankAnswers(s.blankAnswers);
    setCustomModes(s.customModes);
    setQ8Choice(s.q8Choice);
    setQ9Choice(s.q9Choice);
    setReallyChoice(s.reallyChoice);
    setQ10Answer(s.q10Answer);
  }, []);

  useEffect(() => {
    const loaded = loadSelfCompassionWorkshop();
    if (loaded) applySnapshot(loaded);
    setHydrated(true);
  }, [applySnapshot]);

  useEffect(() => {
    if (!hydrated) return;
    saveSelfCompassionWorkshop(
      snapshotFromState(
        step,
        isCompleted,
        showReview,
        q1Answer,
        q2Answer,
        q3Answer,
        q4Answer,
        q5Answer,
        blankAnswers,
        customModes,
        q8Choice,
        q9Choice,
        reallyChoice,
        q10Answer,
      ),
    );
  }, [
    hydrated,
    step,
    isCompleted,
    showReview,
    q1Answer,
    q2Answer,
    q3Answer,
    q4Answer,
    q5Answer,
    blankAnswers,
    customModes,
    q8Choice,
    q9Choice,
    reallyChoice,
    q10Answer,
  ]);

  const resetEntireWorkshop = useCallback(() => {
    clearSelfCompassionWorkshop();
    applySnapshot(defaultSelfCompassionWorkshop());
  }, [applySnapshot]);

  // === 💡 Dictionary Q1-5 promptchips ===
  const promptChipsConfig = {
    1: ['Being a good listener', 'Never giving up',
      'Sense of humor', 'Positive attitude', 'Creativity', 'Honest'],

    2: ['Math/Science', 'Playing sports', 'Drawing / Art',
      'Making new friends', 'Solving puzzles',
      'Writing and reading', 'Leadership'],

    3: ['A musical instrument', 'A specific sport',
      'Improving my grades', 'Keeping healthy and beauty',
      'Controlling my temper', 'Public speaking'],

    4: ['Helping others', 'Organizing my stuff',
      'Learning new tech', 'Staying calm',
      'Making people laugh', 'Getting up early', 'being athletic'],

    5: ['Finishing a tough project', 'Standing up for someone',
      'Learning from a mistake', 'Trying something new',
      'Helping out at home', 'Volunteering in community']
  };

  const questionsConfig = {
    1: "What's something you like about yourself?",
    2: "What's something you feel you're good at?",
    3: "What's something you've worked hard to get good at?",
    4: "What's a skill or habit that comes easily to you?",
    5: "What's something you're proud of, even if it's something small or that others might not see?"
  };


  // text: script, select: options, input: text area
  const fillInBlanksConfig: Record<number, any> = {
    6: {
      title: "What's a quality you like about how you treat other people?",
      parts: [
        { type: 'text', content: '"When I interact with others, I really like that I am usually ' },
        { type: 'select', id: 'q6_emotion', options: ['Patient', 'Honest', 'A good listener', 'Helpful', 'Respectful'], placeholder: '...' },
        { type: 'text', content: ', especially when ' },
        { type: 'input', id: 'q6_action', placeholder: '...' },
        { type: 'text', content: '."' }
      ]
    },
    7: {
      title: "What do your friends, family, or teachers often notice you're good at?",
      parts: [
        { type: 'text', content: '"My ' },
        { type: 'select', id: 'q7_people', options: ['Parents / Family', 'Friends', 'Teachers', 'Coaches'], placeholder: '...' },
        { type: 'text', content: ' often notice that I am really good at ' },
        { type: 'select', id: 'q7_method', options: ['Working in a team', 'Solving problems', 'Staying focused', 'Being creative', 'Cheering people up'], placeholder: '...' },
        { type: 'text', content: ', especially ' },
        { type: 'input', id: 'q7_example', placeholder: '...' },
        { type: 'text', content: '."' }
      ]
    }
  };


  const handleChipClick = (chip: string) => {

    const toggleChip = (prev: string) => {
      if (prev.includes(chip)) {

        let newText = prev.replace(chip, "").trim();
        newText = newText.replace(/^,\s*|,\s*$/g, "").trim();
        newText = newText.replace(/,\s*,/g, ", ");
        return newText;
      }

      return prev ? `${prev}, ${chip}` : chip;
    };

    if (step === 1) setQ1Answer(toggleChip);
    else if (step === 2) setQ2Answer(toggleChip);
    else if (step === 3) setQ3Answer(toggleChip);
    else if (step === 4) setQ4Answer(toggleChip);
    else if (step === 5) setQ5Answer(toggleChip);
    else if (step === 9) setQ10Answer(toggleChip);
  };


  const getCurrentAnswer = () => {
    if (step === 1) return q1Answer;
    if (step === 2) return q2Answer;
    if (step === 3) return q3Answer;
    if (step === 4) return q4Answer;
    if (step === 5) return q5Answer;
    return '';
  };

  // save the current answer 
  const handleAnswerChange = (value: string) => {
    if (step === 1) setQ1Answer(value);
    if (step === 2) setQ2Answer(value);
    if (step === 3) setQ3Answer(value);
    if (step === 4) setQ4Answer(value);
    if (step === 5) setQ5Answer(value);
  };

  const handleBack = () => {
    // Part 3
    if (step === 8 && showFeedback) {
      setShowFeedback(false);
      return;
    }

    if (step === 8 && q8Choice !== null) {

      setQ8Choice(null);
      setQ9Choice(null);
      setReallyChoice(null);
      setQ10Answer('');

      return;

    }

    if (step > 1) {
      setStep(step - 1);
    }
  };


  // dynamic background and process bar color
  // change at the Q8

  /** Optional tint over the glass panel on Part 3 branches (still reads as frosted). */
  const getGlassTone = () => {
    if (step === 8 && q8Choice === "positive") return "bg-amber-50/50";
    if (step === 8 && q8Choice === "negative") return "bg-orange-50/50";
    return "";
  };


  const getProgressTheme = () => {
    if (step >= 8 && q8Choice === "positive") {
      return { active: "bg-amber-400/80", inactive: "bg-amber-100", current: "bg-amber-600" };
    }
    if (step >= 8 && q8Choice === "negative") {
      return { active: "bg-orange-400/80", inactive: "bg-orange-100", current: "bg-orange-600" };
    }
    return { active: "bg-bvm-title/50", inactive: "bg-slate-200", current: "bg-bvm-title" };
  };


  const isCurrentStepValid = () => {
    if (step >= 1 && step <= 5) return getCurrentAnswer().trim() !== '';
    if (step === 6 || step === 7) {

      const config = fillInBlanksConfig[step];
      const requiredBlanks = config.parts.filter((p: any) => p.type === 'select' || p.type === 'input');

      return requiredBlanks.every((b: any) => blankAnswers[b.id] && blankAnswers[b.id].trim() !== '');
    }

    if (step === 8) {
      // 🟢 Choice 1：If 'positive'，Users can directly go to the final page
      if (q8Choice === 'positive') return true;

      // 🔴 Choice 2：If 'negative'，Users should answer Q9 & Q10 and write a kind message
      if (q8Choice === 'negative') {
        const reachedQ10 = q9Choice === 'no_never' || reallyChoice !== null;
        return reachedQ10 && q10Answer.trim() !== '';
      }
      return false;
    }

    return true;
  };

  const progressTheme = getProgressTheme();

  if (isCompleted) {
    return (
      <div className="mx-auto flex max-w-[40rem] flex-col items-center px-5 pb-16 pt-8 sm:max-w-[42rem] sm:px-8 sm:pb-20 sm:pt-10">
        <section
          className={`w-full ${JOURNAL_GLASS_PANEL_BASE} ${JOURNAL_GLASS_BORDER.selfCompassion} ${scCardInset}`}
        >
          <div className="flex w-full items-center justify-end">
            <button
              type="button"
              className="text-[0.8125rem] text-slate-500 underline underline-offset-4"
              onClick={resetEntireWorkshop}
              aria-label="Reset Self Compassion workshop and clear saved answers"
            >
              Start Over
            </button>
          </div>
          <div className="w-full animate-fade-in-up text-center">
            <div className="mb-6 text-5xl sm:text-6xl" aria-hidden>
              ✨
            </div>
            <h2 className="font-display text-[1.125rem] font-semibold text-slate-900 sm:text-[1.25rem]">
              You did it!
            </h2>
            <p className={`mt-3 w-full ${scBody}`}>
              {
                "Thank you for taking the time to reflect. Remember, practicing self-compassion is a journey, and you've just taken a beautiful step forward."
              }
            </p>

            {/* --- Review --- */}
            {showReview && (
              <div className="mb-8 mt-8 max-h-[50vh] space-y-3 overflow-y-auto rounded-xl border border-slate-200/80 bg-white/50 p-5 text-left animate-fade-in">
                <h3 className="border-b border-slate-200/80 pb-2 font-display text-[0.95rem] font-semibold text-slate-800">
                  My Reflection Summary
                </h3>

                {q1Answer && (
                  <p className={scBody}>
                    <strong className="font-semibold text-slate-800">{"1. I like about myself:"}</strong> {q1Answer}
                  </p>
                )}
                {q2Answer && (
                  <p className={scBody}>
                    <strong className="font-semibold text-slate-800">{"2. I'm good at:"}</strong> {q2Answer}
                  </p>
                )}
                {q3Answer && (
                  <p className={scBody}>
                    <strong className="font-semibold text-slate-800">{"3. I worked hard on:"}</strong> {q3Answer}
                  </p>
                )}
                {q4Answer && (
                  <p className={scBody}>
                    <strong className="font-semibold text-slate-800">{"4. Comes easily to me:"}</strong> {q4Answer}
                  </p>
                )}
                {q5Answer && (
                  <p className={scBody}>
                    <strong className="font-semibold text-slate-800">{"5. I'm proud of:"}</strong> {q5Answer}
                  </p>
                )}

                {blankAnswers["q6_emotion"] && (
                  <p className={scBody}>
                    <strong className="font-semibold text-slate-800">6. How I treat others:</strong> {"I am usually"}{" "}
                    {blankAnswers["q6_emotion"]}, especially when {blankAnswers["q6_action"]}
                    {"."}
                  </p>
                )}
                {blankAnswers["q7_people"] && (
                  <p className={scBody}>
                    <strong className="font-semibold text-slate-800">{"7. Through others' eyes:"}</strong> {"My "}
                    {blankAnswers["q7_people"]} notice I am good at {blankAnswers["q7_method"]} {blankAnswers["q7_example"]}
                    {"."}
                  </p>
                )}

                {q8Choice && (
                  <p className={scBody}>
                    <strong className="font-semibold text-slate-800">8. Reaction to mistakes:</strong>{" "}
                    {q8Choice === "positive" ? "Just a silly mistake." : "I suck at this!"}
                  </p>
                )}
                {q10Answer && (
                  <p className={scBody}>
                    <strong className="font-semibold text-slate-800">Kinder message:</strong> {q10Answer}
                  </p>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => setShowReview(!showReview)}
                className="text-[0.9375rem] font-semibold text-bvm-title underline decoration-2 underline-offset-4 transition-colors hover:text-bvm-title/80"
              >
                {showReview ? "Hide my answers" : "Check my answers"}
              </button>

              <Link href="/#feedback" className={`${scBtnPrimary} inline-flex items-center gap-2 px-8`}>
                Go to next part <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[40rem] px-5 pb-16 pt-8 sm:max-w-[42rem] sm:px-8 sm:pb-20 sm:pt-10">
      <section
        className={`${JOURNAL_GLASS_PANEL_BASE} ${JOURNAL_GLASS_BORDER.selfCompassion} ${scCardInset} transition-colors duration-700 ${getGlassTone()}`}
      >
        {/* Top bar */}
        {/* <div className="flex w-full items-center justify-between gap-3 pt-0 mb-8">
          <button
            type="button"
            onClick={handleBack}
            className={`min-w-[4.5rem] text-left text-[0.875rem] font-medium transition-opacity ${step === 1 ?
              "pointer-events-none opacity-0" : "text-slate-500 hover:text-slate-800"
              }`}
          >
            ← Back
          </button>
        </div> */}


        {/* Main Body — section title lives on the page (outside this card), same as other blocks */}
        <div className="mt-2 flex w-full flex-col items-stretch">

          {/*  Part 1 : Discovering Me   */}
          {step >= 1 && step <= 5 && (
            <div className="w-full animate-fade-in">
              <span className={scPartLabel}>Part 1: Discover Me</span>
              <p className={`${scPrompt} mb-4`}>{questionsConfig[step as keyof typeof questionsConfig]}</p>
              <textarea
                className={`${scTextarea} min-h-[9rem]`}
                placeholder="Type your answer here..."
                value={getCurrentAnswer()}
                onChange={(e) => handleAnswerChange(e.target.value)}
                rows={5}
              />

              <div className="mt-6">
                <p className="mb-3 text-[0.8125rem] font-medium text-slate-600">Need some inspiration?</p>
                <div className="flex flex-wrap gap-2.5">
                  {promptChipsConfig[step as keyof typeof promptChipsConfig]?.map((chip) => {

                    const isSelected = getCurrentAnswer().includes(chip);

                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleChipClick(chip)}

                        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[0.875rem] font-medium transition-all ${isSelected
                          ? "border-[#7b8fd4] bg-[#7b8fd4]/10 text-[#5468b1] shadow-sm"
                          : "border-slate-200/90 bg-white/60 text-slate-600 hover:bg-white"
                          }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/*  Part 2 : Through Other's eyes  */}
          {(step === 6 || step === 7) && fillInBlanksConfig[step] && (
            <div className="w-full animate-fade-in">
              <span className={scPartLabel}>{"Part 2: Through Others' Eyes"}</span>
              <p className={`${scPrompt} mb-4`}>{fillInBlanksConfig[step].title}</p>

              <div
                className={`rounded-xl border border-slate-200/80 bg-white/50 p-5 text-[0.9375rem] leading-[2.25rem] text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:p-6 sm:leading-[2.5rem]`}
              >


                {fillInBlanksConfig[step].parts.map((part: any, index: number) => {


                  if (part.type === 'text') {
                    return <span key={index}>{part.content}</span>;
                  }

                  if (part.type === 'select') {
                    const val = blankAnswers[part.id] || '';
                    const isCustom = customModes[part.id];


                    if (isCustom) {
                      return (
                        <div key={index} className="inline-flex items-center mx-2 relative">
                          <input
                            type="text"
                            autoFocus
                            value={val}
                            placeholder="Type your own..."
                            onChange={(e) => setBlankAnswers({ ...blankAnswers, [part.id]: e.target.value })}
                            className="w-40 border-b-2 border-bvm-title/60 bg-transparent pb-[4px] leading-normal text-center text-[0.9375rem] font-medium text-slate-800 outline-none transition-colors focus:border-bvm-title pr-3"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              setCustomModes({ ...customModes, [part.id]: false });
                              setBlankAnswers({ ...blankAnswers, [part.id]: "" });
                            }}
                            className="absolute -right-1 -top-6 text-[0.8125rem] font-semibold text-slate-400 transition-colors hover:text-slate-700"
                            title="Back to options"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    }


                    return (
                      <div key={index} className="relative mx-2 inline-block">
                        <select
                          value={val}
                          onChange={(e) => {
                            if (e.target.value === "__CUSTOM__") {
                              setCustomModes({ ...customModes, [part.id]: true });
                              setBlankAnswers({ ...blankAnswers, [part.id]: "" });
                            } else {
                              setBlankAnswers({ ...blankAnswers, [part.id]: e.target.value });
                            }
                          }}
                          className={`w-auto cursor-pointer appearance-none border-b-2 bg-transparent pb-[4px] leading-normal pr-6 text-center text-[0.9375rem] font-semibold outline-none transition-colors focus:border-bvm-title ${val === ""
                            ? "border-dashed border-slate-300 text-slate-400"
                            : "border-solid border-bvm-title/70 text-slate-800"
                            }`}
                        >
                          <option value="" disabled>
                            {part.placeholder}
                          </option>
                          {part.options.map((opt: string) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}

                          <option value="__CUSTOM__">🖊 Write my own…</option>
                        </select>

                        <div className="pointer-events-none absolute bottom-0 right-0 top-0 flex items-center text-[0.75rem] text-slate-500">
                          ▼
                        </div>
                      </div>
                    );
                  }

                  // 3. if- text input (Input)
                  if (part.type === 'input') {
                    const val = blankAnswers[part.id] || '';
                    return (
                      <div key={index} className="mx-2 inline-block">
                        <input
                          type="text"
                          value={val}
                          placeholder={part.placeholder}
                          onChange={(e) => setBlankAnswers({ ...blankAnswers, [part.id]: e.target.value })}
                          className={`w-48 border-b-2 bg-transparent pb-[4px] leading-normal text-center text-[0.9375rem] font-semibold outline-none transition-colors focus:border-bvm-title ${val === ""
                            ? "border-dashed border-slate-300 text-slate-400 placeholder:text-slate-400"
                            : "border-solid border-bvm-title/70 text-slate-800"
                            }`}
                        />
                      </div>
                    );
                  }
                })}

              </div>
            </div>
          )}


          {/*  Part 3: Be Your Own Friend  */}
          {step === 8 && (
            <div className="relative flex w-full animate-fade-in flex-col items-center justify-center pb-6 pt-1">

              {!q8Choice && (
                <div className="w-full animate-fade-in-up">
                  <span className={scPartLabel}>Part 3: Be Your Own Friend</span>
                  <p className={`${scPrompt} mb-10 mt-1`}>
                    When you make a mistake, what do you usually say to yourself?
                  </p>
                  <div className="flex items-end justify-around gap-2">
                    <button
                      type="button"
                      className="flex flex-col items-center rounded-xl p-2 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-bvm-title/30"
                      onClick={() => setQ8Choice("negative")}
                    >
                      <span className="mb-3 text-6xl leading-none sm:text-7xl" aria-hidden>
                        😞
                      </span>
                      <span className="text-[0.875rem] font-semibold text-slate-700">I suck at this!</span>
                    </button>
                    <span className="mb-8 text-[0.8125rem] font-medium text-slate-500">Or</span>
                    <button
                      type="button"
                      className="flex flex-col items-center rounded-xl p-2 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-bvm-title/30"
                      onClick={() => setQ8Choice("positive")}
                    >
                      <span className="mb-3 text-6xl leading-none sm:text-7xl" aria-hidden>
                        🤪
                      </span>
                      <span className="text-[0.875rem] font-semibold text-slate-700">Just a silly mistake.</span>
                    </button>
                  </div>
                </div>
              )}

              {q8Choice === "positive" && (
                <div className="flex w-full flex-col items-center animate-fade-in-up">
                  <div className="mb-4 text-6xl sm:text-7xl" aria-hidden>
                    🌟
                  </div>
                  <p className={`w-full text-center ${scBody} text-slate-700`}>
                    {
                      "Not beating yourself up is exactly what Self-Compassion is all about. You're already treating yourself like a good friend."
                    }
                  </p>
                </div>
              )}

              {q8Choice === "negative" && !showFeedback && (
                <>
                  {!q9Choice && (
                    <div className="flex w-full flex-col items-center animate-fade-in-up">
                      <div className="mb-6 rounded-full border border-slate-200/80 bg-white/60 px-4 py-2 text-[0.8125rem] font-medium text-slate-600 shadow-sm">
                        {"You just said:"} <span className="italic">{"'I suck at this!'"}</span>
                      </div>
                      <p className={`${scPrompt} mb-8 text-center`}>Would you say that to a friend?</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        <button type="button" onClick={() => setQ9Choice("no_never")} className={scBtnSecondary}>
                          No, Never
                        </button>
                        <button type="button" onClick={() => setQ9Choice("yeah_probably")} className={scBtnSecondary}>
                          Yeah, probably 🤷
                        </button>
                      </div>
                    </div>
                  )}

                  {q9Choice === "yeah_probably" && !reallyChoice && (
                    <div className="flex w-full flex-col items-center animate-fade-in-up">
                      <p className={`${scPrompt} mb-8`}>Really?</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        <button type="button" onClick={() => setReallyChoice("no")} className={scBtnSecondary}>
                          No
                        </button>
                        <button
                          type="button"
                          onClick={() => setReallyChoice("yeah_hardcore")}
                          className={`${scBtnSecondary} text-orange-800 hover:border-orange-200 hover:bg-orange-50/80`}
                        >
                          {"Yeah, I'm hardcore"}
                        </button>
                      </div>
                    </div>
                  )}

                  {(q9Choice === "no_never" || reallyChoice !== null) && (
                    <div className="flex w-full flex-col items-center animate-fade-in-up">
                      {reallyChoice === "yeah_hardcore" && (
                        <div className="mb-6 w-full text-center">
                          <p className="inline-block rounded-xl border border-slate-200/80 bg-slate-100/90 px-4 py-3 text-[0.9375rem] font-medium text-slate-700">
                            Fair enough! Sometimes friends joke like that. But...
                          </p>
                        </div>
                      )}

                      <label className={`mb-3 block w-full text-left ${scPrompt}`}>
                        {"What's something you could say to yourself instead?"}
                      </label>
                      <textarea
                        className={`${scTextarea} min-h-[10rem]`}
                        placeholder="Type a kinder message..."
                        value={q10Answer}
                        onChange={(e) => setQ10Answer(e.target.value)}
                        rows={5}
                      />
                    </div>
                  )}
                </>
              )}

              {q8Choice === "negative" && showFeedback && (
                <div className="flex w-full flex-col items-center animate-fade-in-up">
                  <div className="mb-8 text-6xl sm:text-7xl" aria-hidden>
                    👍
                  </div>
                  <h3 className="mb-2 text-[1.125rem] font-semibold text-slate-800 text-center">
                    {"That's a beautiful way to reframe it!"}
                  </h3>
                  <p className={`w-full text-center ${scBody} text-slate-700`}>
                    {"Being your own friend takes practice, but you're doing great."}
                  </p>
                </div>
              )}

            </div>
          )}
        </div>



        {/* Process bar and  NEXT Button */}
        <div className="mt-8 w-full">
          <div className="flex items-center justify-between mb-4">

            {/* whole process monitor */}
            <div className="flex items-center gap-2 h-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                let barClasses = "rounded-full transition-all duration-500 ";
                if (step === num) barClasses += `h-3 w-10 ${progressTheme.current} shadow-sm`;
                else if (step > num) barClasses += `h-2 w-8 ${progressTheme.active}`;
                else barClasses += `h-2 w-4 ${progressTheme.inactive}`;

                return <div key={num} className={barClasses}></div>;
              })}
            </div>

            <div className="flex items-center gap-6">


              <button
                type="button"
                onClick={handleBack}

                className={`text-[0.8125rem] font-medium transition-all underline decoration-transparent hover:decoration-slate-300 underline-offset-4 ${step === 1 ? "pointer-events-none opacity-0" : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                ← Back
              </button>


              <button
                type="button"
                onClick={() => {
                  if (step === 8 && q8Choice === 'negative' && !showFeedback) {
                    setShowFeedback(true);
                  } else if (step < totalSteps) {
                    setStep(step + 1);
                  } else {
                    setIsCompleted(true);
                  }
                }}
                disabled={!isCurrentStepValid()}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[0.95rem] font-semibold text-white bg-bvm-title transition-all ${!isCurrentStepValid()
                    ? "cursor-not-allowed opacity-40"
                    : "shadow-sm hover:-translate-y-0.5 hover:bg-bvm-title/90 hover:shadow-md"
                  }`}
              >
                {(step === totalSteps && (q8Choice === 'positive' || showFeedback)) ? "Finish" : "Next"}
                {(step === totalSteps && (q8Choice === 'positive' || showFeedback)) ? <span aria-hidden>✨</span> : <span aria-hidden>≫</span>}
              </button>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

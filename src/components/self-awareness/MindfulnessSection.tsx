"use client";

import { useCallback, useEffect, useState } from "react";
import { useJournalStorage } from "@/hooks/useJournalStorage";
import {
  JOURNAL_COLLAPSE_BUTTON_CLASS,
  JOURNAL_GLASS_BORDER,
  JOURNAL_GLASS_PANEL_BASE,
  JOURNAL_ICON_BUTTON_CLASS,
  JOURNAL_PRIMARY_BUTTON_CLASS,
  JOURNAL_RECORD_CARD_CLASS,
  JOURNAL_RECORDS_SHELL_CLASS,
  JOURNAL_SUBHEADING_CLASS,
  newMindfulnessPracticeId,
  type MindfulnessSessionRecord,
} from "@/lib/self-awareness";

type Props = { headingId: string };

const exercises = [
  {
    id: 1,
    title: "Posture Check",
    category: "Body",
    duration: 1,
    description: "Sit up straight, relax your shoulders, and take three deep breaths.",
    steps: [
      "Sit up straight in your chair",
      "Roll your shoulders back and down",
      "Relax any tension in your neck",
      "Take a deep breath in",
      "Exhale slowly and repeat 3 times",
    ],
    emoji: "🧍",
  },
  {
    id: 2,
    title: "Tracing",
    category: "Focus",
    duration: 2,
    description:
      "Trace your hand with your finger slowly, breathing in as you trace up and out as you trace down.",
    steps: [
      "Hold one hand in front of you",
      "Use your other finger to trace your thumb",
      "Breathe in as you trace up",
      "Breathe out as you trace down",
      "Continue for all five fingers",
    ],
    emoji: "✋",
  },
  {
    id: 3,
    title: "Balance Exercise",
    category: "Movement",
    duration: 1,
    description: "Stand on one leg for 20 seconds, then switch legs. Focus on staying steady.",
    steps: [
      "Stand up straight with feet together",
      "Lift one foot off the ground",
      "Balance on one leg for 20 seconds",
      "Focus on a fixed point to stay steady",
      "Switch to the other leg and repeat",
    ],
    emoji: "🦶",
  },
  {
    id: 4,
    title: "Mindful Eating",
    category: "Awareness",
    duration: 3,
    description: "Eat a small piece of food slowly, focusing on taste and texture.",
    steps: [
      "Choose a small piece of food",
      "Look at it closely and notice colours and shapes",
      "Take a small bite",
      "Chew slowly, focusing on the taste",
      "Notice the texture as you eat",
    ],
    emoji: "🍎",
  },
  {
    id: 5,
    title: "Colour Exploration",
    category: "Observation",
    duration: 2,
    description: "Look around and find three things of a specific colour.",
    steps: [
      "Choose a colour to focus on",
      "Look around your space",
      "Find the first object of that colour",
      "Find a second object",
      "Find a third object and notice details about each",
    ],
    emoji: "🎨",
  },
  {
    id: 6,
    title: "Deep Breathing",
    category: "Breathing",
    duration: 2,
    description: "Inhale for 4 seconds, hold for 4 seconds, exhale for 6 seconds. Repeat 3 times.",
    steps: [
      "Sit comfortably and relax",
      "Breathe in for 4 seconds",
      "Hold your breath for 4 seconds",
      "Breathe out slowly for 6 seconds",
      "Repeat this cycle 3 times",
    ],
    emoji: "🌬️",
  },
  {
    id: 7,
    title: "Mindful Smiling",
    category: "Emotional",
    duration: 1,
    description: "Smile for at least 10 seconds and notice how it makes you feel.",
    steps: [
      "Relax your face muscles",
      "Gently smile",
      "Hold the smile for 10 seconds",
      "Notice any changes in your mood",
      "Let the feeling stay with you",
    ],
    emoji: "😊",
  },
  {
    id: 8,
    title: "Observation",
    category: "Awareness",
    duration: 1,
    description: "Spend one minute noticing your surroundings. What do you see, hear, and feel?",
    steps: [
      "Stop what you are doing",
      "Look around and notice what you see",
      "Listen carefully and notice what you hear",
      "Notice your body and what you feel",
      "Take it all in for one full minute",
    ],
    emoji: "👀",
  },
  {
    id: 9,
    title: "Listening",
    category: "Focus",
    duration: 1,
    description: "Close your eyes and focus on all the sounds you can hear for one minute.",
    steps: [
      "Close your eyes gently",
      "Take a deep breath",
      "Listen for sounds close to you",
      "Listen for sounds far away",
      "Notice sounds you had not heard before",
    ],
    emoji: "👂",
  },
  {
    id: 10,
    title: "Positive Affirmation",
    category: "Mental",
    duration: 1,
    description: 'Say, "I am calm and at peace." Repeat 5 times.',
    steps: [
      "Take a deep breath and relax",
      'Say: "I am calm and at peace"',
      "Repeat it a second time",
      "Repeat it a third, fourth, and fifth time",
      "Feel the words within you",
    ],
    emoji: "✨",
  },
];

const reflectionPrompts = [
  "I felt calm",
  "It was challenging",
  "I want to try again",
  "I felt distracted",
  "It helped me focus",
  "I feel refreshed",
];

type Exercise = (typeof exercises)[number];

function ExerciseTitle({ title }: { title: string }) {
  const words = title.trim().split(/\s+/);
  if (words.length === 2) {
    return (
      <>
        <span className="block">{words[0]}</span>
        <span className="block">{words[1]}</span>
      </>
    );
  }
  return title;
}

function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function IconTrash() {
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

function ExerciseCard({
  exercise,
  isActive,
  onSelect,
  onComplete,
}: {
  exercise: Exercise;
  isActive: boolean;
  onSelect: () => void;
  onComplete: (exercise: Exercise, durationSeconds: number) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercise.duration * 60);
  const [currentStep, setCurrentStep] = useState(0);

  const totalTime = exercise.duration * 60;
  const elapsedSeconds = totalTime - timeLeft;
  const progressPercent = (elapsedSeconds / totalTime) * 100;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeLeft]);

  const resetTimer = () => {
    setTimeLeft(totalTime);
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleMarkDone = () => {
    const recordedSeconds = Math.max(0, elapsedSeconds);
    onComplete(exercise, recordedSeconds);
    resetTimer();
  };

  if (!isActive) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="flex min-h-[4.75rem] w-full flex-col items-center justify-center rounded-2xl border border-bvm-border bg-white/80 px-1.5 py-2 text-center shadow-[0_8px_18px_-16px_rgba(5,43,99,0.42),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all hover:-translate-y-0.5 hover:border-bvm-borderStrong hover:bg-white hover:shadow-[0_14px_24px_-18px_rgba(5,43,99,0.42)]"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-bvm-softBlue text-lg shadow-sm sm:h-9 sm:w-9 sm:text-xl">
          {exercise.emoji}
        </div>
        <h3 className="mt-2 line-clamp-2 text-[0.58rem] font-semibold leading-tight text-bvm-fg sm:text-[0.68rem]">
          <ExerciseTitle title={exercise.title} />
        </h3>
        <span className="mt-0.5 text-[0.55rem] font-medium text-bvm-muted sm:text-[0.62rem]">
          {exercise.duration} min
        </span>
      </button>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-bvm-border bg-white/85 shadow-[0_14px_34px_-26px_rgba(5,43,99,0.3)]">
      <div className="border-b border-bvm-border bg-bvm-softBlue/45 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
              {exercise.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[1rem] font-semibold text-bvm-fg">{exercise.title}</h3>
              <p className="mt-1 text-sm leading-6 text-bvm-muted">{exercise.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              onSelect();
            }}
            className="rounded-lg p-2 text-bvm-muted transition-colors hover:bg-white/80 hover:text-bvm-title focus:outline-none focus:ring-2 focus:ring-bvm-action/20"
            aria-label="Close exercise"
          >
            ×
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-bvm-muted">Timer</span>
            <span className="font-semibold tabular-nums text-bvm-fg">{formatDuration(timeLeft)}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-bvm-softBlue">
            <div
              className="h-full rounded-full bg-bvm-action transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={resetTimer}
            className="rounded-xl border border-bvm-border bg-white/80 px-4 py-2 text-sm font-medium text-bvm-fg transition-colors hover:bg-white"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            className="rounded-xl bg-bvm-title px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(5,43,99,0.18)] transition-all hover:-translate-y-0.5 hover:bg-bvm-accent"
          >
            {isPlaying ? "Pause" : "Start"}
          </button>

          <button
            type="button"
            onClick={handleMarkDone}
            className="rounded-xl border border-bvm-borderStrong bg-white/80 px-4 py-2 text-sm font-semibold text-bvm-title transition-colors hover:bg-white"
          >
            Mark Done
          </button>
        </div>

        <div className="rounded-2xl border border-bvm-border bg-bvm-softBlue/35 p-4">
          <h4 className="mb-3 text-[1rem] font-semibold text-bvm-fg">Steps to Follow</h4>
          <div className="space-y-2">
            {exercise.steps.map((step, index) => (
              <button
                key={step}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors ${
                  currentStep === index
                    ? "bg-bvm-title text-white shadow-[0_8px_18px_-12px_rgba(5,43,99,0.45)]"
                    : "bg-white/80 text-bvm-fg hover:bg-white"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    currentStep === index
                      ? "bg-white text-bvm-title"
                      : "bg-bvm-softBlue text-bvm-muted"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-sm leading-6">{step}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function appendPrompt(current: string, prompt: string): string {
  const parts = current
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.some((part) => part.toLowerCase() === prompt.toLowerCase())) return current;
  return [...parts, prompt].join(", ");
}

function MindfulnessSessionCard({
  session,
  isEditing,
  hasActiveEdit,
  onEditToggle,
  onDeleteSession,
  onSubmitSession,
  onDateChange,
  onSessionFeelChange,
  onPracticeDelete,
}: {
  session: MindfulnessSessionRecord;
  isEditing: boolean;
  hasActiveEdit: boolean;
  onEditToggle: () => void;
  onDeleteSession: () => void;
  onSubmitSession: () => void;
  onDateChange: (practiceDate: string) => void;
  onSessionFeelChange: (feelText: string) => void;
  onPracticeDelete: (practiceId: string) => void;
}) {
  const isEditable = isEditing || (!session.submitted && !hasActiveEdit);
  const totalDurationSeconds = session.practices.reduce(
    (total, practice) => total + practice.durationSeconds,
    0,
  );

  return (
    <article
      className={`${JOURNAL_RECORD_CARD_CLASS} ${
        session.submitted ? "ring-1 ring-bvm-borderStrong/55" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-[1rem] font-semibold text-bvm-fg">{session.label}</h4>
          <p className="mt-1 text-[0.72rem] font-medium text-bvm-muted">
            Total practice time: {formatDuration(totalDurationSeconds)}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <label
              htmlFor={`${session.id}-practice-date`}
              className="text-[0.65rem] font-medium text-bvm-muted"
            >
              Practice date
            </label>
            <input
              id={`${session.id}-practice-date`}
              type="date"
              value={session.practiceDate}
              onChange={(e) => onDateChange(e.target.value)}
              readOnly={!isEditable}
              aria-readonly={!isEditable}
              className="rounded-md border border-bvm-border bg-white px-2 py-1 text-[0.68rem] font-medium text-bvm-fg focus:border-bvm-action focus:outline-none focus:ring-2 focus:ring-bvm-action/15"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {session.submitted ? (
            <button
              type="button"
              onClick={onEditToggle}
              className={JOURNAL_COLLAPSE_BUTTON_CLASS}
            >
              {isEditing ? "Done Editing" : "Edit"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmitSession}
              disabled={session.practices.length === 0 || !isEditable}
              className={`${JOURNAL_PRIMARY_BUTTON_CLASS} px-3 py-1.5 text-[0.72rem]`}
            >
              Submit
            </button>
          )}
          <button
            type="button"
            onClick={onDeleteSession}
            className={JOURNAL_ICON_BUTTON_CLASS}
            aria-label={`Delete ${session.label}`}
          >
            <IconTrash />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {session.practices.map((practice, index) => (
          <div
            key={practice.id}
            className="rounded-xl border border-bvm-border bg-bvm-softBlue/35 px-3 py-2.5"
          >
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-lg shadow-sm">
                {practice.exerciseEmoji || "•"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.8rem] font-semibold text-bvm-fg" title={practice.exerciseTitle}>
                  {practice.exerciseTitle}
                </p>
                <p className="mt-1 text-[0.72rem] text-bvm-muted">
                  {formatDuration(practice.durationSeconds)}
                </p>
              </div>
              {isEditable ? (
                <button
                  type="button"
                  onClick={() => onPracticeDelete(practice.id)}
                  className={`${JOURNAL_ICON_BUTTON_CLASS} shrink-0 p-1.5 hover:bg-white`}
                  aria-label={`Delete exercise ${index + 1}`}
                >
                  <IconTrash />
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label
          htmlFor={`${session.id}-feel`}
          className="mb-2 block text-[0.72rem] font-semibold text-bvm-fg"
        >
          How did this practice make you feel?
        </label>
        {isEditable ? (
          <>
            <input
              id={`${session.id}-feel`}
              type="text"
              value={session.feelText}
              onChange={(e) => onSessionFeelChange(e.target.value)}
              placeholder="Type how the whole practice felt, or choose a prompt below"
              className="w-full rounded-xl border border-bvm-border bg-white px-4 py-3 text-[0.9375rem] text-bvm-fg placeholder:text-bvm-muted/70 focus:border-bvm-action focus:outline-none focus:ring-2 focus:ring-bvm-action/20"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {reflectionPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onSessionFeelChange(appendPrompt(session.feelText, prompt))}
                  className="rounded-full border border-bvm-border bg-white/80 px-3 py-1.5 text-[0.72rem] font-medium text-bvm-muted transition-colors hover:border-bvm-borderStrong hover:bg-white hover:text-bvm-title"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="rounded-xl border border-bvm-border bg-bvm-softBlue/35 px-4 py-3 text-[0.9rem] text-bvm-muted">
            {session.feelText.trim() || "No feeling added"}
          </p>
        )}
      </div>
    </article>
  );
}

export function MindfulnessSection({ headingId }: Props) {
  const {
    state,
    addMindfulnessPractice,
    updateMindfulnessSessionFeel,
    removeMindfulnessPractice,
    removeMindfulnessSession,
    setMindfulnessSessionDate,
    submitMindfulnessSession,
  } = useJournalStorage();
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [practiceRecordsOpen, setPracticeRecordsOpen] = useState(true);

  useEffect(() => {
    if (state.mindfulnessSessions.length === 0) {
      setEditingSessionId(null);
    }
  }, [state.mindfulnessSessions.length]);

  const handleComplete = useCallback(
    (exercise: Exercise, durationSeconds: number) => {
      addMindfulnessPractice(
        {
          id: newMindfulnessPracticeId(),
          exerciseId: exercise.id,
          exerciseTitle: exercise.title,
          exerciseEmoji: exercise.emoji,
          durationSeconds,
        },
        editingSessionId ?? undefined,
      );
      setActiveExercise(null);
    },
    [addMindfulnessPractice, editingSessionId],
  );

  return (
    <div className="mx-auto max-w-[40rem] px-5 pb-16 pt-8 sm:max-w-[42rem] sm:px-8 sm:pb-20 sm:pt-10">
      <section
        className={`relative ${JOURNAL_GLASS_PANEL_BASE} ${JOURNAL_GLASS_BORDER.mindfulness} space-y-10`}
        aria-labelledby={headingId}
      >
        <section aria-labelledby="mindfulness-exercises-heading">
          <h3
            id="mindfulness-exercises-heading"
            className="font-display text-center text-[1.25rem] font-semibold tracking-[0.04em] text-bvm-title sm:text-[1.375rem]"
          >
            10+ MINI MINDFULNESS EXERCISES
          </h3>

          <p className="mt-5 text-sm leading-7 text-bvm-muted sm:text-base">
            Try these quick exercises to practice being present. Each one takes just a few minutes and
            helps build focus, calm, and self-awareness.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
            {exercises.map((exercise) => {
              const isActive = activeExercise === exercise.id;
              const gridClass = isActive ? "col-span-2 sm:col-span-5" : "col-span-1";

              return (
                <div key={exercise.id} className={gridClass}>
                  <ExerciseCard
                    exercise={exercise}
                    isActive={isActive}
                    onSelect={() =>
                      setActiveExercise((prev) => (prev === exercise.id ? null : exercise.id))
                    }
                    onComplete={handleComplete}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="mindfulness-reflection-heading">
          <div className="flex items-center justify-between gap-3">
            <h3 id="mindfulness-reflection-heading" className={JOURNAL_SUBHEADING_CLASS}>
              MY MINDFULNESS PRACTICE RECORDS
            </h3>
            {state.mindfulnessSessions.length > 0 ? (
              <button
                type="button"
                className={JOURNAL_COLLAPSE_BUTTON_CLASS}
                aria-expanded={practiceRecordsOpen}
                onClick={() => setPracticeRecordsOpen((open) => !open)}
              >
                {practiceRecordsOpen ? "Collapse" : "Expand"}
              </button>
            ) : null}
          </div>

          {state.mindfulnessSessions.length === 0 ? (
            <div className={`${JOURNAL_RECORDS_SHELL_CLASS} px-4 py-8`}>
              <p className="text-center text-[0.9rem] leading-relaxed text-bvm-muted">
                Complete an exercise to start a mindfulness practice record.
              </p>
            </div>
          ) : !practiceRecordsOpen ? (
            <div className={JOURNAL_RECORDS_SHELL_CLASS}>
              <p className="text-[0.85rem] text-bvm-muted">
                {state.mindfulnessSessions.length} mindfulness practice record
                {state.mindfulnessSessions.length === 1 ? "" : "s"} collapsed.
              </p>
            </div>
          ) : (
            <div className={`${JOURNAL_RECORDS_SHELL_CLASS} space-y-4`}>
              {state.mindfulnessSessions.map((session) => (
                <MindfulnessSessionCard
                  key={session.id}
                  session={session}
                  isEditing={editingSessionId === session.id}
                  hasActiveEdit={editingSessionId != null}
                  onEditToggle={() =>
                    setEditingSessionId((current) => (current === session.id ? null : session.id))
                  }
                  onDeleteSession={() => removeMindfulnessSession(session.id)}
                  onSubmitSession={() => {
                    submitMindfulnessSession(session.id);
                    setEditingSessionId(null);
                  }}
                  onDateChange={(practiceDate) => setMindfulnessSessionDate(session.id, practiceDate)}
                  onSessionFeelChange={(feelText) =>
                    updateMindfulnessSessionFeel(session.id, feelText)
                  }
                  onPracticeDelete={removeMindfulnessPractice}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

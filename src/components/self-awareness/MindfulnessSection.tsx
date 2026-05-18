"use client";

import { useEffect, useState } from "react";

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
    accent: "from-emerald-100 to-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
    progress: "bg-emerald-500",
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
    accent: "from-blue-100 to-blue-50",
    badge: "bg-blue-100 text-blue-700",
    progress: "bg-blue-500",
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
    accent: "from-amber-100 to-amber-50",
    badge: "bg-amber-100 text-amber-700",
    progress: "bg-amber-500",
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
    accent: "from-rose-100 to-rose-50",
    badge: "bg-rose-100 text-rose-700",
    progress: "bg-rose-500",
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
    accent: "from-purple-100 to-purple-50",
    badge: "bg-purple-100 text-purple-700",
    progress: "bg-purple-500",
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
    accent: "from-sky-100 to-sky-50",
    badge: "bg-sky-100 text-sky-700",
    progress: "bg-sky-500",
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
    accent: "from-pink-100 to-pink-50",
    badge: "bg-pink-100 text-pink-700",
    progress: "bg-pink-500",
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
    accent: "from-green-100 to-green-50",
    badge: "bg-green-100 text-green-700",
    progress: "bg-green-500",
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
    accent: "from-orange-100 to-orange-50",
    badge: "bg-orange-100 text-orange-700",
    progress: "bg-orange-500",
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
    accent: "from-indigo-100 to-indigo-50",
    badge: "bg-indigo-100 text-indigo-700",
    progress: "bg-indigo-500",
  },
];

function ExerciseCard({
  exercise,
  isActive,
  onSelect,
  isCompleted,
  onComplete,
}: {
  exercise: (typeof exercises)[0];
  isActive: boolean;
  onSelect: () => void;
  isCompleted: boolean;
  onComplete: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercise.duration * 60);
  const [currentStep, setCurrentStep] = useState(0);

  const totalTime = exercise.duration * 60;
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setTimeLeft(exercise.duration * 60);
    setIsPlaying(false);
    setCurrentStep(0);
  };

  if (!isActive) {
    return (
      <button
        type="button"
        onClick={onSelect}
        // Changed to a vertical layout (flex-col) to look like an app icon
        className={`w-full h-full flex flex-col items-center justify-center rounded-[2rem] border p-4 text-center transition duration-200 ${
          isCompleted
            ? "border-green-200 bg-green-50"
            : "border-slate-100 bg-white hover:-translate-y-1 hover:shadow-md"
        }`}
      >
        <div
          className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-2xl sm:text-3xl mb-3 shadow-sm"
        >
          {isCompleted ? "✅" : exercise.emoji}
        </div>
        
        <h3 className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-tight">
          {exercise.title}
        </h3>
        
        <span className="mt-1 text-[10px] sm:text-xs text-slate-500 font-medium">
          {exercise.duration} min
        </span>
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm w-full">
      <div className="bg-slate-50 border-b border-slate-100 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
            {exercise.emoji}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900">{exercise.title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-700">{exercise.description}</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Timer</span>
            <span className="font-semibold text-slate-900">{formatTime(timeLeft)}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${exercise.progress} transition-all duration-1000`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={resetTimer}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {isPlaying ? "Pause" : "Start"}
          </button>

          <button
            type="button"
            onClick={() => {
              onComplete();
              setIsPlaying(false);
              onSelect();
            }}
            className="rounded-full border border-green-300 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
          >
            Mark Done
          </button>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <h4 className="mb-3 font-semibold text-slate-900">Steps to Follow</h4>
          <div className="space-y-2">
            {exercise.steps.map((step, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                  currentStep === index
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-800 hover:bg-slate-100"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    currentStep === index
                      ? "bg-white text-slate-900"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-sm leading-6">{step}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            onSelect();
          }}
          className="mt-4 w-full rounded-2xl py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function MindfulnessSection({ headingId }: Props) {
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [reflection, setReflection] = useState("");
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [favoriteExercise, setFavoriteExercise] = useState("");

  const reflectionPrompts = [
    "I felt calm",
    "It was challenging",
    "I want to try again",
    "I felt distracted",
    "It helped me focus",
    "I feel refreshed",
  ];

  const handleComplete = (id: number) => {
    setCompletedExercises((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const progressPercent = (completedExercises.length / exercises.length) * 100;

  return (
    <div className="relative z-10 mx-auto max-w-2xl px-4 py-12 pointer-events-auto">
      
      {/* Centered Heading */}
      <div className="mb-8 text-center">
        <h2 id={headingId} className="text-xl sm:text-2xl font-bold tracking-widest text-[#3a648b] uppercase font-carmensin">
          10+ MINI MINDFULNESS EXERCISES
        </h2>
      </div>

      {/* Main unified card wrapper */}
      <div className="rounded-[2rem] border border-blue-50/50 bg-white/95 p-6 sm:p-10 shadow-sm space-y-12">
        
        <section aria-labelledby={headingId}>
          <p className="mb-6 text-sm leading-7 text-slate-600 sm:text-base text-center">
            Tap an exercise to practice being present. Each one takes just a few minutes and
            helps build focus, calm, and self-awareness.
          </p>

          <div className="mb-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Your Progress</span>
              <span className="text-sm text-slate-600">
                {completedExercises.length} of {exercises.length} completed
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* This is the grid container! It perfectly balances 3 items per row */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {exercises.map((exercise, index) => {
              const isActive = activeExercise === exercise.id;
              
              // Smart Grid Logic:
              // - If active, take up the full width (col-span-3)
              // - If it's the 10th item (index 9) AND no item is currently active, push it to the middle column (col-start-2)
              // - Otherwise, just act like a normal grid item (col-span-1)
              let gridClass = "col-span-1";
              if (isActive) {
                gridClass = "col-span-3";
              } else if (index === 9 && activeExercise === null) {
                gridClass = "col-span-1 col-start-2";
              }

              return (
                <div key={exercise.id} className={gridClass}>
                  <ExerciseCard
                    exercise={exercise}
                    isActive={isActive}
                    onSelect={() =>
                      setActiveExercise((prev) => (prev === exercise.id ? null : exercise.id))
                    }
                    isCompleted={completedExercises.includes(exercise.id)}
                    onComplete={() => handleComplete(exercise.id)}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <hr className="border-slate-100" />

        <section>
          <h3 className="mb-4 text-xl font-medium text-[#3a648b] font-carmensin">Mindfulness Reflection</h3>
          <p className="mb-6 text-sm leading-7 text-slate-600">
            After trying an exercise, take a moment to reflect on how it felt.
          </p>

          <div className="space-y-6 rounded-3xl bg-slate-50 p-6">
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-900">
                How did the exercise make you feel?
              </label>
              <p className="mb-3 text-xs text-slate-500">Select all that apply:</p>

              <div className="flex flex-wrap gap-2">
                {reflectionPrompts.map((prompt) => {
                  const selected = selectedPrompts.includes(prompt);

                  return (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() =>
                        setSelectedPrompts((prev) =>
                          prev.includes(prompt)
                            ? prev.filter((p) => p !== prompt)
                            : [...prev, prompt]
                        )
                      }
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        selected
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {prompt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-900">
                Write about your experience:
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What did you notice during the exercise? How do you feel now compared to before?"
                className="min-h-[130px] w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 outline-none transition focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-900">
                Which exercise would you like to practice daily?
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {exercises.slice(0, 6).map((exercise) => {
                  const selected = favoriteExercise === exercise.title;

                  return (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => setFavoriteExercise(exercise.title)}
                      className={`flex items-center gap-3 rounded-2xl p-3 text-left transition ${
                        selected
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-800 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-lg">{exercise.emoji}</span>
                      <span className="truncate text-xs font-medium">{exercise.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
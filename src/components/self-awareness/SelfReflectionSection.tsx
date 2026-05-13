"use client";

import { useCallback, useEffect, useState } from "react";
import { useJournalStorage } from "@/hooks/useJournalStorage";
import {
  isMeasureRatingComplete,
  isPresetWordLabel,
  JOURNAL_GLASS_BORDER,
  JOURNAL_GLASS_PANEL_BASE,
  legacyWordChoiceToLabel,
  MAX_REFLECTION_WORDS,
  newReflectionMeasureId,
  normalizeCustomWordPool,
  normalizeWordTokens,
  WORD_PRESET_LABELS,
  type SelfReflectionMeasure,
  type SelfReflectionScale,
} from "@/lib/self-awareness";

type Props = {
  headingId: string;
};

const SCALE_ROW: { id: SelfReflectionScale; label: string; hint: string }[] = [
  { id: "numbers", label: "Numbers", hint: "1 – 10" },
  { id: "words", label: "Words", hint: "Presets & custom" },
  { id: "emojis", label: "Emojis", hint: "Mood" },
];

const EMOJI_OPTIONS: { label: string }[] = [
  { label: "Low" },
  { label: "Okay" },
  { label: "Good" },
  { label: "Great" },
];

const ROW_TRACK_BG = [
  "bg-sky-200/85",
  "bg-purple-200/80",
  "bg-indigo-300/75",
] as const;

const moodStroke = "#2B6A9E";

function MoodFace({ mood, className = "h-12 w-12" }: { mood: 0 | 1 | 2 | 3; className?: string }) {
  const mouth =
    mood === 0 ? (
      <path
        d="M 16 30 Q 24 24 32 30"
        fill="none"
        stroke={moodStroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    ) : mood === 1 ? (
      <path d="M 17 30 H 31" stroke={moodStroke} strokeWidth="2" strokeLinecap="round" />
    ) : mood === 2 ? (
      <path
        d="M 16 28 Q 24 34 32 28"
        fill="none"
        stroke={moodStroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    ) : (
      <path
        d="M 14 26 Q 24 38 34 26"
        fill="none"
        stroke={moodStroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    );

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="17" fill="none" stroke={moodStroke} strokeWidth="2" />
      <circle cx="17" cy="20" r="2.2" fill={moodStroke} />
      <circle cx="31" cy="20" r="2.2" fill={moodStroke} />
      {mouth}
    </svg>
  );
}

function CelebrationBurst() {
  return (
    <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16" aria-hidden>
      <span className="absolute left-0 top-1 text-[1.8rem] motion-safe:animate-journal-celebrate-pop sm:text-[2rem]">
        🎉
      </span>
      <span
        className="absolute right-1 top-0 h-2.5 w-2.5 rounded-full bg-sky-400/80 motion-safe:animate-journal-confetti-float"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="absolute right-5 top-2 h-2 w-2 rounded-full bg-teal-400/80 motion-safe:animate-journal-confetti-float"
        style={{ animationDelay: "180ms" }}
      />
      <span
        className="absolute bottom-2 left-5 h-2.5 w-2.5 rounded-full bg-amber-300/90 motion-safe:animate-journal-confetti-float"
        style={{ animationDelay: "360ms" }}
      />
    </div>
  );
}

function RatingSlider({
  value,
  onChange,
  min = 1,
  max = 10,
  dense,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  dense?: boolean;
}) {
  return (
    <div className={dense ? "pt-0.5" : "pt-2"}>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`bvm-slider w-full cursor-pointer appearance-none rounded-full bg-white/50 accent-bvm-title ${dense ? "h-1.5" : "h-2"}`}
        aria-label="Rating slider"
      />
      {!dense ? (
        <div className="mt-1 flex justify-between px-0.5 text-[0.65rem] font-medium text-slate-600">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      ) : (
        <div className="mt-0.5 text-center text-[0.65rem] font-semibold text-bvm-title">{value}</div>
      )}
    </div>
  );
}

function IconTrash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M2 2l6 6M8 2 2 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function scaleDisplayName(s: SelfReflectionScale): string {
  if (s === "numbers") return "Numbers (1 – 10)";
  if (s === "words") return "Words (presets & custom)";
  return "Emojis (mood)";
}

function ReflectionWordsEditor({
  tokens,
  customPool,
  onTokensChange,
  onCustomPoolChange,
  onCustomWordRemove,
  compact,
}: {
  tokens: string[];
  customPool: string[];
  onTokensChange: (next: string[]) => void;
  onCustomPoolChange: (next: string[]) => void;
  onCustomWordRemove: (word: string) => void;
  compact?: boolean;
}) {
  const [customDraft, setCustomDraft] = useState("");
  const [presetsOpen, setPresetsOpen] = useState(true);

  const count = tokens.length;
  const max = MAX_REFLECTION_WORDS;

  const toggle = (label: string) => {
    const lower = label.toLowerCase();
    const idx = tokens.findIndex((t) => t.toLowerCase() === lower);
    if (idx >= 0) {
      onTokensChange(tokens.filter((_, i) => i !== idx));
    } else if (tokens.length < max) {
      onTokensChange([...tokens, label]);
    }
  };

  const addCustom = () => {
    const t = customDraft.trim();
    if (!t) return;
    if (isPresetWordLabel(t)) {
      setCustomDraft("");
      return;
    }
    if (customPool.some((x) => x.toLowerCase() === t.toLowerCase())) {
      setCustomDraft("");
      return;
    }
    onCustomPoolChange(normalizeCustomWordPool([...customPool, t]));
    setCustomDraft("");
  };

  const trimmedDraft = customDraft.trim();
  const addDisabled =
    !trimmedDraft ||
    isPresetWordLabel(trimmedDraft) ||
    customPool.some((x) => x.toLowerCase() === trimmedDraft.toLowerCase());

  const pillClass = (selected: boolean) =>
    [
      compact ? "px-2 py-1 text-[0.62rem] sm:text-[0.65rem]" : "px-3 py-2 text-[0.78rem] sm:text-[0.85rem]",
      "rounded-full border font-medium leading-tight transition-colors",
      selected
        ? "border-bvm-title bg-white text-bvm-title shadow-sm ring-1 ring-bvm-title/20"
        : "border-[#c9c4e8] bg-white/90 text-[#5a4d8a] hover:bg-white",
    ].join(" ");

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex items-center justify-between gap-2">
        <span
          className={
            compact
              ? "text-[0.65rem] font-semibold text-slate-800 sm:text-[0.7rem]"
              : "text-[0.85rem] font-semibold text-slate-800 sm:text-[0.88rem]"
          }
        >
          Select Words (max {max})
        </span>
        <span className="text-[0.72rem] font-medium text-slate-500 sm:text-[0.78rem]">
          {count}/{max}
        </span>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setPresetsOpen((o) => !o)}
          aria-expanded={presetsOpen}
          className="flex w-full items-center justify-between gap-2 text-left text-[0.72rem] font-semibold text-slate-700 sm:text-[0.8rem]"
        >
          <span>Preset &amp; your words</span>
          <span className="shrink-0 text-slate-400" aria-hidden>
            {presetsOpen ? "▾" : "▸"}
          </span>
        </button>
        {presetsOpen && (
          <div className={`mt-2 flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}>
            {WORD_PRESET_LABELS.map((label) => {
              const selected = tokens.some((t) => t.toLowerCase() === label.toLowerCase());
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggle(label)}
                  className={pillClass(selected)}
                >
                  {label}
                </button>
              );
            })}
            {customPool.map((label) => {
              const selected = tokens.some((t) => t.toLowerCase() === label.toLowerCase());
              return (
                <div key={`custom-${label}`} className="relative">
                  <button
                    type="button"
                    onClick={() => toggle(label)}
                    className={pillClass(selected)}
                  >
                    {label}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCustomWordRemove(label);
                    }}
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-sky-200/80 bg-white text-slate-500 shadow-sm transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove custom word ${label}`}
                    title="Remove custom word"
                  >
                    <IconClose />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={`flex gap-2 ${compact ? "flex-col" : "flex-col sm:flex-row"}`}>
        <input
          type="text"
          value={customDraft}
          onChange={(e) => setCustomDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (!addDisabled) addCustom();
            }
          }}
          placeholder="Or type custom word..."
          className="min-w-0 flex-1 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-[0.78rem] text-slate-800 placeholder:text-slate-400 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/15 sm:text-[0.82rem]"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={addDisabled}
          className="shrink-0 rounded-xl bg-bvm-title px-4 py-2 text-[0.78rem] font-semibold text-white shadow-sm transition-colors hover:bg-bvm-title/90 disabled:cursor-not-allowed disabled:opacity-40 sm:text-[0.82rem]"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function JournalRatingCell({
  m,
  onPatch,
  readOnly,
}: {
  m: SelfReflectionMeasure;
  onPatch: (
    patch: Partial<
      Pick<SelfReflectionMeasure, "numberValue" | "wordTokens" | "wordRatingIndex" | "emojiIndex">
    >,
  ) => void;
  readOnly?: boolean;
}) {
  if (readOnly) {
    if (m.scale === "numbers") {
      return (
        <div className="flex h-full min-h-[40px] flex-col justify-center">
          <p className="text-center text-[0.72rem] font-semibold tabular-nums text-bvm-title sm:text-[0.78rem]">
            {m.numberValue != null ? m.numberValue : "—"}
          </p>
        </div>
      );
    }
    if (m.scale === "words") {
      const palette =
        m.wordTokens.length > 0
          ? m.wordTokens.slice(0, MAX_REFLECTION_WORDS)
          : m.wordChoice != null
            ? [legacyWordChoiceToLabel(m.wordChoice)]
            : [];
      const label =
        m.wordRatingIndex != null && palette[m.wordRatingIndex] != null
          ? palette[m.wordRatingIndex]
          : "—";
      return (
        <p className="py-1 text-center text-[0.62rem] font-medium leading-tight text-slate-800 sm:text-[0.65rem]">
          {label}
        </p>
      );
    }
    if (m.emojiIndex == null) {
      return (
        <p className="py-1 text-center text-[0.62rem] font-medium text-slate-400">—</p>
      );
    }
    const ei = Math.max(0, Math.min(3, m.emojiIndex)) as 0 | 1 | 2 | 3;
    return (
      <div className="flex flex-col items-center justify-center gap-0.5">
        <MoodFace mood={ei} className="h-7 w-7 sm:h-8 sm:w-8" />
        <span className="text-[0.55rem] font-medium text-slate-600">{EMOJI_OPTIONS[ei]?.label}</span>
      </div>
    );
  }

  if (m.scale === "numbers") {
    if (m.numberValue == null) {
      return (
        <div className="flex h-full min-h-[44px] flex-col justify-center px-0.5">
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            className="bvm-slider h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/50 accent-bvm-title"
            aria-label="Set rating 1 to 10"
            onChange={(e) => onPatch({ numberValue: Number(e.target.value) })}
          />
          <p className="mt-0.5 text-center text-[0.58rem] text-slate-400">Drag to set</p>
        </div>
      );
    }
    return (
      <div className="flex h-full min-h-[40px] flex-col justify-center">
        <RatingSlider
          dense
          value={m.numberValue}
          onChange={(n) => onPatch({ numberValue: n })}
        />
      </div>
    );
  }

  if (m.scale === "words") {
    const palette =
      m.wordTokens.length > 0
        ? m.wordTokens.slice(0, MAX_REFLECTION_WORDS)
        : m.wordChoice != null
          ? [legacyWordChoiceToLabel(m.wordChoice)]
          : [];
    if (palette.length === 0) {
      return (
        <p className="py-1 text-center text-[0.65rem] text-slate-500">—</p>
      );
    }
    return (
      <div className="flex max-w-full flex-nowrap justify-center gap-0.5 overflow-x-auto pb-0.5">
        {palette.map((word, i) => {
          const selected = m.wordRatingIndex === i;
          return (
            <button
              key={`${m.id}-palette-${i}`}
              type="button"
              title={word}
              onClick={() => onPatch({ wordRatingIndex: i })}
              className={[
                "flex min-w-0 flex-1 basis-0 flex-col items-center justify-center rounded-lg px-0.5 py-1",
                selected
                  ? "bg-white/90 ring-1 ring-bvm-title/30"
                  : "opacity-85 hover:opacity-100",
              ].join(" ")}
            >
              <span
                className={`max-w-full truncate text-center text-[0.55rem] font-medium leading-tight sm:text-[0.58rem] ${
                  selected ? "text-bvm-title" : "text-slate-600"
                }`}
              >
                {word}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex max-w-full flex-nowrap justify-center gap-0.5 overflow-x-auto pb-0.5">
      {EMOJI_OPTIONS.map((opt, i) => {
        const selected = m.emojiIndex !== null && m.emojiIndex === i;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onPatch({ emojiIndex: i })}
            className={[
              "flex min-w-[2.25rem] flex-col items-center rounded-lg px-0.5 py-0.5",
              selected ? "bg-white/90 ring-1 ring-bvm-title/30" : "opacity-85 hover:opacity-100",
            ].join(" ")}
            title={opt.label}
          >
            <MoodFace mood={i as 0 | 1 | 2 | 3} className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="mt-0.5 max-w-[2.5rem] truncate text-center text-[0.55rem] font-medium leading-none text-slate-600">
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SelfReflectionSection({ headingId }: Props) {
  const {
    state,
    setReflectionArea,
    setReflectionScale,
    setReflectionNumberValue,
    setReflectionWordTokens,
    setReflectionCustomWordPool,
    setReflectionEmojiIndex,
    addReflectionMeasure,
    removeReflectionMeasure,
    removeReflectionWeek,
    setReflectionWeekDate,
    updateReflectionMeasure,
    submitReflectionWeek,
  } = useJournalStorage();
  const [editingWeekId, setEditingWeekId] = useState<string | null>(null);
  const [celebrationWeekId, setCelebrationWeekId] = useState<string | null>(null);
  const [hasShownFirstCelebration, setHasShownFirstCelebration] = useState(false);
  const trimmedReflectionArea = state.reflectionArea.trim();
  const canCreateReflectionMeasure = trimmedReflectionArea.length > 0;

  useEffect(() => {
    if (state.reflectionWeeks.length === 0) {
      setCelebrationWeekId(null);
      setHasShownFirstCelebration(false);
      setEditingWeekId(null);
    }
  }, [state.reflectionWeeks.length]);

  const createJournal = useCallback(() => {
    if (!canCreateReflectionMeasure) return;
    const measure: SelfReflectionMeasure = {
      id: newReflectionMeasureId(),
      area: trimmedReflectionArea,
      scale: state.reflectionScale,
      numberValue: null,
      wordTokens:
        state.reflectionScale === "words"
          ? normalizeWordTokens(state.reflectionWordTokens)
          : [],
      wordRatingIndex: null,
      emojiIndex: null,
    };
    addReflectionMeasure(measure);
    setReflectionArea("");
  }, [
    addReflectionMeasure,
    canCreateReflectionMeasure,
    setReflectionArea,
    state.reflectionScale,
    state.reflectionWordTokens,
    trimmedReflectionArea,
  ]);

  const handleSubmitWeek = useCallback(
    (weekId: string) => {
      const isFirstSubmit = state.reflectionWeeks.every((week) => !week.submitted);
      submitReflectionWeek(weekId);
      if (isFirstSubmit && !hasShownFirstCelebration) {
        setCelebrationWeekId(weekId);
        setHasShownFirstCelebration(true);
      }
    },
    [hasShownFirstCelebration, state.reflectionWeeks, submitReflectionWeek],
  );

  const toggleEditWeek = useCallback((weekId: string) => {
    setEditingWeekId((current) => (current === weekId ? null : weekId));
  }, []);

  const scale = state.reflectionScale;

  return (
    <div className="mx-auto max-w-[40rem] space-y-8 px-5 pb-16 pt-8 sm:max-w-[42rem] sm:px-8 sm:pb-20 sm:pt-10">
      <section
        className={`${JOURNAL_GLASS_PANEL_BASE} ${JOURNAL_GLASS_BORDER.selfReflection} sm:py-10`}
        aria-labelledby={headingId}
      >
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-[1rem] font-medium text-bvm-title sm:text-[1.05rem]">
              Choose What to Measure
            </h3>
            <label className="mt-4 block text-[0.8125rem] font-medium text-slate-800">Area</label>
            <input
              type="text"
              value={state.reflectionArea}
              onChange={(e) => setReflectionArea(e.target.value)}
              placeholder="e.g., Sleep quality"
              className="mt-2 w-full rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3 text-[0.95rem] text-slate-700 placeholder:text-slate-400 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
            />
          </div>

          <div>
            <h3 className="font-display text-[1rem] font-medium text-bvm-title sm:text-[1.05rem]">
              Choose your scoring scale
            </h3>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {SCALE_ROW.map((t) => {
                const selected = scale === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setReflectionScale(t.id)}
                    className={[
                      "rounded-2xl border px-2 py-3 text-center transition-colors sm:py-3.5",
                      selected
                        ? "border-bvm-title bg-white/90 shadow-sm ring-1 ring-bvm-title/25"
                        : "border-slate-200/80 bg-white/50 hover:bg-white/75",
                    ].join(" ")}
                    aria-pressed={selected}
                  >
                    <div className="text-[0.9rem] font-semibold text-slate-900 sm:text-[0.95rem]">
                      {t.label}
                    </div>
                    <div className="mt-1 text-[0.65rem] font-medium text-slate-500 sm:text-[0.7rem]">
                      {t.hint}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-teal-300/35 bg-white/25 px-4 py-4">
            <div className="text-[0.8125rem] font-medium text-slate-600">Preview:</div>

            {scale === "numbers" && (
              <div className="mt-3">
                <div className="flex items-baseline justify-between">
                  <div className="text-[0.98rem] font-semibold text-slate-900">Rating</div>
                  <div className="text-[0.98rem] font-semibold text-bvm-title">
                    {state.reflectionNumberValue}
                  </div>
                </div>
                <div className="mt-1 text-[0.78rem] font-medium text-slate-500">1 (low) → 10 (high)</div>
                <RatingSlider value={state.reflectionNumberValue} onChange={setReflectionNumberValue} />
              </div>
            )}

            {scale === "words" && (
              <div className="mt-3">
                <ReflectionWordsEditor
                  tokens={state.reflectionWordTokens}
                  customPool={state.reflectionCustomWordPool}
                  onTokensChange={setReflectionWordTokens}
                  onCustomPoolChange={setReflectionCustomWordPool}
                    onCustomWordRemove={(word) => {
                      setReflectionWordTokens(state.reflectionWordTokens.filter((w) => w !== word));
                      setReflectionCustomWordPool(state.reflectionCustomWordPool.filter((w) => w !== word));
                    }}
                />
              </div>
            )}

            {scale === "emojis" && (
              <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
                {EMOJI_OPTIONS.map((opt, i) => {
                  const selected = state.reflectionEmojiIndex === i;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setReflectionEmojiIndex(i)}
                      className={[
                        "flex flex-col items-center rounded-2xl border px-1 py-2 transition-colors",
                        selected
                          ? "border-bvm-title bg-white/90 ring-1 ring-bvm-title/20"
                          : "border-transparent bg-transparent hover:bg-white/40",
                      ].join(" ")}
                    >
                      <MoodFace mood={i as 0 | 1 | 2 | 3} />
                      <span className="mt-1.5 text-[0.75rem] font-medium text-slate-600 sm:text-[0.8rem]">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={createJournal}
            disabled={!canCreateReflectionMeasure}
            className="w-full rounded-2xl border border-bvm-title/40 bg-bvm-title/90 py-3.5 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-bvm-title disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-bvm-title/90"
          >
            Create
          </button>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="self-reflection-journal-heading">
        <h3
          id="self-reflection-journal-heading"
          className="font-display text-center text-[1.05rem] font-semibold tracking-[0.04em] text-bvm-title sm:text-[1.15rem]"
        >
          My self reflection journal
        </h3>

        {state.reflectionWeeks.length === 0 ? (
          <div className="rounded-[1.25rem] border-2 border-cyan-500/45 bg-gradient-to-br from-sky-50/90 to-indigo-50/40 px-3 py-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:px-5">
            <p className="text-center text-[0.9rem] leading-relaxed text-slate-600">
              Please create your self reflection measure.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {state.reflectionWeeks.map((week) => {
              const total = week.measures.length;
              const done = week.measures.filter(isMeasureRatingComplete).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const canSubmit = !week.submitted && total > 0 && done === total;
              const isEditing = editingWeekId === week.id;
              const isEditable = !week.submitted || isEditing;
              const showProgress = !week.submitted;
              const showCelebration = celebrationWeekId === week.id && week.submitted;

              return (
                <div
                  key={week.id}
                  className={[
                    "relative rounded-[1.25rem] border-2 border-cyan-500/45 bg-gradient-to-br from-sky-50/90 to-indigo-50/40 px-3 py-4 pr-11 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:px-5 sm:py-5 sm:pr-14",
                    week.submitted ? "ring-1 ring-slate-300/60" : "",
                  ].join(" ")}
                >
                  {showCelebration ? (
                    <div className="mb-4 overflow-hidden rounded-2xl border border-teal-200/70 bg-gradient-to-br from-sky-50 via-white to-teal-50 px-4 py-4 shadow-[0_8px_24px_-16px_rgba(43,106,158,0.55)]">
                      <div className="flex items-start gap-3">
                        <CelebrationBurst />
                        <div className="min-w-0 flex-1 pt-0.5">
                          <p className="font-display text-[1rem] font-semibold text-bvm-title sm:text-[1.05rem]">
                            Congratulations!
                          </p>
                          <p className="mt-1 text-[0.86rem] leading-relaxed text-slate-700 sm:text-[0.92rem]">
                            You just submitted your first self-reflection journal entry.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCelebrationWeekId(null)}
                          className="shrink-0 rounded-full border border-slate-200/80 bg-white/90 px-3 py-1.5 text-[0.72rem] font-semibold text-slate-600 transition-colors hover:bg-white hover:text-bvm-title"
                          aria-label="Dismiss congratulations message"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        typeof window !== "undefined" &&
                        !window.confirm(
                          `Delete ${week.label} and all areas in this week? This cannot be undone.`,
                        )
                      ) {
                        return;
                      }
                      removeReflectionWeek(week.id);
                    }}
                    className="absolute right-2 top-2 z-10 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 sm:right-3 sm:top-3"
                    aria-label={`Delete ${week.label}`}
                  >
                    <IconTrash />
                  </button>

                  <div className="mb-3 space-y-2 sm:mb-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-display text-[0.95rem] font-bold text-slate-900 sm:text-base">
                        {week.label}
                      </p>

                      {week.submitted ? (
                        <button
                          type="button"
                          onClick={() => toggleEditWeek(week.id)}
                          className="shrink-0 rounded-full border border-bvm-title/45 bg-white/90 px-3 py-1.5 text-[0.72rem] font-semibold text-bvm-title shadow-sm transition-colors hover:bg-bvm-title hover:text-white"
                        >
                          {isEditing ? "Done Editing" : "Edit Reflection"}
                        </button>
                      ) : showProgress ? (
                        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                          <div className="flex min-w-0 flex-1 items-center justify-end">
                            <div
                              className="h-2.5 w-full min-w-0 overflow-hidden rounded-full bg-slate-200/90 sm:w-[90%]"
                              role="progressbar"
                              aria-valuenow={done}
                              aria-valuemin={0}
                              aria-valuemax={total || 1}
                              aria-label={`${week.label} progress`}
                            >
                              <div
                                className="h-full rounded-full bg-bvm-title transition-[width] duration-300 ease-out"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                          <span className="shrink-0 text-[0.65rem] font-medium tabular-nums text-slate-600 sm:text-[0.7rem]">
                            {total > 0 ? `${done}/${total}` : "0/0"}
                          </span>
                          {canSubmit ? (
                            <button
                              type="button"
                              onClick={() => handleSubmitWeek(week.id)}
                              className="shrink-0 rounded-full border border-bvm-title/50 bg-white/90 px-3 py-1.5 text-[0.68rem] font-semibold text-bvm-title shadow-sm transition-colors hover:bg-bvm-title hover:text-white sm:text-[0.72rem]"
                            >
                              Submit Reflection
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`${week.id}-reflection-date`}
                        className="text-[0.62rem] font-medium text-slate-600 sm:text-[0.65rem]"
                      >
                        Reflection date
                      </label>
                      <input
                        id={`${week.id}-reflection-date`}
                        type="date"
                        value={week.reflectionDate}
                        onChange={(e) => setReflectionWeekDate(week.id, e.target.value)}
                        readOnly={!isEditable}
                        aria-readonly={!isEditable}
                        className="rounded-md border border-slate-200/80 bg-white/90 px-2 py-1 text-[0.65rem] font-medium text-slate-700 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/15 sm:text-[0.68rem]"
                      />
                    </div>
                  </div>

                  {week.measures.length === 0 ? (
                    <p className="py-6 text-center text-[0.85rem] text-slate-600">No areas in this week yet.</p>
                  ) : (
                    <ul className="space-y-3 sm:space-y-4">
                      {week.measures.map((m, i) => (
                        <li key={m.id} className="flex items-stretch gap-1.5 sm:gap-2">
                          <div className="w-[26%] min-w-0 shrink-0 sm:w-[28%]">
                            <p className="text-[0.68rem] font-semibold text-slate-700 sm:text-[0.72rem]">
                              Area {i + 1}:
                            </p>
                            {isEditable ? (
                              <input
                                type="text"
                                value={m.area}
                                onChange={(e) => updateReflectionMeasure(m.id, { area: e.target.value })}
                                className="mt-0.5 w-full rounded-lg border border-slate-200/80 bg-white/90 px-2 py-1 text-[0.78rem] font-medium text-slate-900 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/15 sm:text-[0.85rem]"
                              />
                            ) : (
                              <p
                                className="mt-0.5 truncate text-[0.78rem] font-medium text-slate-900 sm:text-[0.85rem]"
                                title={m.area || undefined}
                              >
                                {m.area || "—"}
                              </p>
                            )}
                            <p
                              className="mt-1 truncate text-[0.62rem] text-slate-500 sm:text-[0.65rem]"
                              title={scaleDisplayName(m.scale)}
                            >
                              {scaleDisplayName(m.scale)}
                            </p>
                          </div>

                          <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-full border border-sky-200/60 bg-white/25 px-2 py-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
                            <div className="w-full px-1.5">
                              <JournalRatingCell
                                m={m}
                                onPatch={(patch) => updateReflectionMeasure(m.id, patch)}
                                readOnly={!isEditable}
                              />
                            </div>
                          </div>

                          {isEditable ? (
                            <button
                              type="button"
                              onClick={() => removeReflectionMeasure(m.id)}
                              className="shrink-0 self-center rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              aria-label={`Delete measure ${i + 1}`}
                            >
                              <IconTrash />
                            </button>
                          ) : (
                            <div className="w-7 shrink-0 sm:w-8" aria-hidden />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

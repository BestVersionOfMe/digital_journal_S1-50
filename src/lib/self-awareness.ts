/** Mirrors `bvm_journal/sections/self_awareness.py` — content + export shape. */

export const RATING_TABLE_WIDTH_PCT = 100;
export const SLIDER_TRACK_WIDTH_PCT = 100;
export const PILL_BUTTON_GAP_REM = 1.5;

export const SEGMENTED_SOLID_BG = [
  "#eef5fb",
  "#dbeaf7",
  "#bfd9ee",
  "#8eb8db",
  "#5f94c5",
] as const;

export const RATING_SKILLS: { id: string; label: string }[] = [
  { id: "self_compassion_skill", label: "Self Compassion" },
  { id: "feedback", label: "Feedback" },
  { id: "self_reflection", label: "Self Reflection" },
  { id: "mindfulness", label: "Mindfulness" },
];

export type RatingVariant =
  | "segmented"
  | "pills"
  | "select_slider"
  | "radio_row"
  | "star_rating"
  | "stepper";

/** All skills use the same five-tone segmented bar as row 1 (Emotional Awareness). */
export const RATING_VARIANT_BY_SKILL: Record<string, RatingVariant> = {};

export const OPTIONS_1_TO_5 = ["1", "2", "3", "4", "5"] as const;
export type Option15 = (typeof OPTIONS_1_TO_5)[number];

export type CompassionPrompt = {
  id: string;
  prompt: string;
  /** Short hint chips shown under “Need help?” */
  suggestions: string[];
};

/** Exact chip labels → first-person sentences (present tense). */
const COMPASSION_CHIP_ANSWERS: Record<string, string> = {
  "Listening to others": "I listen to others",
  "Never giving up": "I never give up",
  "Making people smile": "I make people smile",
};

/** Chip → textarea: fixed phrases above; else “I'm …” unless already I'm / I am. */
export function compassionSuggestionToAnswer(suggestion: string): string {
  const s = suggestion.trim();
  const fixed = COMPASSION_CHIP_ANSWERS[s];
  if (fixed !== undefined) return fixed;
  if (/^(I['']m|I am)\b/i.test(s)) return s;
  const rest = s.length === 0 ? "" : s.charAt(0).toLowerCase() + s.slice(1);
  return `I'm ${rest}`;
}

export const COMPASSION_PROMPTS: CompassionPrompt[] = [
  {
    id: "sc_like_self",
    prompt: "What's something you like about yourself?",
    suggestions: [
      "Listening to others",
      "I am thoughtful",
      "Never giving up",
      "Making people smile",
    ],
  },
  {
    id: "sc_good_at",
    prompt: "What's something you feel you're good at?",
    suggestions: [
      "Problem solving",
      "Creativity",
      "Helping friends",
      "Sports",
      "Music",
    ],
  },
  {
    id: "sc_quality_others",
    prompt: "What's a quality you like about how you treat other people?",
    suggestions: [
      "Kindness",
      "Patience",
      "Honesty",
      "Listening",
      "Encouraging others",
    ],
  },
];

export const STORAGE_KEY = "bvm_journal_v1";

/**
 * Frosted glass body — add one of `JOURNAL_GLASS_BORDER.*` for a tinted rim (“effect 1”).
 */
export const JOURNAL_GLASS_PANEL_BASE =
  "rounded-[1.25rem] border-2 bg-gradient-to-br from-white/60 via-white/45 to-sky-100/25 px-5 py-8 shadow-[0_1px_0_rgba(43,106,158,0.1),0_10px_40px_-8px_rgba(43,106,158,0.12),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md sm:rounded-[1.35rem] sm:px-8 sm:py-9";

/** Distinct rim colors per journal block */
export const JOURNAL_GLASS_BORDER = {
  skillsRating: "border-sky-500/50",
  seekingFeedback: "border-indigo-400/50",
  givingFeedback: "border-rose-400/50",
  selfReflection: "border-teal-500/50",
  selfCompassion: "border-amber-500/50",
  mindfulness: "border-emerald-500/50",
  emotionalAwareness: "border-violet-500/50",
} as const;

export type SelfReflectionScale = "numbers" | "words" | "emojis";

export type ReflectionWordChoice = "rarely" | "sometimes" | "often" | "always";

/** Preset frequency words for the Words scale (multi-select, max `MAX_REFLECTION_WORDS`). */
export const WORD_PRESET_LABELS = [
  "Never",
  "Rarely",
  "Occasionally",
  "Sometimes",
  "Often",
  "Frequently",
  "Usually",
  "Consistently",
  "Almost always",
  "Always",
] as const;

export const MAX_REFLECTION_WORDS = 4;

const LEGACY_WORD_CHOICE_LABEL: Record<ReflectionWordChoice, string> = {
  rarely: "Rarely",
  sometimes: "Sometimes",
  often: "Often",
  always: "Always",
};

export function legacyWordChoiceToLabel(c: ReflectionWordChoice): string {
  return LEGACY_WORD_CHOICE_LABEL[c];
}

/** Dedupe (case-insensitive), trim, cap length. */
export function normalizeWordTokens(input: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input) {
    const s = raw.trim();
    if (!s) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= MAX_REFLECTION_WORDS) break;
  }
  return out;
}

export function isPresetWordLabel(s: string): boolean {
  const k = s.trim().toLowerCase();
  return WORD_PRESET_LABELS.some((p) => p.toLowerCase() === k);
}

/** Custom words the user added to the chip list (not auto-selected). Deduped; presets excluded. */
export function normalizeCustomWordPool(input: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input) {
    const s = raw.trim();
    if (!s || isPresetWordLabel(s)) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= 32) break;
  }
  return out;
}

/** Ensures every selected non-preset word has a chip in the pool. */
export function ensureCustomPoolCoversSelections(tokens: string[], pool: string[]): string[] {
  return normalizeCustomWordPool([...pool, ...tokens]);
}

/** One saved row in “My self reflection journal” (Week One). */
export type SelfReflectionMeasure = {
  id: string;
  area: string;
  scale: SelfReflectionScale;
  /** Numbers scale: 1–10; `null` = not chosen yet. */
  numberValue: number | null;
  /**
   * Words scale: up to `MAX_REFLECTION_WORDS` labels chosen when Create was pressed — fixed palette in the journal row.
   */
  wordTokens: string[];
  /** Words scale: which palette entry is the rating (single choice). `null` = none chosen yet. */
  wordRatingIndex: number | null;
  /** Legacy single chip; ignored when `wordTokens` is non-empty. */
  wordChoice?: ReflectionWordChoice | null;
  /** Emojis scale: 0–3; `null` = not chosen yet. */
  emojiIndex: number | null;
};

/** One week block in “My self reflection journal” (Week One, Week Two, …). */
export type ReflectionWeekBlock = {
  id: string;
  /** Display label, e.g. "Week One". */
  label: string;
  /** Reflection date (`YYYY-MM-DD`) shown under the week title. */
  reflectionDate: string;
  measures: SelfReflectionMeasure[];
  /** When true, week is marked as submitted; users can still edit entries/date. */
  submitted: boolean;
};

export type JournalState = {
  ratings: Record<string, string | null>;
  compassion: Record<string, string>;
  /** Single measure area (demo) */
  reflectionArea: string;
  reflectionScale: SelfReflectionScale;
  /** Numbers scale: 1–10 */
  reflectionNumberValue: number;
  /** Words scale preview: preset + custom tokens (max `MAX_REFLECTION_WORDS`) */
  reflectionWordTokens: string[];
  /** Words scale: typed words appear here first; user clicks to select. */
  reflectionCustomWordPool: string[];
  /** Emojis scale: 0–3 (Low → Great) */
  reflectionEmojiIndex: number;
  /** Self-reflection journal weeks (Week One, Week Two, …) */
  reflectionWeeks: ReflectionWeekBlock[];
  /** Seeking Feedback — who to ask */
  seekingFeedbackText: string;
  /** After Submit: textarea is read-only until user taps edit */
  seekingFeedbackSubmitted: boolean;
  /** Giving Feedback — Glow & Grow plan */
  givingFeedbackText: string;
  givingFeedbackSubmitted: boolean;
};

export function defaultJournalState(): JournalState {
  const ratings: Record<string, string | null> = {};
  for (const { id } of RATING_SKILLS) {
    ratings[id] = id === "feedback" ? "3" : null;
  }
  const compassion: Record<string, string> = {};
  for (const { id } of COMPASSION_PROMPTS) {
    compassion[id] = "";
  }
  return {
    ratings,
    compassion,
    reflectionArea: "",
    reflectionScale: "numbers",
    reflectionNumberValue: 6,
    reflectionWordTokens: ["Sometimes"],
    reflectionCustomWordPool: [],
    reflectionEmojiIndex: 1,
    reflectionWeeks: [],
    seekingFeedbackText: "",
    seekingFeedbackSubmitted: false,
    givingFeedbackText: "",
    givingFeedbackSubmitted: false,
  };
}

const WEEK_ORDINAL = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"] as const;

export function weekLabelFromIndex(index: number): string {
  const o = WEEK_ORDINAL[index];
  return o ? `Week ${o}` : `Week ${index + 1}`;
}

export function newReflectionMeasureId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sr_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function newReflectionWeekId(): string {
  return newReflectionMeasureId();
}

export function todayIsoDateLocal(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Whether the user has completed the rating for this measure (counts toward week progress). */
export function isMeasureRatingComplete(m: SelfReflectionMeasure): boolean {
  if (m.scale === "words") {
    return m.wordTokens.length > 0 && m.wordRatingIndex != null;
  }
  if (m.scale === "numbers") {
    return (
      typeof m.numberValue === "number" &&
      m.numberValue >= 1 &&
      m.numberValue <= 10
    );
  }
  return (
    typeof m.emojiIndex === "number" && m.emojiIndex >= 0 && m.emojiIndex <= 3
  );
}

/** Same areas/scales/word palettes as `measures`, with fresh ratings for the next week. */
export function cloneMeasuresForNextWeek(measures: SelfReflectionMeasure[]): SelfReflectionMeasure[] {
  return measures.map((m) => ({
    ...m,
    id: newReflectionMeasureId(),
    numberValue: m.scale === "numbers" ? null : m.numberValue,
    wordRatingIndex: m.scale === "words" ? null : m.wordRatingIndex,
    wordTokens: [...m.wordTokens],
    emojiIndex: m.scale === "emojis" ? null : m.emojiIndex,
  }));
}

export function exportMarkdown(state: JournalState): string {
  const lines: string[] = ["# Self-Awareness — page 1", ""];
  lines.push("## Self-Awareness skills rating (1 = low, 5 = high)");
  lines.push("");
  for (const { id, label } of RATING_SKILLS) {
    const v = state.ratings[id];
    lines.push(
      `- **${label}:** ${v != null ? v : "_(not selected)_"}`,
    );
  }
  lines.push("");
  lines.push("## Self compassion");
  lines.push("");
  for (const { id, prompt } of COMPASSION_PROMPTS) {
    const body = state.compassion[id]?.trim() ?? "";
    lines.push(`### ${prompt}`);
    lines.push("");
    lines.push(body || "_(empty)_");
    lines.push("");
  }

  lines.push("## Self reflection (demo)");
  lines.push("");
  lines.push(`- Area: ${state.reflectionArea.trim() || "_(empty)_"}`);
  lines.push(`- Scoring scale: ${state.reflectionScale}`);
  if (state.reflectionWeeks.length > 0) {
    for (const w of state.reflectionWeeks) {
      lines.push(`- ${w.label}${w.submitted ? " (submitted)" : ""}:`);
      for (const m of w.measures) {
        lines.push(`  - **${m.area || "_(empty)_"}** — ${m.scale}`);
      }
    }
  }
  lines.push("");
  lines.push("## Feedback");
  lines.push("");
  lines.push("### Seeking feedback");
  lines.push("");
  lines.push(state.seekingFeedbackText.trim() || "_(empty)_");
  lines.push("");
  lines.push("### Giving feedback");
  lines.push("");
  lines.push(state.givingFeedbackText.trim() || "_(empty)_");
  lines.push("");
  return lines.join("\n");
}

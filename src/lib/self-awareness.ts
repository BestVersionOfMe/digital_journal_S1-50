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
  { id: "emotional_awareness", label: "Emotional Awareness" },
  { id: "honesty", label: "Honesty" },
  { id: "seek_feedback", label: "Seek Feedback" },
  { id: "self_compassion_skill", label: "Self Compassion" },
  { id: "mindfulness", label: "Mindfulness" },
  { id: "self_reflection", label: "Self Reflection" },
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
  "rounded-[1.35rem] border bg-white/[0.96] px-5 py-7 shadow-[0_28px_70px_-34px_rgba(5,43,99,0.42),0_2px_0_rgba(255,255,255,0.9),inset_0_1px_0_rgba(255,255,255,0.85)] ring-1 ring-white/80 backdrop-blur-md sm:rounded-[1.5rem] sm:px-8 sm:py-8";

/** Distinct rim colors per journal block */
export const JOURNAL_GLASS_BORDER = {
  skillsRating: "border-bvm-borderStrong/70",
  seekingFeedback: "border-bvm-borderStrong/70",
  givingFeedback: "border-bvm-borderStrong/70",
  selfReflection: "border-bvm-borderStrong/70",
  selfCompassion: "border-bvm-borderStrong/70",
  mindfulness: "border-bvm-borderStrong/70",
  emotionalAwareness: "border-bvm-borderStrong/70",
} as const;

export const JOURNAL_SUBHEADING_CLASS =
  "font-display text-center text-[1.05rem] font-semibold tracking-[0.04em] text-bvm-title sm:text-[1.15rem]";

export const JOURNAL_RECORDS_SHELL_CLASS =
  "rounded-2xl border border-bvm-border bg-bvm-softBlue/35 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]";

export const JOURNAL_RECORD_CARD_CLASS =
  "rounded-2xl border border-bvm-border bg-white/80 px-4 py-4 shadow-[0_12px_30px_-24px_rgba(5,43,99,0.24),inset_0_1px_0_rgba(255,255,255,0.8)]";

export const JOURNAL_PRIMARY_BUTTON_CLASS =
  "rounded-xl bg-bvm-title px-5 py-3 text-[0.95rem] font-semibold text-white shadow-[0_8px_20px_rgba(5,43,99,0.22)] transition-all hover:-translate-y-0.5 hover:bg-bvm-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bvm-action/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0";

export const JOURNAL_COLLAPSE_BUTTON_CLASS =
  "shrink-0 rounded-full border border-bvm-borderStrong bg-white/90 px-3 py-1.5 text-[0.72rem] font-semibold text-bvm-title shadow-sm transition-colors hover:bg-bvm-title hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bvm-action/25";

export const JOURNAL_ICON_BUTTON_CLASS =
  "rounded-lg p-2 text-bvm-muted transition-colors hover:bg-bvm-softBlue hover:text-bvm-title focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bvm-action/20";

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

export type MindfulnessPracticeRecord = {
  id: string;
  exerciseId: number;
  exerciseTitle: string;
  exerciseEmoji: string;
  durationSeconds: number;
};

export type MindfulnessSessionRecord = {
  id: string;
  label: string;
  practiceDate: string;
  practices: MindfulnessPracticeRecord[];
  feelText: string;
  submitted: boolean;
};

export type SkillRatingSnapshot = {
  id: string;
  date: string;
  createdAt: string;
  ratings: Record<string, string | null>;
};

export type JournalState = {
  ratings: Record<string, string | null>;
  skillRatingSnapshots: SkillRatingSnapshot[];
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
  mindfulnessSessions: MindfulnessSessionRecord[];
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
    ratings[id] = null;
  }
  const compassion: Record<string, string> = {};
  for (const { id } of COMPASSION_PROMPTS) {
    compassion[id] = "";
  }
  return {
    ratings,
    skillRatingSnapshots: [],
    compassion,
    reflectionArea: "",
    reflectionScale: "numbers",
    reflectionNumberValue: 6,
    reflectionWordTokens: ["Sometimes"],
    reflectionCustomWordPool: [],
    reflectionEmojiIndex: 1,
    reflectionWeeks: [],
    mindfulnessSessions: [],
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

export function newMindfulnessPracticeId(): string {
  return newReflectionMeasureId();
}

export function newMindfulnessSessionId(): string {
  return newReflectionMeasureId();
}

export function mindfulnessSessionLabelFromIndex(index: number): string {
  return `Practice ${index + 1}`;
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
  if (state.skillRatingSnapshots.length > 0) {
    lines.push("");
    lines.push("### Saved skills rating records");
    lines.push("");
    for (const snapshot of state.skillRatingSnapshots) {
      lines.push(`- ${snapshot.date} (${snapshot.createdAt})`);
      for (const { id, label } of RATING_SKILLS) {
        const v = snapshot.ratings[id];
        lines.push(`  - **${label}:** ${v != null ? v : "_(not selected)_"}`);
      }
    }
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

  lines.push("## Self reflection");
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
  if (state.mindfulnessSessions.length > 0) {
    lines.push("");
    lines.push("## Mindfulness practice records");
    lines.push("");
    for (const session of state.mindfulnessSessions) {
      const totalSeconds = session.practices.reduce(
        (total, practice) => total + practice.durationSeconds,
        0,
      );
      const totalMins = Math.floor(totalSeconds / 60);
      const totalSecs = String(totalSeconds % 60).padStart(2, "0");
      lines.push(`- ${session.label}${session.submitted ? " (submitted)" : ""}: ${session.practiceDate}`);
      lines.push(`  - Total practice time: ${totalMins}:${totalSecs}`);
      for (const practice of session.practices) {
        const mins = Math.floor(practice.durationSeconds / 60);
        const secs = String(practice.durationSeconds % 60).padStart(2, "0");
        lines.push(`  - **${practice.exerciseTitle}** — ${mins}:${secs}`);
      }
      if (session.feelText.trim()) lines.push(`  - Feel: ${session.feelText.trim()}`);
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

export function buildSelfAwarenessReport(state: JournalState): string {
  const lines: string[] = ["# Self-Awareness Page Report", ""];
  const empty = "_(empty)_";
  const notSelected = "_(not selected)_";
  const formatDuration = (seconds: number): string => {
    const safeSeconds = Math.max(0, Math.round(seconds));
    const mins = Math.floor(safeSeconds / 60);
    const secs = String(safeSeconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };
  const reflectionRating = (measure: SelfReflectionMeasure): string => {
    if (measure.scale === "numbers") {
      return measure.numberValue == null ? notSelected : String(measure.numberValue);
    }
    if (measure.scale === "words") {
      const palette =
        measure.wordTokens.length > 0
          ? measure.wordTokens
          : measure.wordChoice != null
            ? [legacyWordChoiceToLabel(measure.wordChoice)]
            : [];
      return measure.wordRatingIndex != null && palette[measure.wordRatingIndex] != null
        ? palette[measure.wordRatingIndex]!
        : notSelected;
    }
    return measure.emojiIndex == null
      ? notSelected
      : ["Low", "Okay", "Good", "Great"][measure.emojiIndex] ?? notSelected;
  };

  lines.push("## Skills rating");
  for (const { id, label } of RATING_SKILLS) {
    lines.push(`- ${label}: ${state.ratings[id] ?? notSelected}`);
  }

  lines.push("");
  lines.push("## Saved skills rating records");
  if (state.skillRatingSnapshots.length === 0) {
    lines.push(empty);
  } else {
    for (const snapshot of state.skillRatingSnapshots) {
      lines.push(`- ${snapshot.date} (${snapshot.createdAt})`);
      for (const { id, label } of RATING_SKILLS) {
        lines.push(`  - ${label}: ${snapshot.ratings[id] ?? notSelected}`);
      }
    }
  }

  lines.push("");
  lines.push("## Self compassion");
  for (const { id, prompt } of COMPASSION_PROMPTS) {
    lines.push(`- ${prompt}: ${state.compassion[id]?.trim() || empty}`);
  }

  lines.push("");
  lines.push("## Current self reflection choices");
  lines.push(`- Current reflection area: ${state.reflectionArea.trim() || empty}`);
  lines.push(`- Scoring scale: ${state.reflectionScale}`);
  lines.push(`- Number rating: ${state.reflectionNumberValue}`);
  lines.push(`- Selected words: ${state.reflectionWordTokens.join(", ") || empty}`);

  lines.push("");
  lines.push("## Self reflection journal records");
  if (state.reflectionWeeks.length === 0) {
    lines.push(empty);
  } else {
    for (const week of state.reflectionWeeks) {
      lines.push(`- ${week.label}${week.submitted ? " (submitted)" : ""}: ${week.reflectionDate}`);
      if (week.measures.length === 0) {
        lines.push(`  - ${empty}`);
      }
      for (const measure of week.measures) {
        lines.push(
          `  - ${measure.area.trim() || empty}: ${measure.scale}, rating ${reflectionRating(measure)}`,
        );
      }
    }
  }

  lines.push("");
  lines.push("## Mindfulness practice records");
  if (state.mindfulnessSessions.length === 0) {
    lines.push(empty);
  } else {
    for (const session of state.mindfulnessSessions) {
      const totalSeconds = session.practices.reduce(
        (total, practice) => total + practice.durationSeconds,
        0,
      );
      lines.push(
        `- ${session.label}${session.submitted ? " (submitted)" : ""}: ${session.practiceDate}`,
      );
      lines.push(`  - Total practice time: ${formatDuration(totalSeconds)}`);
      for (const practice of session.practices) {
        lines.push(`  - ${practice.exerciseTitle}: ${formatDuration(practice.durationSeconds)}`);
      }
      lines.push(`  - Feel: ${session.feelText.trim() || empty}`);
    }
  }

  lines.push("");
  lines.push("## Feedback");
  lines.push(`- Seeking feedback: ${state.seekingFeedbackText.trim() || empty}`);
  lines.push(`- Giving feedback: ${state.givingFeedbackText.trim() || empty}`);
  lines.push("");

  return lines.join("\n");
}

function escapeReportHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function reportText(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? "";
  return trimmed ? escapeReportHtml(trimmed) : '<span class="muted">Empty</span>';
}

function reportDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = String(safeSeconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function reflectionReportRating(measure: SelfReflectionMeasure): string {
  if (measure.scale === "numbers") {
    return measure.numberValue == null ? "Not selected" : String(measure.numberValue);
  }
  if (measure.scale === "words") {
    const palette =
      measure.wordTokens.length > 0
        ? measure.wordTokens
        : measure.wordChoice != null
          ? [legacyWordChoiceToLabel(measure.wordChoice)]
          : [];
    return measure.wordRatingIndex != null && palette[measure.wordRatingIndex] != null
      ? palette[measure.wordRatingIndex]!
      : "Not selected";
  }
  return measure.emojiIndex == null
    ? "Not selected"
    : ["Low", "Okay", "Good", "Great"][measure.emojiIndex] ?? "Not selected";
}

function reportRatingPill(value: string | null | undefined): string {
  const label = value ?? "-";
  return `<span class="rating-pill">${escapeReportHtml(label)}</span>`;
}

export function buildSelfAwarenessReportHtml(state: JournalState): string {
  const generatedAt = new Date().toLocaleString();
  const skillRows = RATING_SKILLS.map(
    ({ id, label }) => `
      <tr>
        <td>${escapeReportHtml(label)}</td>
        <td>${reportRatingPill(state.ratings[id])}</td>
      </tr>`,
  ).join("");
  const skillSnapshots =
    state.skillRatingSnapshots.length === 0
      ? '<p class="empty">No saved skills rating records yet.</p>'
      : state.skillRatingSnapshots
          .map(
            (snapshot) => `
              <article class="record-card">
                <div class="record-title-row">
                  <h3>${escapeReportHtml(snapshot.date)}</h3>
                  <span>${escapeReportHtml(snapshot.createdAt)}</span>
                </div>
                <div class="rating-grid">
                  ${RATING_SKILLS.map(
                    ({ id, label }) => `
                      <div class="mini-card">
                        <span>${escapeReportHtml(label)}</span>
                        <strong>${escapeReportHtml(snapshot.ratings[id] ?? "-")}</strong>
                      </div>`,
                  ).join("")}
                </div>
              </article>`,
          )
          .join("");
  const compassionRows = COMPASSION_PROMPTS.map(
    ({ id, prompt }) => `
      <article class="record-card">
        <h3>${escapeReportHtml(prompt)}</h3>
        <p>${reportText(state.compassion[id])}</p>
      </article>`,
  ).join("");
  const reflectionRecords =
    state.reflectionWeeks.length === 0
      ? '<p class="empty">No self reflection journal records yet.</p>'
      : state.reflectionWeeks
          .map(
            (week) => `
              <article class="record-card">
                <div class="record-title-row">
                  <h3>${escapeReportHtml(week.label)}</h3>
                  <span>${escapeReportHtml(week.reflectionDate)}${week.submitted ? " · Submitted" : ""}</span>
                </div>
                ${
                  week.measures.length === 0
                    ? '<p class="empty">No areas in this week.</p>'
                    : `<table>
                        <thead>
                          <tr><th>Area</th><th>Scale</th><th>Rating</th></tr>
                        </thead>
                        <tbody>
                          ${week.measures
                            .map(
                              (measure) => `
                                <tr>
                                  <td>${reportText(measure.area)}</td>
                                  <td>${escapeReportHtml(measure.scale)}</td>
                                  <td>${escapeReportHtml(reflectionReportRating(measure))}</td>
                                </tr>`,
                            )
                            .join("")}
                        </tbody>
                      </table>`
                }
              </article>`,
          )
          .join("");
  const mindfulnessRecords =
    state.mindfulnessSessions.length === 0
      ? '<p class="empty">No mindfulness practice records yet.</p>'
      : state.mindfulnessSessions
          .map((session) => {
            const totalSeconds = session.practices.reduce(
              (total, practice) => total + practice.durationSeconds,
              0,
            );
            return `
              <article class="record-card">
                <div class="record-title-row">
                  <h3>${escapeReportHtml(session.label)}</h3>
                  <span>${escapeReportHtml(session.practiceDate)}${session.submitted ? " · Submitted" : ""}</span>
                </div>
                <p class="meta">Total practice time: ${reportDuration(totalSeconds)}</p>
                ${
                  session.practices.length === 0
                    ? '<p class="empty">No practices in this session.</p>'
                    : `<div class="rating-grid">
                        ${session.practices
                          .map(
                            (practice) => `
                              <div class="mini-card">
                                <span>${escapeReportHtml(practice.exerciseTitle)}</span>
                                <strong>${reportDuration(practice.durationSeconds)}</strong>
                              </div>`,
                          )
                          .join("")}
                      </div>`
                }
                <p><strong>Feel:</strong> ${reportText(session.feelText)}</p>
              </article>`;
          })
          .join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Self-Awareness Report</title>
    <style>
      @page { size: A4; margin: 16mm; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        color: #102A43;
        background: #F7FBFF;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        line-height: 1.5;
      }
      .page {
        max-width: 820px;
        margin: 0 auto;
        padding: 36px;
        background: linear-gradient(180deg, #FFFFFF 0%, #F7FBFF 100%);
      }
      header {
        border-bottom: 2px solid #D7E7F7;
        padding-bottom: 22px;
        margin-bottom: 26px;
      }
      .brand {
        color: #052B63;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
      h1 {
        margin: 10px 0 8px;
        color: #052B63;
        font-size: 34px;
        line-height: 1.1;
      }
      h2 {
        margin: 30px 0 12px;
        color: #052B63;
        font-size: 18px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }
      h3 { margin: 0 0 8px; color: #102A43; font-size: 15px; }
      p { margin: 8px 0; }
      .meta, .muted, .empty { color: #5D6F86; }
      .summary-grid, .rating-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }
      .summary-card, .mini-card, .record-card {
        border: 1px solid #D7E7F7;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.94);
      }
      .summary-card { padding: 14px; }
      .summary-card span, .mini-card span {
        display: block;
        color: #5D6F86;
        font-size: 11px;
        font-weight: 700;
      }
      .summary-card strong {
        display: block;
        margin-top: 4px;
        color: #052B63;
        font-size: 24px;
      }
      .record-card {
        break-inside: avoid;
        margin: 12px 0;
        padding: 16px;
      }
      .record-title-row {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: baseline;
        border-bottom: 1px solid #D7E7F7;
        padding-bottom: 8px;
        margin-bottom: 12px;
      }
      .record-title-row span { color: #5D6F86; font-size: 12px; }
      .mini-card { padding: 10px; }
      .mini-card strong {
        display: block;
        margin-top: 3px;
        color: #052B63;
        font-size: 16px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        overflow: hidden;
        border: 1px solid #D7E7F7;
        border-radius: 14px;
      }
      th {
        background: #EEF6FF;
        color: #052B63;
        font-size: 11px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      th, td {
        border-bottom: 1px solid #D7E7F7;
        padding: 10px;
        text-align: left;
        vertical-align: top;
      }
      tr:last-child td { border-bottom: 0; }
      .rating-pill {
        display: inline-flex;
        min-width: 30px;
        justify-content: center;
        border-radius: 999px;
        background: #052B63;
        color: #FFFFFF;
        padding: 3px 10px;
        font-weight: 800;
      }
      footer {
        margin-top: 34px;
        border-top: 1px solid #D7E7F7;
        padding-top: 12px;
        color: #5D6F86;
        font-size: 11px;
      }
      @media print {
        body { background: #FFFFFF; }
        .page { padding: 0; }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <header>
        <div class="brand">Best Version of Me</div>
        <h1>Self-Awareness Report</h1>
        <p class="meta">Prepared ${escapeReportHtml(generatedAt)} from your saved journal entries.</p>
      </header>

      <section class="summary-grid">
        <div class="summary-card"><span>Skills records</span><strong>${state.skillRatingSnapshots.length}</strong></div>
        <div class="summary-card"><span>Reflection weeks</span><strong>${state.reflectionWeeks.length}</strong></div>
        <div class="summary-card"><span>Mindfulness sessions</span><strong>${state.mindfulnessSessions.length}</strong></div>
      </section>

      <h2>Current Skills Rating</h2>
      <table><tbody>${skillRows}</tbody></table>

      <h2>Saved Skills Rating Records</h2>
      ${skillSnapshots}

      <h2>Self Compassion</h2>
      ${compassionRows}

      <h2>Current Self Reflection Choices</h2>
      <article class="record-card">
        <p><strong>Current reflection area:</strong> ${reportText(state.reflectionArea)}</p>
        <p><strong>Scoring scale:</strong> ${escapeReportHtml(state.reflectionScale)}</p>
        <p><strong>Number rating:</strong> ${state.reflectionNumberValue}</p>
        <p><strong>Selected words:</strong> ${reportText(state.reflectionWordTokens.join(", "))}</p>
      </article>

      <h2>Self Reflection Journal Records</h2>
      ${reflectionRecords}

      <h2>Mindfulness Practice Records</h2>
      ${mindfulnessRecords}

      <h2>Feedback</h2>
      <article class="record-card">
        <h3>Seeking feedback</h3>
        <p>${reportText(state.seekingFeedbackText)}</p>
      </article>
      <article class="record-card">
        <h3>Giving feedback</h3>
        <p>${reportText(state.givingFeedbackText)}</p>
      </article>

      <footer>Created by the Best Version of Me digital journal.</footer>
    </main>
  </body>
</html>`;
}

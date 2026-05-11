"use client";

import { useCallback, useEffect, useState } from "react";
import {
  STORAGE_KEY,
  cloneMeasuresForNextWeek,
  defaultJournalState,
  ensureCustomPoolCoversSelections,
  isMeasureRatingComplete,
  legacyWordChoiceToLabel,
  newReflectionWeekId,
  normalizeCustomWordPool,
  normalizeWordTokens,
  todayIsoDateLocal,
  weekLabelFromIndex,
  type JournalState,
  type ReflectionWeekBlock,
  type ReflectionWordChoice,
  type SelfReflectionMeasure,
  type SelfReflectionScale,
} from "@/lib/self-awareness";

function clampWordRatingIndex(
  index: number | null | undefined,
  paletteLength: number,
): number | null {
  if (index == null || paletteLength === 0) return null;
  if (typeof index !== "number" || !Number.isFinite(index)) return null;
  const ri = Math.round(index);
  if (ri < 0 || ri >= paletteLength) return null;
  return ri;
}

function isWordChoice(v: unknown): v is ReflectionWordChoice {
  return v === "rarely" || v === "sometimes" || v === "often" || v === "always";
}

function isScale(v: unknown): v is SelfReflectionScale {
  return v === "numbers" || v === "words" || v === "emojis";
}

function isIsoDate(v: unknown): v is string {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

/** Legacy single-entry shape */
function parseLegacyJournal(raw: unknown): { area: string; scale: SelfReflectionScale } | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.area !== "string" || !isScale(o.scale)) return null;
  return { area: o.area, scale: o.scale };
}

function parseMeasure(raw: unknown): SelfReflectionMeasure | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.area !== "string" || !isScale(o.scale)) return null;
  let numberValue: number | null = null;
  if (typeof o.numberValue === "number" && Number.isFinite(o.numberValue)) {
    numberValue = Math.min(10, Math.max(1, Math.round(o.numberValue)));
  }
  let wordTokens: string[] = [];
  if (Array.isArray(o.wordTokens)) {
    wordTokens = normalizeWordTokens(o.wordTokens.filter((x): x is string => typeof x === "string"));
  }
  if (wordTokens.length === 0 && isWordChoice(o.wordChoice)) {
    wordTokens = [legacyWordChoiceToLabel(o.wordChoice)];
  }
  let wordRatingIndex: number | null = null;
  if (typeof o.wordRatingIndex === "number" && Number.isFinite(o.wordRatingIndex)) {
    const ri = Math.round(o.wordRatingIndex);
    if (ri >= 0 && ri < wordTokens.length) wordRatingIndex = ri;
  }
  let emojiIndex: number | null = null;
  if (typeof o.emojiIndex === "number" && Number.isFinite(o.emojiIndex)) {
    emojiIndex = Math.max(0, Math.min(3, Math.round(o.emojiIndex)));
  }
  return {
    id: o.id,
    area: o.area,
    scale: o.scale,
    numberValue,
    wordTokens,
    wordRatingIndex,
    emojiIndex,
  };
}

function parseWeekBlock(raw: unknown): ReflectionWeekBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string") return null;
  const label = typeof o.label === "string" ? o.label : weekLabelFromIndex(0);
  const reflectionDate = isIsoDate(o.reflectionDate) ? o.reflectionDate : todayIsoDateLocal();
  const measures = Array.isArray(o.measures)
    ? o.measures.map(parseMeasure).filter((m): m is SelfReflectionMeasure => m != null)
    : [];
  const submitted = o.submitted === true;
  return { id: o.id, label, reflectionDate, measures, submitted };
}

function parseStored(raw: string | null): JournalState {
  const base = defaultJournalState();
  if (!raw) return base;
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    const ratings = { ...base.ratings, ...(data.ratings as JournalState["ratings"]) };
    if (
      ratings.feedback == null &&
      data.ratings &&
      typeof data.ratings === "object" &&
      typeof (data.ratings as Record<string, unknown>).seek_feedback === "string"
    ) {
      ratings.feedback = (data.ratings as Record<string, string>).seek_feedback;
    } else if (
      ratings.feedback == null &&
      data.ratings &&
      typeof data.ratings === "object" &&
      typeof (data.ratings as Record<string, unknown>).giving_feedback === "string"
    ) {
      ratings.feedback = (data.ratings as Record<string, string>).giving_feedback;
    } else if (
      ratings.feedback == null &&
      data.ratings &&
      typeof data.ratings === "object" &&
      typeof (data.ratings as Record<string, unknown>).honesty === "string"
    ) {
      ratings.feedback = (data.ratings as Record<string, string>).honesty;
    }
    const compassion = { ...base.compassion, ...(data.compassion as JournalState["compassion"]) };

    let reflectionArea = base.reflectionArea;
    if (typeof data.reflectionArea === "string") reflectionArea = data.reflectionArea;
    else if (Array.isArray(data.reflectionAreas)) {
      const arr = data.reflectionAreas as unknown[];
      reflectionArea = typeof arr[0] === "string" ? arr[0] : "";
    }

    let reflectionScale = base.reflectionScale;
    if (isScale(data.reflectionScale)) reflectionScale = data.reflectionScale;

    let reflectionNumberValue = base.reflectionNumberValue;
    if (typeof data.reflectionNumberValue === "number") reflectionNumberValue = data.reflectionNumberValue;
    else if (typeof data.reflectionPreviewValue === "number")
      reflectionNumberValue = data.reflectionPreviewValue;

    let reflectionWordTokens = base.reflectionWordTokens;
    if (Array.isArray(data.reflectionWordTokens)) {
      reflectionWordTokens = normalizeWordTokens(
        (data.reflectionWordTokens as unknown[]).filter((x): x is string => typeof x === "string"),
      );
    } else if (data.reflectionWordChoice === null) {
      reflectionWordTokens = [];
    } else if (isWordChoice(data.reflectionWordChoice)) {
      reflectionWordTokens = [legacyWordChoiceToLabel(data.reflectionWordChoice)];
    }

    let reflectionCustomWordPool = base.reflectionCustomWordPool;
    if (Array.isArray(data.reflectionCustomWordPool)) {
      reflectionCustomWordPool = normalizeCustomWordPool(
        (data.reflectionCustomWordPool as unknown[]).filter((x): x is string => typeof x === "string"),
      );
    }
    reflectionCustomWordPool = ensureCustomPoolCoversSelections(
      reflectionWordTokens,
      reflectionCustomWordPool,
    );

    let reflectionEmojiIndex = base.reflectionEmojiIndex;
    if (typeof data.reflectionEmojiIndex === "number" && data.reflectionEmojiIndex >= 0 && data.reflectionEmojiIndex <= 3) {
      reflectionEmojiIndex = data.reflectionEmojiIndex;
    }

    let reflectionWeeks: ReflectionWeekBlock[] = base.reflectionWeeks;
    if (Array.isArray(data.reflectionWeeks)) {
      reflectionWeeks = (data.reflectionWeeks as unknown[])
        .map(parseWeekBlock)
        .filter((w): w is ReflectionWeekBlock => w != null);
    } else if (Array.isArray(data.reflectionMeasures)) {
      const parsed = (data.reflectionMeasures as unknown[])
        .map(parseMeasure)
        .filter((m): m is SelfReflectionMeasure => m != null);
      if (parsed.length > 0) {
        reflectionWeeks = [
          {
            id: newReflectionWeekId(),
            label: weekLabelFromIndex(0),
            reflectionDate: todayIsoDateLocal(),
            measures: parsed,
            submitted: false,
          },
        ];
      }
    } else {
      const legacy = parseLegacyJournal(data.reflectionJournal);
      if (legacy) {
        reflectionWeeks = [
          {
            id: newReflectionWeekId(),
            label: weekLabelFromIndex(0),
            reflectionDate: todayIsoDateLocal(),
            measures: [
              {
                id: `migrated_${Date.now()}`,
                area: legacy.area,
                scale: legacy.scale,
                numberValue: null,
                wordTokens: ["Sometimes"],
                wordRatingIndex: null,
                emojiIndex: null,
              },
            ],
            submitted: false,
          },
        ];
      }
    }

    let seekingFeedbackText = base.seekingFeedbackText;
    if (typeof data.seekingFeedbackText === "string") seekingFeedbackText = data.seekingFeedbackText;

    let givingFeedbackText = base.givingFeedbackText;
    if (typeof data.givingFeedbackText === "string") {
      givingFeedbackText = data.givingFeedbackText;
    } else if (typeof data.honestyGivingFeedbackText === "string") {
      givingFeedbackText = data.honestyGivingFeedbackText;
    }

    let seekingFeedbackSubmitted = base.seekingFeedbackSubmitted;
    if (typeof data.seekingFeedbackSubmitted === "boolean") {
      seekingFeedbackSubmitted = data.seekingFeedbackSubmitted;
    }

    let givingFeedbackSubmitted = base.givingFeedbackSubmitted;
    if (typeof data.givingFeedbackSubmitted === "boolean") {
      givingFeedbackSubmitted = data.givingFeedbackSubmitted;
    } else if (typeof data.honestyGivingFeedbackSubmitted === "boolean") {
      givingFeedbackSubmitted = data.honestyGivingFeedbackSubmitted;
    }

    return {
      ratings,
      compassion,
      reflectionArea,
      reflectionScale,
      reflectionNumberValue,
      reflectionWordTokens,
      reflectionCustomWordPool,
      reflectionEmojiIndex,
      reflectionWeeks,
      seekingFeedbackText,
      seekingFeedbackSubmitted,
      givingFeedbackText,
      givingFeedbackSubmitted,
    } satisfies JournalState;
  } catch {
    return base;
  }
}

export function useJournalStorage() {
  const [state, setState] = useState<JournalState>(() => defaultJournalState());

  useEffect(() => {
    setState(parseStored(localStorage.getItem(STORAGE_KEY)));
  }, []);

  const commit = useCallback((next: JournalState) => {
    setState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const setRatings = useCallback(
    (updater: (r: Record<string, string | null>) => Record<string, string | null>) => {
      setState((prev) => {
        const next = { ...prev, ratings: updater(prev.ratings) };
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
        return next;
      });
    },
    [],
  );

  const setCompassion = useCallback(
    (updater: (c: Record<string, string>) => Record<string, string>) => {
      setState((prev) => {
        const next = { ...prev, compassion: updater(prev.compassion) };
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
        return next;
      });
    },
    [],
  );

  const setReflectionArea = useCallback((next: string) => {
    setState((prev) => {
      const updated = { ...prev, reflectionArea: next };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const setReflectionScale = useCallback((next: JournalState["reflectionScale"]) => {
    setState((prev) => {
      const updated = { ...prev, reflectionScale: next };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const setReflectionNumberValue = useCallback((next: number) => {
    setState((prev) => {
      const updated = { ...prev, reflectionNumberValue: next };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const setReflectionWordTokens = useCallback((next: string[]) => {
    setState((prev) => {
      const tokens = normalizeWordTokens(next);
      const updated = {
        ...prev,
        reflectionWordTokens: tokens,
        reflectionCustomWordPool: ensureCustomPoolCoversSelections(
          tokens,
          prev.reflectionCustomWordPool,
        ),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const setReflectionCustomWordPool = useCallback((next: string[]) => {
    setState((prev) => {
      const pool = normalizeCustomWordPool(next);
      const updated = {
        ...prev,
        reflectionCustomWordPool: ensureCustomPoolCoversSelections(prev.reflectionWordTokens, pool),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const setReflectionEmojiIndex = useCallback((next: number) => {
    setState((prev) => {
      const clamped = Math.max(0, Math.min(3, next));
      const updated = { ...prev, reflectionEmojiIndex: clamped };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const addReflectionMeasure = useCallback((measure: SelfReflectionMeasure) => {
    setState((prev) => {
      const weeks = [...prev.reflectionWeeks];
      const activeIdx = weeks.findIndex((w) => !w.submitted);
      if (activeIdx === -1) {
        weeks.push({
          id: newReflectionWeekId(),
          label: weekLabelFromIndex(weeks.length),
          reflectionDate: todayIsoDateLocal(),
          measures: [measure],
          submitted: false,
        });
      } else {
        const w = weeks[activeIdx]!;
        weeks[activeIdx] = { ...w, measures: [...w.measures, measure] };
      }
      const next = { ...prev, reflectionWeeks: weeks };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const removeReflectionMeasure = useCallback((id: string) => {
    setState((prev) => {
      const next = {
        ...prev,
        reflectionWeeks: prev.reflectionWeeks.map((w) => ({
          ...w,
          measures: w.measures.filter((m) => m.id !== id),
        })),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const removeReflectionWeek = useCallback((weekId: string) => {
    setState((prev) => {
      const filtered = prev.reflectionWeeks.filter((w) => w.id !== weekId);
      const reflectionWeeks = filtered.map((w, i) => ({
        ...w,
        label: weekLabelFromIndex(i),
      }));
      const next = { ...prev, reflectionWeeks };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const updateReflectionMeasure = useCallback(
    (
      id: string,
      patch: Partial<
        Pick<
          SelfReflectionMeasure,
          "area" | "numberValue" | "wordTokens" | "wordRatingIndex" | "emojiIndex"
        >
      >,
    ) => {
      setState((prev) => {
        const next = {
          ...prev,
          reflectionWeeks: prev.reflectionWeeks.map((w) => ({
            ...w,
            measures: w.measures.map((m) => {
              if (m.id !== id) return m;
              const merged = { ...m, ...patch };
              if (patch.numberValue !== undefined) {
                merged.numberValue =
                  patch.numberValue === null
                    ? null
                    : Math.min(10, Math.max(1, Math.round(patch.numberValue)));
              }
              if (patch.area !== undefined) {
                merged.area = patch.area;
              }
              if (patch.emojiIndex !== undefined) {
                merged.emojiIndex =
                  patch.emojiIndex === null
                    ? null
                    : Math.max(0, Math.min(3, Math.round(patch.emojiIndex)));
              }
              if (patch.wordTokens != null) {
                merged.wordTokens = normalizeWordTokens(patch.wordTokens);
              }
              if (patch.wordRatingIndex !== undefined) {
                merged.wordRatingIndex = patch.wordRatingIndex;
              }
              merged.wordRatingIndex = clampWordRatingIndex(
                merged.wordRatingIndex,
                merged.wordTokens.length,
              );
              return merged;
            }),
          })),
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
        return next;
      });
    },
    [],
  );

  const setReflectionWeekDate = useCallback((weekId: string, reflectionDate: string) => {
    if (!isIsoDate(reflectionDate)) return;
    setState((prev) => {
      const next = {
        ...prev,
        reflectionWeeks: prev.reflectionWeeks.map((w) =>
          w.id === weekId ? { ...w, reflectionDate } : w,
        ),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const submitReflectionWeek = useCallback((weekId: string) => {
    setState((prev) => {
      const idx = prev.reflectionWeeks.findIndex((w) => w.id === weekId);
      if (idx === -1) return prev;
      const week = prev.reflectionWeeks[idx]!;
      if (week.submitted) return prev;
      const total = week.measures.length;
      const completed = week.measures.filter(isMeasureRatingComplete).length;
      if (total === 0 || completed !== total) return prev;

      const nextMeasures = cloneMeasuresForNextWeek(week.measures);
      const weeks = prev.reflectionWeeks.map((w, i) =>
        i === idx ? { ...w, submitted: true } : w,
      );
      weeks.push({
        id: newReflectionWeekId(),
        label: weekLabelFromIndex(weeks.length),
        reflectionDate: todayIsoDateLocal(),
        measures: nextMeasures,
        submitted: false,
      });
      const next = { ...prev, reflectionWeeks: weeks };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const setSeekingFeedbackText = useCallback((next: string) => {
    setState((prev) => {
      const updated = { ...prev, seekingFeedbackText: next };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const setGivingFeedbackText = useCallback((next: string) => {
    setState((prev) => {
      const updated = { ...prev, givingFeedbackText: next };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const setSeekingFeedbackSubmitted = useCallback((submitted: boolean) => {
    setState((prev) => {
      const updated = { ...prev, seekingFeedbackSubmitted: submitted };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const setGivingFeedbackSubmitted = useCallback((submitted: boolean) => {
    setState((prev) => {
      const updated = { ...prev, givingFeedbackSubmitted: submitted };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  return {
    state,
    commit,
    setRatings,
    setCompassion,
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
    setSeekingFeedbackText,
    setGivingFeedbackText,
    setSeekingFeedbackSubmitted,
    setGivingFeedbackSubmitted,
  };
}

# Best Version of Me Design Guide

This guide is the single design reference for the Best Version of Me digital journal prototype. It covers the Self-Awareness page layout, visual style, interaction patterns, storage/report expectations, and verification checks.

## Design Direction

The Self-Awareness page should feel like one calm digital journal, not separate mini apps. It should be polished, readable, youth-friendly, and workbook-like.

The main design personality is reflective, gentle, and trustworthy. The interface should feel like a guided worksheet rather than a dashboard, exam, or marketing website.

For visual-only work, do not change content order, routing, form behavior, local storage behavior, or saved-record logic.

## Visual System

Use the project Tailwind theme tokens before hardcoded colors.

- Page background: soft blue gradient from very light blue to pale blue.
- Main text: `text-bvm-fg`.
- Muted text: `text-bvm-muted`.
- Heading text: `text-bvm-title`.
- Primary action: `bg-bvm-title`, hover `bg-bvm-accent`.
- Soft surface: `bg-white/80` to `bg-white/[0.96]`.
- Soft panel fill: `bg-bvm-softBlue/35`.
- Border: `border-bvm-border`.
- Active/strong border: `border-bvm-borderStrong`.

Avoid loud marketing layouts, heavy shadows, "card soup", unrelated saturated palettes, high-contrast neon, or generic purple AI-style gradients.

## Typography

- Body/UI font: Inter.
- Display font: Lora, for page and section titles only.
- Page section headings: centered display font, `text-bvm-title`, `tracking-[0.04em]`.
- Internal subheadings: use `JOURNAL_SUBHEADING_CLASS` where suitable.
- Body copy: use `text-bvm-fg`.
- Helper text and record metadata: use `text-bvm-muted`.

Keep hierarchy clear: page title, section title, labels, controls, then metadata.

## Canonical Layout

Use the shared panel constants from `src/lib/self-awareness.ts` for journal sections:

```tsx
import {
  JOURNAL_GLASS_BORDER,
  JOURNAL_GLASS_PANEL_BASE,
} from "@/lib/self-awareness";
```

Preferred section shell:

```tsx
<div className="mx-auto max-w-[40rem] px-5 pb-16 pt-8 sm:max-w-[42rem] sm:px-8 sm:pb-20 sm:pt-10">
  <section
    className={`relative ${JOURNAL_GLASS_PANEL_BASE} ${JOURNAL_GLASS_BORDER.sectionName}`}
    aria-labelledby={headingId}
  >
    {/* section content */}
  </section>
</div>
```

Use the matching border token from `JOURNAL_GLASS_BORDER`:

- `selfCompassion`
- `seekingFeedback`
- `givingFeedback`
- `selfReflection`
- `mindfulness`
- `skillsRating`

The combined Feedback page section may render separate Seeking Feedback and Giving Feedback panels. Keep the individual panel border tokens rather than inventing a new feedback color.

## Spacing

Use the same outer spacing rhythm as the canonical shell:

- Mobile horizontal padding: `px-5`.
- Desktop horizontal padding: `sm:px-8`.
- Top spacing: `pt-8 sm:pt-10`.
- Bottom spacing: `pb-16 sm:pb-20`.

Inside panels:

- Use `space-y-6` or `space-y-8` for major groups.
- Use `mt-3`, `mt-4`, `mt-6`, or `mt-8` for local vertical spacing.
- Avoid large standalone wrappers that create a second page inside the panel.

## Cards, Inputs, And Records

Cards inside a panel should feel lightweight. Prefer:

```tsx
className="rounded-xl border border-slate-200/80 bg-white/50"
```

For larger nested blocks, prefer:

```tsx
className="rounded-2xl border border-slate-200/80 bg-white/60"
```

Inputs and textareas should use the established frosted journal style:

```tsx
className="rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-[0.9375rem] text-slate-800 placeholder:text-slate-400 focus:border-bvm-title/50 focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
```

Saved-record areas should use:

- Empty record states: `JOURNAL_RECORDS_SHELL_CLASS`.
- Individual saved record card: `JOURNAL_RECORD_CARD_CLASS`.
- Expanded record lists should show cards directly, with spacing between cards and no extra wrapper frame.
- Repeating record areas must stay inside their parent section card.

## Collapsible Records

Saved-record areas should have a consistent collapse control.

- Use `JOURNAL_COLLAPSE_BUTTON_CLASS`.
- Show `Collapse` when expanded and `Expand` when collapsed.
- Keep `aria-expanded` on the toggle button.
- Collapsed state should not add another message panel.
- The second line should show the saved-record count.

## Buttons

Primary actions use `JOURNAL_PRIMARY_BUTTON_CLASS`.

Icon/delete actions use `JOURNAL_ICON_BUTTON_CLASS`.

Secondary pill actions can use `JOURNAL_COLLAPSE_BUTTON_CLASS`.

Buttons need visible focus styles. Disabled buttons must remain visibly disabled and non-elevated. Avoid creating a new dominant button color for each section.

## Skills Rating

Skills rating keeps the original five-tone segmented strip. Selected values must switch to deep blue with white text.

- Selected background: `#052B63`.
- Selected text: white.
- Hover styling should not leave mobile taps stuck in a hover-like visual state.

## Self-Reflection Controls

Number sliders should look like inline journal controls, not framed widgets.

- No outer slider frame.
- Thin soft-blue rail.
- Blue filled track.
- Large blue thumb with a subtle shadow.
- Ticks remain visible and tappable at small widths.

Word chips should use a pill style.

- Default: white background, blue border, deep-blue text.
- Selected: soft-blue background, stronger blue border, deep-blue text.
- Pills must wrap instead of causing horizontal overflow.

## Accessibility

- Every section component should accept `headingId` and connect it with `aria-labelledby`.
- Icon-only buttons need `aria-label`.
- Buttons should use `type="button"` unless they submit a form.
- Inputs and textareas should have labels, either visible labels or an appropriate accessible label.
- Do not remove focus styles.

## Storage And Report

All main Self-Awareness page state is stored through `src/hooks/useJournalStorage.ts` under one localStorage key:

```ts
STORAGE_KEY = "bvm_journal_v1"
```

The state shape is defined as `JournalState` in `src/lib/self-awareness.ts`. The bottom-page report should be exported from this same state with `buildSelfAwarenessReportHtml(state)`, rather than creating a second storage source.

The page should not show the report as raw Markdown. Use an `Export PDF` action that opens a print-ready report layout and lets the browser save it as PDF.

## Responsive Rules

Check these widths after Self-Awareness UI changes: 360px, 390px, 768px, 1024px, and 1440px.

- No horizontal overflow.
- Rating rows remain tappable.
- Slider thumbs remain reachable.
- Record cards stay inside their parent section card.
- Collapsed states remain readable.

## Verification

For Self-Awareness UI changes, run:

```bash
git diff --check
npm run build
```

When practical, also smoke check the page in the browser.

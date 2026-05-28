# Best Version of Me Design Guide

This guide defines the page-level design rules for the Self-Awareness digital journal. It extends `docs/self-awareness-style-guide.md` and should be followed for all Self-Awareness sections.

## Design Direction

The page uses a Soft Modern Blue journal style: calm, polished, readable, and workbook-like. It should feel like one continuous digital journal rather than separate mini apps.

Do not change content order, routing, form behavior, local storage behavior, or saved-record logic for visual-only work.

## Tokens

Use Tailwind theme tokens before hardcoded colors.

- Page background: soft blue gradient from very light blue to pale blue.
- Main text: `text-bvm-fg`.
- Muted text: `text-bvm-muted`.
- Heading text: `text-bvm-title`.
- Primary action: `bg-bvm-title`, hover `bg-bvm-accent`.
- Soft surface: `bg-white/80` to `bg-white/[0.96]`.
- Soft panel fill: `bg-bvm-softBlue/35`.
- Border: `border-bvm-border`.
- Active/strong border: `border-bvm-borderStrong`.

## Page Shell

Self-Awareness sections should use the canonical width and spacing:

```tsx
<div className="mx-auto max-w-[40rem] px-5 pb-16 pt-8 sm:max-w-[42rem] sm:px-8 sm:pb-20 sm:pt-10">
  <section className={`${JOURNAL_GLASS_PANEL_BASE} ${JOURNAL_GLASS_BORDER.sectionName}`}>
    ...
  </section>
</div>
```

The shared panel constants live in `src/lib/self-awareness.ts`.

## Typography

- Page section headings: centered display font, `text-bvm-title`, `tracking-[0.04em]`.
- Internal subheadings: use `JOURNAL_SUBHEADING_CLASS`.
- Body copy: use `text-bvm-fg`.
- Helper text and record metadata: use `text-bvm-muted`.
- Avoid adding a new heading color, font family, or uppercase style unless this guide is updated.

## Cards And Records

Nested cards should be soft and quiet:

- Empty and collapsed record states: `JOURNAL_RECORDS_SHELL_CLASS`.
- Individual saved record card: `JOURNAL_RECORD_CARD_CLASS`.
- Expanded record lists should not add another wrapper frame around the cards.
- Repeating record areas must stay inside their parent section card.

The following repeating areas must share this pattern:

- Skills rating saved records.
- Self-reflection journal records.
- Mindfulness practice records.

## Collapsible Records

Saved-record areas should have a consistent collapse control.

- Use `JOURNAL_COLLAPSE_BUTTON_CLASS`.
- Show `Collapse` when expanded and `Expand` when collapsed.
- Keep `aria-expanded` on the toggle button.
- Collapsed state should still show a small summary inside `JOURNAL_RECORDS_SHELL_CLASS`.
- Expanded state should show the saved cards directly, with only spacing between cards.

## Buttons

- Primary actions use `JOURNAL_PRIMARY_BUTTON_CLASS`.
- Icon/delete actions use `JOURNAL_ICON_BUTTON_CLASS`.
- Secondary pill actions use `JOURNAL_COLLAPSE_BUTTON_CLASS`.
- Buttons need visible `focus-visible` rings.
- Disabled buttons must remain visibly disabled and non-elevated.

## Skills Rating

Skills rating keeps the original five-tone segmented strip. Selected values must always switch to deep blue with white text:

- Selected background: `#052B63`.
- Selected text: white.
- Hover styling must use hover-capable media queries so mobile taps do not get stuck in a hover-like visual state.

## Self-Reflection Controls

Number sliders should look like an inline journal control, not a framed widget:

- No outer slider frame.
- Thin soft-blue rail.
- Blue filled track.
- Large blue thumb with a subtle shadow.
- Ticks remain visible and tappable at small widths.

Word chips should use a pill style:

- Default: white background, blue border, deep-blue text.
- Selected: soft-blue background, stronger blue border, deep-blue text.
- Pills must wrap instead of causing horizontal overflow.

## Storage And Report

All Self-Awareness page state is stored through `src/hooks/useJournalStorage.ts` under one localStorage key:

```ts
STORAGE_KEY = "bvm_journal_v1"
```

The state shape is defined as `JournalState` in `src/lib/self-awareness.ts`. The bottom-page report should be generated from this same state with `buildSelfAwarenessReport(state)`, rather than creating a second storage source.

## Responsive Rules

Check these widths after UI changes: 360px, 390px, 768px, 1024px, and 1440px.

- No horizontal overflow.
- Rating rows remain tappable.
- Slider thumbs remain reachable.
- Record cards stay inside their parent section card.
- Collapsed states remain readable.

## Verification

For changes to Self-Awareness UI, run:

```bash
git diff --check
npm run build
```

When possible, also smoke check the page in the browser at `http://localhost:3001/`.

# Self-Awareness UI Style Guide

This guide keeps the Self-Awareness journal sections visually consistent. Read it before creating or changing components under `src/components/self-awareness` or sections rendered from `src/app/page.tsx`.

## Design Goal

The Self-Awareness page should feel like one calm digital journal, not separate mini apps. Sections should use the same page width, spacing rhythm, typography, and frosted panel treatment unless there is a clear reason to deviate.

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

The combined `Feedback` page section may render separate Seeking Feedback and Giving Feedback panels side by side. In that case, keep the individual panel border tokens (`seekingFeedback` and `givingFeedback`) rather than inventing a new feedback color.

## Section Headings

Top-level navigation section headings are normally rendered by `src/app/page.tsx`. Avoid duplicating the same heading inside the component unless the section is intentionally standalone.

If a component needs an internal heading, prefer:

```tsx
className="font-display text-center text-[1.25rem] font-semibold tracking-[0.04em] text-bvm-title sm:text-[1.375rem]"
```

Subheadings inside a panel should be smaller and calmer:

```tsx
className="text-[1rem] font-semibold text-slate-800"
```

Do not introduce a new heading font, color, or uppercase style unless it is added to this guide first.

## Spacing

Use the same outer spacing rhythm as the canonical shell:

- mobile horizontal padding: `px-5`
- desktop horizontal padding: `sm:px-8`
- top spacing: `pt-8 sm:pt-10`
- bottom spacing: `pb-16 sm:pb-20`

Inside panels:

- use `space-y-6` or `space-y-8` for major groups
- use `mt-3`, `mt-4`, `mt-6`, or `mt-8` for local vertical spacing
- avoid large standalone wrappers that create a second page inside the panel

## Cards And Inputs

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

## Buttons

Primary actions:

```tsx
className="rounded-xl bg-bvm-title px-5 py-3 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-bvm-title/90 disabled:cursor-not-allowed disabled:opacity-40"
```

Secondary/edit actions:

```tsx
className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/60 hover:text-bvm-title focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
```

Avoid creating a new dominant button color for each section. Section accent colors should mostly appear in borders, small labels, or subtle backgrounds.

## Color Guidance

Use project tokens first:

- `text-bvm-title`
- `bg-bvm-title`
- `border-bvm-title/40`
- `text-slate-*`
- `bg-white/*`
- `bg-slate-*`

Use section accent colors sparingly through `JOURNAL_GLASS_BORDER`. Avoid making one section look like a separate product by adding large custom gradients, new saturated backgrounds, or unrelated color palettes.

## Accessibility

- Every section component should accept `headingId` and connect it with `aria-labelledby`.
- Icon-only buttons need `aria-label`.
- Buttons should use `type="button"` unless they submit a form.
- Inputs and textareas should have labels, either visible labels or an appropriate accessible label.
- Do not remove focus styles.

## Code Hygiene

- Do not leave temporary comments such as "matched teammates" or "TODO styling".
- Do not keep unused style fields in data objects.
- Run these checks before handing off:

```bash
git diff --check
npm run build
```

## Before Merging A New Section

Check the section against this list:

- Uses the canonical outer shell.
- Uses `JOURNAL_GLASS_PANEL_BASE` and the correct `JOURNAL_GLASS_BORDER` key.
- Uses existing typography and button styles.
- Does not duplicate the page-level heading unless needed.
- Avoids oversized nested cards or a separate dashboard layout.
- Has accessible labels for icon-only controls.
- Passes `git diff --check` and `npm run build`.

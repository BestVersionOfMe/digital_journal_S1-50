/**
 * Full-bleed intro band — sits under site header; six section links follow in {@link JournalNav}.
 */
export function SelfAwarenessHeroBanner() {
  return (
    <section
      className="relative w-full overflow-hidden border-b border-bvm-softBorder/70 bg-[linear-gradient(135deg,#EAF4FF_0%,#F7FBFF_55%,#DDEEFF_100%)]"
      aria-labelledby="sa-hero-title"
    >
      {/* Soft light pools — brand-tinted, no neon */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-30%,rgba(31,95,174,0.13),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 h-[min(22rem,50vw)] w-[min(22rem,50vw)] -translate-y-1/2 rounded-full bg-bvm-action/[0.08] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-bvm-activeBorder/30 blur-3xl"
        aria-hidden
      />
      {/* Subtle horizon line */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-[4.25rem]">
        <div className="max-w-2xl">
          <p className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-bvm-title/70 sm:text-[0.72rem]">
            Best Version of Me
          </p>
          <h1
            id="sa-hero-title"
            className="mt-3 font-display text-[clamp(1.875rem,5vw,2.875rem)] font-semibold uppercase leading-[1.06] tracking-[0.06em] text-bvm-title sm:tracking-[0.07em]"
          >
            SELF-AWARENESS
          </h1>
          <p className="mt-5 max-w-[min(28rem,100%)] text-[clamp(0.9375rem,1.15vw+0.82rem,1.0625rem)] leading-[1.78] text-bvm-muted">
            <span className="text-pretty">
              Self-awareness is understanding your thoughts, feelings, and behaviours.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

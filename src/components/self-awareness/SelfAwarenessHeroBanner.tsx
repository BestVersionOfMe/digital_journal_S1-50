/**
 * Full-bleed intro band — sits under site header; six section links follow in {@link JournalNav}.
 */
export function SelfAwarenessHeroBanner() {
  return (
    <section
      className="relative w-full overflow-hidden border-b border-bvm-borderStrong/60 bg-[linear-gradient(135deg,#DDEEFF_0%,#F7FBFF_48%,#CFE5FF_100%)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.8)]"
      aria-labelledby="sa-hero-title"
    >
      {/* Soft light pools — brand-tinted, no neon */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-30%,rgba(31,95,174,0.2),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 right-[-8%] h-44 w-[76%] rounded-[100%] border border-bvm-borderStrong/45 bg-white/45"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 h-[min(20rem,46vw)] w-[min(20rem,46vw)] -translate-y-1/2 rounded-full bg-bvm-title/[0.12] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-bvm-action/15 blur-3xl"
        aria-hidden
      />
      {/* Subtle horizon line */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 py-9 sm:px-10 sm:py-11 lg:px-14 lg:py-12">
        <div className="max-w-2xl">
          <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.32em] text-bvm-title/80 sm:text-[0.72rem]">
            Best Version of Me
          </p>
          <h1
            id="sa-hero-title"
            className="mt-3 font-display text-[clamp(2rem,5vw,3.15rem)] font-bold uppercase leading-[1.04] tracking-[0.09em] text-bvm-title drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]"
          >
            SELF-AWARENESS
          </h1>
          <p className="mt-4 max-w-[min(30rem,100%)] text-[clamp(0.9375rem,1.15vw+0.82rem,1.0625rem)] leading-[1.72] text-bvm-fg/80">
            <span className="text-pretty">
              Self-awareness is understanding your thoughts, feelings, and behaviours.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

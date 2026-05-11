import { JOURNAL_NAV_ITEMS } from "@/lib/journal-nav";

/** Four quick-jump links: full width strip directly under the hero banner. */
export function JournalNav() {
  return (
    <div className="w-full border-b border-slate-200/50 bg-gradient-to-b from-white/85 to-[#eef3f9]/95 shadow-[0_4px_24px_-12px_rgba(43,106,158,0.12)] backdrop-blur-sm">
      <nav
        className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-8 sm:py-6 lg:px-14"
        aria-label="Self-Awareness sections"
      >
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {JOURNAL_NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="flex min-h-[3rem] items-center justify-center rounded-xl border border-white/80 bg-white/70 px-2 py-2.5 text-center text-[0.65rem] font-bold uppercase leading-snug tracking-wide text-[#1a4d6e] shadow-[0_1px_0_rgba(255,255,255,0.9),inset_0_1px_0_rgba(255,255,255,0.5)] transition-all hover:border-bvm-title/25 hover:bg-white hover:text-bvm-title hover:shadow-md sm:min-h-[3.25rem] sm:px-3 sm:text-[0.7rem]"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

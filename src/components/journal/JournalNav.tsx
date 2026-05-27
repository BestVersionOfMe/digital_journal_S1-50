import { JOURNAL_NAV_ITEMS } from "@/lib/journal-nav";

/** Four quick-jump links: full width strip directly under the hero banner. */
export function JournalNav() {
  return (
    <div
      data-journal-nav
      className="w-full border-b border-bvm-softBorder/80 bg-white/[0.88] shadow-[0_8px_28px_-24px_rgba(5,43,99,0.40)] backdrop-blur-sm"
    >
      <nav
        className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-8 sm:py-6 lg:px-14"
        aria-label="Self-Awareness sections"
      >
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {JOURNAL_NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="flex min-h-[3rem] items-center justify-center rounded-full border border-bvm-softBorder bg-white/[0.88] px-2 py-2.5 text-center text-[0.65rem] font-bold uppercase leading-snug tracking-wide text-bvm-title shadow-[0_4px_14px_rgba(5,43,99,0.06)] transition-all duration-150 ease-out hover:border-bvm-title hover:bg-bvm-title hover:text-white hover:shadow-[0_8px_20px_rgba(5,43,99,0.18)] focus:outline-none focus:ring-2 focus:ring-bvm-action/20 sm:min-h-[3.25rem] sm:px-3 sm:text-[0.7rem]"
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

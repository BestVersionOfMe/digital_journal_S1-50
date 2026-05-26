"use client";

import { useEffect, useState } from "react";
import { JOURNAL_NAV_ITEMS } from "@/lib/journal-nav";

const activeLinkClass =
  "border-bvm-title/35 bg-white text-bvm-title shadow-[0_8px_22px_-18px_rgba(43,106,158,0.5)]";
const inactiveLinkClass =
  "border-transparent bg-white/55 text-slate-500 hover:border-bvm-title/20 hover:bg-white/85 hover:text-bvm-title";

export function SectionSideNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeId, setActiveId] = useState(JOURNAL_NAV_ITEMS[0]?.id ?? "");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const journalNav = document.querySelector("[data-journal-nav]");

    if (!journalNav) {
      return;
    }

    let animationFrame = 0;

    const updateVisibility = () => {
      const { bottom } = journalNav.getBoundingClientRect();
      setIsVisible(bottom <= 0 && window.scrollY > 120);
    };

    const handleScroll = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const sections = JOURNAL_NAV_ITEMS.map(({ id }) => document.getElementById(id)).filter(
      (section): section is HTMLElement => section != null,
    );

    if (sections.length === 0) {
      return;
    }

    let animationFrame = 0;

    const updateActiveSection = () => {
      const probeY = window.scrollY + 160;
      let currentSection = sections[0];

      for (const section of sections) {
        if (section.offsetTop <= probeY) {
          currentSection = section;
        }
      }

      setActiveId(currentSection.id);
    };

    const handleScroll = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <aside
      className={[
        "fixed left-[max(1rem,calc((100vw-70rem)/2))] top-1/2 z-30 hidden w-36 -translate-y-1/2 transition-all duration-200 lg:block",
        isVisible ? "pointer-events-auto translate-x-0 opacity-100" : "pointer-events-none -translate-x-3 opacity-0",
      ].join(" ")}
      aria-label="Section shortcuts"
    >
      <nav className="rounded-2xl border border-white/70 bg-white/65 p-2 shadow-[0_18px_42px_-30px_rgba(43,106,158,0.7)] backdrop-blur-md">
        <ul className="space-y-1.5">
          {JOURNAL_NAV_ITEMS.map(({ id, label }) => {
            const active = activeId === id;

            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active ? "location" : undefined}
                  className={[
                    "block rounded-xl border px-3 py-2 text-[0.68rem] font-bold uppercase leading-snug tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-bvm-title/20",
                    active ? activeLinkClass : inactiveLinkClass,
                  ].join(" ")}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={scrollToTop}
          className="mt-2 flex h-9 w-full items-center justify-center rounded-xl border border-slate-200/70 bg-white/70 text-bvm-title transition-colors hover:border-bvm-title/25 hover:bg-white focus:outline-none focus:ring-2 focus:ring-bvm-title/20"
          aria-label="Back to top"
          title="Back to top"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 19V5M6 11l6-6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </nav>
    </aside>
  );
}

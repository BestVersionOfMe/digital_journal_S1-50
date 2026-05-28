"use client";

import { useEffect, useState } from "react";
import { JOURNAL_NAV_ITEMS } from "@/lib/journal-nav";

const activeLinkClass =
  "border-bvm-title bg-bvm-title text-white shadow-[0_12px_22px_-14px_rgba(5,43,99,0.55)]";
const inactiveLinkClass =
  "border-bvm-border bg-white/[0.82] text-bvm-title hover:border-bvm-borderStrong hover:bg-white hover:text-bvm-title";

function SectionIcon({ id }: { id: string }) {
  if (id === "self-compassion") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M12 20s-6.5-3.8-8.5-8.1C2.2 9 3.7 6 6.7 6c1.7 0 3.1 1 3.9 2.2C11.4 7 12.8 6 14.5 6c3 0 4.5 3 3.2 5.9C15.7 16.2 12 20 12 20Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (id === "feedback") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M5 7.5A3.5 3.5 0 0 1 8.5 4h7A3.5 3.5 0 0 1 19 7.5v4A3.5 3.5 0 0 1 15.5 15H11l-4.5 4v-4.2A3.5 3.5 0 0 1 5 12V7.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8.5 8.5h7M8.5 11.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "self-reflection") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M5 19c4.8-.2 8.6-2.1 11.5-5.5 1.8-2.1 2.6-4.5 2.5-7.5-3 .1-5.4 1-7.5 2.7C8.1 11.5 6.2 15 5 19Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M5 19c2.7-3.8 5.6-6.4 9-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M8 12.5V6.8a1.3 1.3 0 1 1 2.6 0v5.1M10.6 11.2V5.5a1.3 1.3 0 1 1 2.6 0v6.2M13.2 11.5V7a1.3 1.3 0 1 1 2.6 0v6.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M15.8 13.6l1.2-2a1.3 1.3 0 0 1 2.3 1.2l-1.7 3.4A6 6 0 0 1 12.2 20h-.8A6.4 6.4 0 0 1 5 13.6v-2.1a1.3 1.3 0 1 1 2.6 0v1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
      <nav className="rounded-2xl border border-bvm-border bg-white/[0.82] p-2 shadow-[0_18px_42px_-30px_rgba(43,106,158,0.7)] backdrop-blur-md">
        <ul className="space-y-2">
          {JOURNAL_NAV_ITEMS.map(({ id, label }) => {
            const active = activeId === id;

            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active ? "location" : undefined}
                  className={[
                    "flex min-h-[3.25rem] items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-[0.64rem] font-bold uppercase leading-[1.1] tracking-[0.04em] transition-all focus:outline-none focus:ring-2 focus:ring-bvm-action/25",
                    active ? activeLinkClass : inactiveLinkClass,
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border",
                      active ? "border-white/20 bg-white/12" : "border-bvm-border bg-bvm-softBlue/45",
                    ].join(" ")}
                  >
                    <SectionIcon id={id} />
                  </span>
                  <span className="min-w-0">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={scrollToTop}
          className="mt-2 flex h-10 w-full items-center justify-center rounded-xl border border-bvm-border bg-white/[0.82] text-bvm-title shadow-sm transition-colors hover:border-bvm-borderStrong hover:bg-white focus:outline-none focus:ring-2 focus:ring-bvm-action/25"
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

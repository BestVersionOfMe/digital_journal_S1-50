"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

const TOP_SECTIONS: { href: string; label: string; disabled?: boolean }[] = [
  { href: "/", label: "Self-Awareness" },
  { href: "/self-management", label: "Self-Management", disabled: true },
  { href: "/social-awareness", label: "Social Awareness", disabled: true },
  { href: "/leadership", label: "Leadership", disabled: true },
];

export function SiteTopNav() {
  const pathname = usePathname();

  // Swipe hide/show logic
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Debounce threshold(防抖、防闪烁阈值): movements under 10px are ignored to avoid flickering.
      if (Math.abs(currentScrollY - lastScrollY) < 10) {
        return;
      }

      // Scroll down and move a certain distance away from the top → hide; scroll up → show.
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-3.5 lg:px-12">
          <Link
            href="/"
            className="shrink-0 font-display text-[0.95rem] font-semibold tracking-[0.06em] text-bvm-title sm:text-base"
          >
            BEST VERSION OF ME
          </Link>
          
          <nav
            className="grid grid-cols-2 sm:flex w-full sm:w-auto min-w-0 items-center justify-start sm:justify-end gap-x-4 gap-y-2.5 sm:gap-x-6 lg:gap-x-10 text-left sm:text-right"
            aria-label="Main journal areas"
          >
            {TOP_SECTIONS.map(({ href, label, disabled }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(`${href}/`);

              if (disabled) {
                return (
                  <span
                    key={href}
                    className="cursor-default whitespace-nowrap text-[0.75rem] font-medium text-slate-400 sm:text-sm block"
                    aria-disabled="true"
                  >
                    {label}
                  </span>
                );
              }

              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "whitespace-nowrap text-[0.75rem] font-medium transition-colors sm:text-sm block",
                    active
                      ? "text-bvm-title underline decoration-bvm-title/40 underline-offset-4"
                      : "text-slate-600 hover:text-bvm-title",
                  ].join(" ")}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <style dangerouslySetInnerHTML={{__html: `
        main > :first-child {
          padding-top: 130px !important; 
        }
        @media (min-width: 640px) {
          main > :first-child {
            padding-top: 76px !important;
          }
        }
      `}} />
    </>
  );
}
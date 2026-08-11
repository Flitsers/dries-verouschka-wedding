"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export type NavigationLink = {
  name: string;
  href: string;
};

type Props = {
  links?: readonly NavigationLink[];
  mobileLinks?: readonly NavigationLink[];
  mobilePrimaryLink?: NavigationLink;
  ariaLabel?: string;
};

const publicLinks = [
  { name: "Persoonlijke uitnodiging", href: "#uitnodiging" },
];

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export default function Navbar({
  links = publicLinks,
  mobileLinks = links,
  mobilePrimaryLink,
  ariaLabel = "Hoofdnavigatie",
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const mobileNavigationRef = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  const renderedScrolled = hydrated && scrolled;
  const renderedActiveSection = hydrated ? activeSection : null;

  const closeMobileNavigation = () => {
    const mobileNavigation = mobileNavigationRef.current;

    if (mobileNavigation?.matches(":popover-open")) {
      mobileNavigation.hidePopover();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const mobileNavigation = mobileNavigationRef.current;

        if (mobileNavigation?.matches(":popover-open")) {
          mobileNavigation.hidePopover();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const visibleSections = new Map<string, number>();
    const sections = links
      .map((link) => document.querySelector(link.href))
      .filter(
        (section): section is HTMLElement => section instanceof HTMLElement,
      );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        const nextSection = [...visibleSections.entries()].sort(
          ([, currentRatio], [, nextRatio]) => nextRatio - currentRatio,
        )[0]?.[0];

        if (nextSection) {
          setActiveSection((currentSection) =>
            currentSection === nextSection ? currentSection : nextSection,
          );
        }
      },
      {
        rootMargin: "-22% 0px -63% 0px",
        threshold: [0, 0.1, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [links]);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
        renderedScrolled
          ? "border-b border-white/10 bg-[#10261d]/80 shadow-[0_10px_35px_rgba(0,0,0,0.18)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label={ariaLabel}
        className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-white transition-all duration-500 md:px-8 md:py-6"
      >
        <a
          href="#top"
          className="group inline-flex items-center gap-2 text-3xl leading-none transition-colors hover:text-[#d4b06a] [font-family:var(--font-cormorant)]"
          onClick={closeMobileNavigation}
        >
          D
          <span className="text-[#d4b06a] transition-transform duration-300 group-hover:rotate-12">
            &amp;
          </span>
          V
        </a>

        <div className="hidden items-center gap-5 xl:flex 2xl:gap-7">
          {links.map((link) => {
            const isActive = renderedActiveSection === link.href.slice(1);

            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                className={`group relative py-2 text-sm tracking-wide transition-colors duration-300 ${
                  isActive
                    ? "font-medium text-[#d4b06a]"
                    : "text-white/85 hover:text-white"
                }`}
              >
                {link.name}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-[#d4b06a] transition-transform duration-300 ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            );
          })}
        </div>

        <button
          type="button"
          className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full border border-white/25 bg-black/10 text-white backdrop-blur-sm transition duration-300 hover:border-[#d4b06a] hover:text-[#d4b06a] xl:hidden"
          aria-label={mobileOpen ? "Menu sluiten" : "Menu openen"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          popoverTarget="mobile-navigation"
          popoverTargetAction="toggle"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </nav>

      <div
        ref={mobileNavigationRef}
        id="mobile-navigation"
        popover="auto"
        onToggle={(event) =>
          setMobileOpen(event.currentTarget.matches(":popover-open"))
        }
        className="mobile-navigation-panel fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-[min(23rem,90vw)] overflow-y-auto border-0 border-l border-white/10 bg-[#10261d]/97 px-7 pb-8 pt-24 text-white shadow-[-24px_0_70px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:px-9 xl:hidden"
      >
        <button
          type="button"
          aria-label="Menu sluiten"
          aria-controls="mobile-navigation"
          popoverTarget="mobile-navigation"
          popoverTargetAction="hide"
          className="absolute right-6 top-5 inline-flex min-h-12 min-w-12 items-center justify-center rounded-full border border-[#d4b06a] bg-[#d4b06a] text-[#183328] transition hover:bg-[#e2c17f]"
        >
          <X size={22} aria-hidden="true" />
        </button>

        <nav aria-label="Mobiele navigatie" className="flex min-h-full flex-col">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d4b06a]">
              Persoonlijke uitnodiging
            </p>
            <p className="mt-3 text-4xl leading-none text-[#f3ead8] [font-family:var(--font-cormorant)]">
              Waar wil je naartoe?
            </p>
          </div>

          <ol className="mt-8 border-t border-white/10">
            {mobileLinks.map((link, index) => {
              const isActive = renderedActiveSection === link.href.slice(1);

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    onClick={closeMobileNavigation}
                    className={`group flex min-h-14 items-center justify-between gap-5 border-b border-white/10 py-3 text-2xl transition [font-family:var(--font-cormorant)] ${
                      isActive
                        ? "pl-2 text-[#d4b06a]"
                        : "text-[#f8f2e8] hover:pl-2 hover:text-[#d4b06a]"
                    }`}
                  >
                    <span>{link.name}</span>
                    <span className="text-[10px] font-semibold tracking-[0.28em] text-[#d4b06a]/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>

          {mobilePrimaryLink && (
            <a
              href={mobilePrimaryLink.href}
              onClick={closeMobileNavigation}
              className="mt-8 inline-flex min-h-14 w-full items-center justify-between gap-4 rounded-full bg-[#d4b06a] px-6 py-4 font-semibold text-[#183328] shadow-[0_16px_38px_rgba(0,0,0,0.28)] transition hover:bg-[#e2c17f]"
            >
              {mobilePrimaryLink.name}
              <ArrowUpRight size={19} aria-hidden="true" />
            </a>
          )}

          <p className="mt-auto pt-10 text-xs uppercase tracking-[0.25em] text-white/35">
            Dries &amp; Verouschka · 19.12.2026
          </p>
        </nav>
      </div>
    </header>
  );
}

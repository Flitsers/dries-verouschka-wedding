"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

export type NavigationLink = {
  name: string;
  href: string;
};

type Props = {
  links?: readonly NavigationLink[];
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
  ariaLabel = "Hoofdnavigatie",
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  const renderedScrolled = hydrated && scrolled;
  const renderedOpen = hydrated && open;
  const renderedActiveSection = hydrated ? activeSection : null;

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
    const visibleSections = new Map<string, number>();
    const sections = links
      .map((link) => document.querySelector(link.href))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

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
      <nav aria-label={ariaLabel} className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-white transition-all duration-500 md:px-8 md:py-6">

        <a
          href="#top"
          className="group inline-flex items-center gap-2 text-3xl leading-none transition-colors hover:text-[#d4b06a] [font-family:var(--font-cormorant)]"
          onClick={() => setOpen(false)}
        >
          D <span className="text-[#d4b06a] transition-transform duration-300 group-hover:rotate-12">&</span> V
        </a>


        {/* Desktop menu */}
        <div className="hidden items-center gap-5 2xl:gap-7 xl:flex">

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
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            );
          })}

        </div>



        {/* Mobile button */}
        <button
          className={`rounded-full border p-2.5 transition duration-300 xl:hidden ${
            renderedOpen
              ? "border-[#d4b06a] bg-[#d4b06a] text-[#183328]"
              : "border-white/25 bg-black/10 text-white backdrop-blur-sm hover:border-[#d4b06a] hover:text-[#d4b06a]"
          }`}
          onClick={() => setOpen((current) => !current)}
          aria-label={renderedOpen ? "Menu sluiten" : "Menu openen"}
          aria-expanded={renderedOpen}
          aria-controls="mobile-navigation"
        >
          {renderedOpen ? <X size={21} /> : <Menu size={21} />}
        </button>


      </nav>

      {renderedOpen && (
        <button
          type="button"
          aria-label="Menu sluiten"
          className="fixed inset-0 z-0 bg-black/45 backdrop-blur-[2px] xl:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        id="mobile-navigation"
        aria-hidden={!renderedOpen}
        inert={!renderedOpen}
        className={`fixed right-0 top-0 z-10 h-screen w-[min(22rem,88vw)] overflow-y-auto border-l border-white/10 bg-[#10261d]/95 px-8 pb-8 pt-28 shadow-[-20px_0_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-transform duration-500 ease-out xl:hidden ${
          renderedOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        <div className="flex flex-col gap-2">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d4b06a]">
            Navigatie
          </p>

          {links.map((link) => {
            const isActive = renderedActiveSection === link.href.slice(1);

            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setOpen(false)}
                className={`group flex items-center justify-between border-b border-white/10 py-3.5 text-2xl transition sm:py-4 sm:text-3xl [font-family:var(--font-cormorant)] ${
                  isActive
                    ? "pl-2 text-[#d4b06a]"
                    : "text-white hover:pl-2 hover:text-[#d4b06a]"
                }`}
              >
                {link.name}
                <span
                  className={`text-base text-[#d4b06a] transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  ↗
                </span>
              </a>
            );
          })}

        </div>

      </div>

    </header>
  );
}

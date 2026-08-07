import { wedding } from "@/lib/wedding";

const links = [
  { label: "Ons verhaal", href: "#verhaal" },
  { label: "Onze dag", href: "#planning" },
  { label: "Locatie", href: "#locatie" },
  { label: "Praktische info", href: "#praktisch" },
  { label: "Hotels", href: "#hotels" },
  { label: "Dresscode", href: "#dresscode" },
  { label: "FAQ", href: "#faq" },
  { label: "RSVP", href: "#rsvp" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#08120d] py-20 text-center text-white md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d4b06a]/80 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#d4b06a]">
          Winter Wedding
        </p>

        <p className="mt-6 text-5xl leading-none md:text-7xl" style={{ fontFamily: "var(--font-cormorant)" }}>
          {wedding.couple.short}
        </p>

        <div className="mx-auto my-9 h-px w-20 bg-[#d4b06a]/70" />

        <p className="text-base tracking-[0.18em] text-white/70 md:text-lg">
          {wedding.event.dateText}
        </p>

        <p className="mt-6 text-sm italic text-white/50" style={{ fontFamily: "var(--font-cormorant)" }}>
          Met liefde, voor altijd.
        </p>

        <nav className="mt-12" aria-label="Footer navigatie">
          <ul className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-7 sm:gap-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors duration-300 hover:text-[#d4b06a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4b06a]"
                >
                  <span className="h-px w-0 bg-[#d4b06a] transition-all duration-300 group-hover:w-3" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-14 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.25em] text-white/35">
          {wedding.couple.short} · 19.12.2026
        </p>
      </div>
    </footer>
  );
}

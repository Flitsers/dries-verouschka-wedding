import SectionTitle from "@/components/ui/SectionTitle";
import { wedding } from "@/lib/wedding";

const guidelines = [
  "Formal / feestelijk",
  "Winter passend",
  "Elegante avondkleding",
  "Comfortabel genoeg voor diner en dans",
];

const colorSuggestions = [
  { name: "Donkergroen", swatchClass: "bg-[#183328]" },
  { name: "Champagne", swatchClass: "bg-[#d4b06a]" },
  { name: "Bordeaux", swatchClass: "bg-[#5b2634]" },
  { name: "Navy", swatchClass: "bg-[#1c2b45]" },
  { name: "Warme neutrale tinten", swatchClass: "bg-[#9a8066]" },
];

type Props = {
  includeDinnerReference?: boolean;
};

export default function WeddingDresscode({ includeDinnerReference = true }: Props) {
  const visibleGuidelines = includeDinnerReference
    ? guidelines
    : guidelines.filter((guideline) => !guideline.includes("diner"));

  return (
    <section id="dresscode" className="relative isolate overflow-hidden bg-[#183328] py-28 text-white md:py-36">
      <div className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-[#d4b06a]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="Dresscode" title="Feestelijk, stijlvol en winters" />
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <article className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 md:p-12">
              <span className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#d4b06a]/75 to-transparent" />
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#d4b06a]">
                {wedding.dresscode}
              </p>
              <p className="mt-7 max-w-xl text-xl leading-relaxed text-white/75 md:text-2xl" style={{ fontFamily: "var(--font-cormorant)" }}>
                Warme kleuren, elegante outfits en een feestelijke winterse sfeer.
              </p>

              <ul className="mt-10 divide-y divide-white/10 border-y border-white/10" aria-label="Dresscode richtlijnen">
                {visibleGuidelines.map((guideline, index) => (
                  <li key={guideline} className="flex items-center justify-between gap-6 py-4 text-white/75">
                    <span>{guideline}</span>
                    <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4b06a]/70">
                      0{index + 1}
                    </span>
                  </li>
                ))}
              </ul>
          </article>

          <aside className="flex h-full flex-col justify-center rounded-[2rem] border border-[#d4b06a]/20 bg-[#10261d]/55 p-8 md:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#d4b06a]">
                Kleurinspiratie
              </p>
              <p className="mt-5 max-w-md leading-relaxed text-white/60">
                Sfeerinspiratie voor jullie outfit — geen verplichte kleuren.
              </p>

              <ul className="mt-10 space-y-4" aria-label="Kleurinspiratie, niet verplicht">
                {colorSuggestions.map((color) => (
                  <li key={color.name} className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-0">
                    <span className={`h-9 w-9 rounded-full border border-white/15 shadow-inner ${color.swatchClass}`} aria-hidden="true" />
                    <span className="text-lg text-white/80" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {color.name}
                    </span>
                  </li>
                ))}
              </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}

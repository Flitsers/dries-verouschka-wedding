import SectionTitle from "@/components/ui/SectionTitle";
import { wedding } from "@/lib/wedding";

const guidelines = [
  "Formal / feestelijk",
  "Winter passend",
  "Elegante avondkleding",
  "Geen kerstruien",
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
          <SectionTitle eyebrow="Dresscode" title="Christmas Chic" />
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <article className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 md:p-12">
              <span className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#d4b06a]/75 to-transparent" />
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#d4b06a]">
                {wedding.dresscode}
              </p>
              <p className="mt-7 max-w-xl text-xl leading-relaxed text-white/75 md:text-2xl" style={{ fontFamily: "var(--font-cormorant)" }}>
                De outfit die je aandoet met een kerstfeestje, maar een tikkeltje eleganter.
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

        </div>
      </div>
    </section>
  );
}

import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

const milestones = [
  {
    title: "Eerste ontmoeting",
    text: "Placeholder — voeg hier later een korte herinnering toe over hoe jullie elkaar leerden kennen.",
  },
  {
    title: "Eerste date",
    text: "Placeholder — beschrijf hier later het kleine moment waarop jullie verhaal echt begon.",
  },
  {
    title: "Eerste reis samen",
    text: "Placeholder — voeg hier later een sfeerbeeld toe van een reis die jullie altijd bijblijft.",
  },
  {
    title: "Samenwonen",
    text: "Placeholder — vertel hier later over het maken van een thuis, op jullie eigen manier.",
  },
  {
    title: "Het aanzoek",
    text: "Placeholder — voeg hier later een korte, persoonlijke herinnering aan dit bijzondere moment toe.",
  },
  {
    title: "19 december 2026 — Onze trouwdag",
    text: "Placeholder — sluit hier later af met een paar woorden over de dag waarop jullie samen vieren.",
  },
];

export default function Story() {
  return (
    <section id="verhaal" className="relative isolate overflow-hidden bg-[#10261d] py-28 text-white md:py-36">
      <div className="pointer-events-none absolute -left-48 top-1/4 h-96 w-96 rounded-full bg-[#d4b06a]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-48 bottom-0 h-96 w-96 rounded-full bg-black/25 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <SectionTitle eyebrow="Ons verhaal" title="Een verhaal in zes hoofdstukken" />
            <p className="mx-auto mt-7 max-w-xl text-center text-lg leading-relaxed text-white/65">
              Een tijdlijn van momenten die later met jullie eigen woorden tot leven mag komen.
            </p>
          </div>
        </Reveal>

        <div className="relative mx-auto mt-20 max-w-5xl space-y-14 before:absolute before:bottom-4 before:left-5 before:top-4 before:w-px before:bg-gradient-to-b before:from-transparent before:via-[#d4b06a]/70 before:to-transparent md:space-y-20 md:before:left-1/2">
          {milestones.map((milestone, index) => {
            const isLeftAligned = index % 2 !== 0;

            return (
              <Reveal key={milestone.title}>
                <article className="relative grid grid-cols-[2.5rem_1fr] gap-5 md:grid-cols-[1fr_6rem_1fr] md:gap-0">
                  <div className="relative z-10 flex justify-center md:col-start-2 md:row-start-1 md:items-start">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4b06a]/60 bg-[#10261d] shadow-[0_0_0_7px_rgba(16,38,29,0.95)]">
                      <span className="h-2 w-2 rounded-full bg-[#d4b06a] shadow-[0_0_14px_rgba(212,176,106,0.8)]" />
                    </span>
                  </div>

                  <div className={`md:row-start-1 ${isLeftAligned ? "md:col-start-1 md:pr-12 md:text-right" : "md:col-start-3 md:pl-12"}`}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d4b06a]/80">
                      Hoofdstuk {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 text-4xl leading-none text-white md:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {milestone.title}
                    </h3>
                    <p className="mt-5 max-w-md leading-relaxed text-white/65 md:ml-auto">
                      {milestone.text}
                    </p>
                    <span className={`mt-7 block h-px w-16 bg-[#d4b06a]/45 ${isLeftAligned ? "md:ml-auto" : ""}`} />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

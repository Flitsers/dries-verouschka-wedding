import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

export type TimelineEvent = {
  time?: string;
  title: string;
  description?: string;
};

type Props = {
  schedule: readonly TimelineEvent[];
};

export default function WeddingDayTimeline({ schedule }: Props) {
  return (
    <section id="planning" className="relative isolate overflow-hidden bg-[#183328] py-28 text-white md:py-36">
      <div className="pointer-events-none absolute -right-48 top-1/3 h-96 w-96 rounded-full bg-[#d4b06a]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal>
          <div>
            <SectionTitle eyebrow="Onze dag" title="De planning" />
            <p className="mx-auto mt-7 max-w-xl text-center text-lg leading-relaxed text-white/65">
              Van het eerste welkom tot de laatste dans: elk moment krijgt zijn eigen plaats.
            </p>
          </div>
        </Reveal>

        <div className="relative mx-auto mt-20 max-w-5xl space-y-10 before:absolute before:bottom-4 before:left-5 before:top-4 before:w-px before:bg-gradient-to-b before:from-transparent before:via-[#d4b06a]/75 before:to-transparent md:space-y-14 md:before:left-1/2">
          {schedule.map((item, index) => {
            const isLeftAligned = index % 2 !== 0;

            return (
              <Reveal key={`${item.time ?? "zonder-tijd"}-${item.title}`}>
                <article className="relative grid grid-cols-[2.5rem_1fr] gap-5 md:grid-cols-[1fr_6rem_1fr] md:gap-0">
                  <div className="relative z-10 flex justify-center md:col-start-2 md:row-start-1 md:items-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4b06a]/60 bg-[#183328] shadow-[0_0_0_7px_rgba(24,51,40,0.95)]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#d4b06a] shadow-[0_0_16px_rgba(212,176,106,0.85)]" />
                    </span>
                  </div>

                  <div className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[#d4b06a]/50 hover:bg-white/[0.09] hover:shadow-[0_24px_55px_rgba(0,0,0,0.25)] md:row-start-1 md:p-8 ${isLeftAligned ? "md:col-start-1 md:mr-12 md:text-right" : "md:col-start-3 md:ml-12"}`}>
                    <span className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d4b06a]/75 to-transparent opacity-65 transition-opacity duration-500 group-hover:opacity-100" />
                    {item.time && (
                      <p className="font-mono text-sm font-medium text-[#d4b06a]">{item.time}</p>
                    )}
                    <h3 className="mt-4 text-4xl leading-none md:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className={`mt-5 max-w-md leading-relaxed text-white/65 ${isLeftAligned ? "md:ml-auto" : ""}`}>
                        {item.description}
                      </p>
                    )}
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

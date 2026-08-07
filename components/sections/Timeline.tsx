import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { wedding } from "@/lib/wedding";

export default function Timeline() {
  return (
    <section
      id="planning"
      className="bg-[#183328] py-32 text-white"
    >
      <div className="mx-auto max-w-5xl px-6">

        <Reveal>
          <div className="mb-20">
            <SectionTitle eyebrow="Onze dag" title="Planning" />
          </div>
        </Reveal>


        <div className="relative mx-auto max-w-4xl space-y-8 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-px before:bg-gradient-to-b before:from-transparent before:via-[#d4b06a]/70 before:to-transparent md:before:left-1/2">
          {wedding.schedule.map((event, index) => (
            <Reveal key={event.time}>
              <article className="relative grid grid-cols-[2.5rem_1fr] gap-4 md:grid-cols-[1fr_5rem_1fr] md:gap-0">
                <div className={`hidden md:flex md:items-center ${index % 2 === 0 ? "md:col-start-1 md:justify-end md:pr-8" : "md:col-start-3 md:justify-start md:pl-8"}`}>
                  <span className="rounded-full border border-[#d4b06a]/40 bg-[#d4b06a]/10 px-4 py-2 font-mono text-sm font-medium text-[#d4b06a] shadow-[0_8px_25px_rgba(0,0,0,0.18)]">
                    {event.time}
                  </span>
                </div>

                <div className="relative z-10 flex justify-center md:col-start-2 md:row-start-1 md:items-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4b06a]/60 bg-[#183328] shadow-[0_0_0_6px_rgba(24,51,40,0.9)]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#d4b06a] shadow-[0_0_16px_rgba(212,176,106,0.9)]" />
                  </span>
                </div>

                <div className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-[#d4b06a]/50 hover:bg-white/10 hover:shadow-[0_18px_45px_rgba(0,0,0,0.22)] md:row-start-1 md:p-8 ${index % 2 === 0 ? "md:col-start-3 md:ml-8" : "md:col-start-1 md:mr-8"}`}>
                  <span className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d4b06a]/70 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="text-sm font-mono font-medium text-[#d4b06a] md:hidden">
                    {event.time}
                  </span>
                  <h3 className="mt-2 text-3xl md:mt-0" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {event.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-gray-300">
                    {event.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}

        </div>

      </div>
    </section>
  );
}

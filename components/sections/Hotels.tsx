import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { wedding } from "@/lib/wedding";

export default function Hotels() {
  const hotels = [
    {
      name: wedding.hotels[0].name,
      distance: `${wedding.hotels[0].distance} van Kattebroek`,
      description:
        "Een comfortabele verblijfplaats vlak bij onze feestlocatie.",
    },
    {
      name: "Hotel in Dilbeek",
      distance: "Dicht bij de locatie",
      description:
        "Een handige optie voor gasten die graag in de buurt overnachten.",
    },
    {
      name: "Brussel",
      distance: "± 20 minuten rijden",
      description:
        "Voor wie liever kiest voor een hotel met meer faciliteiten.",
    },
  ];

  return (
    <section
      id="hotels"
      className="relative isolate overflow-hidden bg-[#10261d] py-28 text-white md:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-2/3 -translate-x-1/2 rounded-full bg-[#d4b06a]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        <Reveal>
          <div className="mb-20">
            <SectionTitle eyebrow="Overnachten" title="Hotels" />
          </div>
        </Reveal>


        <div className="grid gap-5 md:grid-cols-3 lg:gap-8">

          {hotels.map((hotel, index) => (
            <Reveal key={hotel.name}>

              <article
                className="group relative flex h-full min-h-72 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-8 shadow-[0_18px_45px_rgba(0,0,0,0.16)] backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-[#d4b06a]/50 hover:shadow-[0_28px_60px_rgba(0,0,0,0.3)] md:p-10"
              >
                <span className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d4b06a]/75 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="text-xs font-semibold tracking-[0.35em] text-[#d4b06a]/80">
                  0{index + 1}
                </span>

                <h3
                  className="mt-8 text-4xl leading-none md:text-5xl"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                  }}
                >
                  {hotel.name}
                </h3>


                <p className="mt-6 inline-flex w-fit rounded-full border border-[#d4b06a]/25 bg-[#d4b06a]/10 px-4 py-2 text-sm font-medium text-[#d4b06a]">
                  {hotel.distance}
                </p>


                <p className="mt-6 leading-relaxed text-gray-300">
                  {hotel.description}
                </p>

                <span className="mt-auto h-px w-12 translate-y-8 bg-[#d4b06a]/30 transition-all duration-500 group-hover:w-20 group-hover:bg-[#d4b06a]" />
              </article>

            </Reveal>
          ))}

        </div>

      </div>
    </section>
  );
}

import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { wedding } from "@/lib/wedding";

const accommodationOptions = [
  {
    name: wedding.hotels[0].name,
    description: "Een comfortabele verblijfplaats vlak bij onze feestlocatie.",
    distance: `${wedding.hotels[0].distance} van ${wedding.venue.name}`,
    href: "https://www.google.com/maps/search/?api=1&query=Waerboom",
  },
];

export default function WeddingHotels() {
  return (
    <section id="hotels" className="relative isolate overflow-hidden bg-[#10261d] py-28 text-white md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-2/3 -translate-x-1/2 rounded-full bg-[#d4b06a]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <SectionTitle eyebrow="Overnachten" title="Hotels & overnachten" />
            <p className="mx-auto mt-7 max-w-xl text-center text-lg leading-relaxed text-white/65">
              Voor wie na een bijzondere dag graag nog even in de buurt blijft.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-20 max-w-xl">
          {accommodationOptions.map((hotel, index) => {
            const hasHotelLink = Boolean(hotel.href);

            return (
              <Reveal key={hotel.name}>
                <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] transition duration-500 hover:-translate-y-1 hover:border-[#d4b06a]/40 hover:bg-white/[0.06]">
                  <div className="relative flex min-h-52 items-end overflow-hidden border-b border-white/10 bg-[#13271d] p-7 md:min-h-60">
                    <span className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[#d4b06a]/70 to-transparent" />
                    <span className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-[#d4b06a]/15" />
                    <span className="absolute -right-3 -top-3 h-20 w-20 rounded-full border border-[#d4b06a]/10" />
                    <p className="relative text-xs font-semibold uppercase tracking-[0.4em] text-[#d4b06a]">
                      Overnachten · 0{index + 1}
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col p-7 md:p-8">
                    <h3 className="text-4xl leading-none md:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {hotel.name}
                    </h3>
                    <p className="mt-5 leading-relaxed text-white/65">{hotel.description}</p>

                    <dl className="mt-8 space-y-4 border-y border-white/10 py-5 text-sm">
                      <div className="flex items-start justify-between gap-6">
                        <dt className="text-white/45">Locatie</dt>
                        <dd className="text-right text-[#d4b06a]">{hotel.distance}</dd>
                      </div>
                    </dl>

                    {hasHotelLink ? (
                      <a
                        href={hotel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-[#d4b06a] px-6 py-3.5 text-sm font-medium text-[#d4b06a] transition duration-300 hover:bg-[#d4b06a] hover:text-[#183328]"
                      >
                        Bekijk hotel
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        title="Beschikbaar zodra de hotelgegevens zijn aangevuld"
                        className="mt-8 inline-flex w-full cursor-not-allowed items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium text-white/40"
                      >
                        Bekijk hotel
                      </button>
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

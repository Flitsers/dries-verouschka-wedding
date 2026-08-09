import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { wedding } from "@/lib/wedding";

type HotelVisual = {
  src: string;
  alt: string;
  type: "logo" | "photo";
  background?: string;
};

const hotelVisuals: Record<string, HotelVisual> = {
  "B&B Louis 1924": {
    src: "/images/hotels/louis-1924-logo.png",
    alt: "Logo van B&B Louis 1924",
    type: "logo",
    background: "bg-[#f1eadc]",
  },
  "Gosset Hotel": {
    src: "/images/hotels/gosset-hotel-logo.webp",
    alt: "Logo van Gosset Hotel",
    type: "logo",
    background: "bg-[#efe8dc]",
  },
  "Ibis Groot-Bijgaarden": {
    src: "/images/hotels/ibis-groot-bijgaarden.webp",
    alt: "Buitenzijde van Ibis Groot-Bijgaarden",
    type: "photo",
  },
  "B&B Onsemhoeve": {
    src: "/images/hotels/onsemhoeve.jpg",
    alt: "Luchtbeeld van B&B Onsemhoeve",
    type: "photo",
  },
  "Waer Waters": {
    src: "/images/hotels/waer-waters-logo.svg",
    alt: "Logo van Waer Waters",
    type: "logo",
    background: "bg-[#183328]",
  },
};

export default function WeddingHotels() {
  return (
    <section id="hotels" className="relative isolate overflow-hidden bg-[#10261d] py-28 text-white md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-2/3 -translate-x-1/2 rounded-full bg-[#d4b06a]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <SectionTitle eyebrow="Overnachten" title="Aanbevolen overnachtingen" />
            <p className="mx-auto mt-7 max-w-xl text-center text-lg leading-relaxed text-white/65">
              Voor wie graag in de buurt overnacht, zijn er verschillende mogelijkheden in en rond Dilbeek.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-6">
          {wedding.hotels.map((hotel, index) => {
            const visual = hotelVisuals[hotel.name];

            return (
              <div
                key={hotel.name}
                className={`min-w-0 h-full xl:col-span-2 [&>div]:h-full ${index === 3 ? "xl:col-start-2" : ""}`}
              >
                <Reveal>
                  <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#173027]/85 shadow-[0_24px_80px_rgba(0,0,0,0.18)] transition duration-500 hover:-translate-y-1 hover:border-[#d4b06a]/40 hover:shadow-[0_28px_90px_rgba(212,176,106,0.09)]">
                    <div
                      className={`relative h-56 shrink-0 overflow-hidden border-b border-white/10 sm:h-60 ${visual.background ?? "bg-[#13271d]"}`}
                    >
                      <Image
                        src={visual.src}
                        alt={visual.alt}
                        fill
                        sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) 50vw, 33vw"
                        className={
                          visual.type === "photo"
                            ? "object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                            : "object-contain p-10 sm:p-12"
                        }
                      />

                      {visual.type === "photo" ? (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#10261d]/55 via-transparent to-black/5" />
                      ) : (
                        <>
                          <span className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#d4b06a]/15" />
                          <span className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-[#d4b06a]/[0.07] blur-2xl" />
                        </>
                      )}

                      <p className="absolute left-5 top-5 rounded-full border border-white/15 bg-[#10261d]/80 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#ead6a7] shadow-lg backdrop-blur-md">
                        0{index + 1}
                      </p>
                    </div>

                    <div className="flex flex-1 flex-col p-7 md:p-8">
                      <div className="flex min-w-0 items-start justify-between gap-4">
                        <h3 className="min-w-0 text-4xl leading-[0.95] md:text-[2.75rem]" style={{ fontFamily: "var(--font-cormorant)" }}>
                          {hotel.name}
                        </h3>
                        <span className="shrink-0 rounded-full border border-[#d4b06a]/30 bg-[#d4b06a]/[0.08] px-3 py-1.5 text-xs font-medium text-[#e8cc91]">
                          {hotel.distance}
                        </span>
                      </div>

                      <address className="mt-5 not-italic leading-relaxed text-white/65">
                        {hotel.address}
                        <br />
                        {hotel.postalCity}
                      </address>

                      {hotel.website && (
                        <div className="mt-auto pt-8">
                          <a
                            href={hotel.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center rounded-full border border-[#d4b06a]/75 px-6 py-3.5 text-sm font-medium text-[#e4c581] transition duration-300 hover:border-[#d4b06a] hover:bg-[#d4b06a] hover:text-[#183328] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4c581] focus-visible:ring-offset-4 focus-visible:ring-offset-[#173027]"
                          >
                            Bekijk website
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

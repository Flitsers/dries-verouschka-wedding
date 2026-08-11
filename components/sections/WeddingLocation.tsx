import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { wedding } from "@/lib/wedding";

const mapsUrl = "https://maps.app.goo.gl/JL6naH5Aq5r98jfZ6";

type Props = {
  title?: string;
  description?: string;
};

export default function WeddingLocation({
  title = "Waar we elkaar het jawoord geven",
  description = "De ceremonie, receptie en viering vinden samen plaats op deze warme, sfeervolle locatie.",
}: Props) {
  return (
    <section id="locatie" className="relative isolate overflow-hidden bg-[#10261d] py-28 text-white md:py-36">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[#d4b06a]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="Locatie" title={title} />
        </div>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <figure className="group relative min-h-[420px] overflow-hidden rounded-[2rem] border border-[#d4b06a]/25 bg-[#0b1711] shadow-[0_24px_60px_rgba(0,0,0,0.3)] md:min-h-[580px]">
              <Image
                src="/images/kattebroek.jpg"
                alt={`${wedding.venue.name}, de trouwlocatie in ${wedding.venue.city}`}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07150f]/85 via-transparent to-transparent" />
              <figcaption className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/15 bg-black/25 px-5 py-4 backdrop-blur-md md:bottom-8 md:left-8 md:right-auto">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4b06a]">Trouwlocatie</p>
                <p className="mt-2 text-2xl" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {wedding.venue.name}
                </p>
              </figcaption>
          </figure>

          <article className="relative flex h-full flex-col justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-8 shadow-[0_20px_55px_rgba(0,0,0,0.16)] backdrop-blur-xl md:p-12">
              <span className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#d4b06a]/75 to-transparent" />
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#d4b06a]">{wedding.venue.city}</p>
              <h3 className="mt-5 text-5xl leading-none md:text-6xl" style={{ fontFamily: "var(--font-cormorant)" }}>
                {wedding.venue.name}
              </h3>

              <div className="mt-8 flex items-start gap-3 border-y border-white/10 py-5 text-gray-300">
                <MapPin size={19} className="mt-0.5 shrink-0 text-[#d4b06a]" aria-hidden="true" />
                <address className="not-italic leading-relaxed">
                  {wedding.venue.address}
                  <br />
                  {wedding.venue.postalCode} {wedding.venue.city}
                </address>
              </div>

              <p className="mt-8 text-lg leading-relaxed text-gray-300">{description}</p>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d4b06a] px-8 py-4 font-medium text-[#d4b06a] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d4b06a] hover:text-[#183328] hover:shadow-[0_14px_30px_rgba(212,176,106,0.2)] sm:w-fit"
              >
                Open in Google Maps <ArrowUpRight size={17} />
              </a>
          </article>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { ArrowUpRight, MapPin, ParkingCircle, Sparkles } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { wedding } from "@/lib/wedding";

export default function Location() {
  return (
    <section id="locatie" className="relative isolate overflow-hidden bg-[#10261d] py-28 text-white md:py-32">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[#d4b06a]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-black/25 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <Reveal>
          <div>
            <SectionTitle eyebrow="Locatie" title={wedding.venue.name} />
            <p className="mt-7 text-center text-lg text-gray-300">
              {wedding.venue.address}, {wedding.venue.city}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-6 lg:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <Reveal>
            <div className="group relative min-h-[440px] overflow-hidden rounded-[2rem] border border-[#d4b06a]/25 bg-[#0b1711] shadow-[0_24px_60px_rgba(0,0,0,0.28)] md:min-h-[580px]">
              <Image
                src="/images/kattebroek.jpg"
                alt="Kattebroek, de winterse trouwlocatie van Dries en Verouschka"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07150f]/85 via-[#07150f]/10 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
              <p className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-sm text-white/90 backdrop-blur-md md:bottom-8 md:left-8">
                <MapPin size={16} className="text-[#d4b06a]" /> {wedding.venue.city}
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.03] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.16)] backdrop-blur-xl md:p-12">
              <span className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#d4b06a]/80 to-transparent" />
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#d4b06a]">
                Onze dag
              </p>
              <h3 className="mt-5 text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
                Een warme winterse setting
              </h3>
              <p className="mt-6 text-lg leading-relaxed text-gray-300">
                Op {wedding.event.dateText} vieren we samen onze mooiste dag in het
                sfeervolle {wedding.venue.name}. Een plek waar gezelligheid, warmte
                en winterse charme samenkomen.
              </p>

              <div className="mt-8 space-y-3 text-gray-300">
                <p className="flex gap-3 rounded-xl border border-white/5 bg-black/10 px-4 py-3"><Sparkles size={18} className="mt-0.5 shrink-0 text-[#d4b06a]" /> Ceremonie en feest op dezelfde locatie</p>
                <p className="flex gap-3 rounded-xl border border-white/5 bg-black/10 px-4 py-3"><ParkingCircle size={18} className="mt-0.5 shrink-0 text-[#d4b06a]" /> Parking voorzien voor onze gasten</p>
                <p className="flex gap-3 rounded-xl border border-white/5 bg-black/10 px-4 py-3"><Sparkles size={18} className="mt-0.5 shrink-0 text-[#d4b06a]" /> Dresscode: {wedding.dresscode}</p>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Kattebroekstraat%2C%20Dilbeek"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d4b06a] px-8 py-4 transition duration-300 hover:-translate-y-0.5 hover:bg-[#d4b06a] hover:text-[#183328] hover:shadow-[0_12px_30px_rgba(212,176,106,0.2)] sm:w-fit"
              >
                Route bekijken <ArrowUpRight size={17} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

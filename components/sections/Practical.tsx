import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { wedding } from "@/lib/wedding";

export default function Practical() {
  const items = [
    {
      title: "Dresscode",
      text: `${wedding.dresscode}. Warme kleuren, elegante outfits en een feestelijke winterse sfeer.`,
    },
    {
      title: "Parking",
      text: "Er is parking voorzien bij de locatie. Meer praktische informatie volgt binnenkort.",
    },
    {
      title: "Timing",
      text: "De ceremonie start om 16:00. We vragen onze gasten tijdig aanwezig te zijn.",
    },
    {
      title: "Cadeau",
      text: wedding.gift,
    },
  ];

  return (
    <section
      id="praktisch"
      className="relative isolate overflow-hidden bg-[#183328] py-28 text-white md:py-32"
    >
      <div className="pointer-events-none absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-[#d4b06a]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        <Reveal>
          <div className="mb-20">
            <SectionTitle eyebrow="Praktisch" title="Goed om te weten" />
          </div>
        </Reveal>


        <div className="grid gap-5 md:grid-cols-2 lg:gap-8">

          {items.map((item, index) => (
            <Reveal key={item.title}>

              <article
                className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-8 shadow-[0_18px_45px_rgba(0,0,0,0.14)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[#d4b06a]/45 hover:shadow-[0_24px_55px_rgba(0,0,0,0.26)] md:p-10"
              >
                <span className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d4b06a]/75 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="flex items-start justify-between gap-6">
                  <span className="text-xs font-semibold tracking-[0.35em] text-[#d4b06a]/80">
                    0{index + 1}
                  </span>
                  <span className="h-px w-12 bg-[#d4b06a]/30 transition-all duration-500 group-hover:w-20 group-hover:bg-[#d4b06a]" />
                </div>

                <h3
                  className="mt-10 text-4xl leading-none md:text-5xl"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                  }}
                >
                  {item.title}
                </h3>


                <p className="mt-6 text-lg leading-relaxed text-gray-300">
                  {item.text}
                </p>

              </article>

            </Reveal>
          ))}

        </div>

      </div>
    </section>
  );
}

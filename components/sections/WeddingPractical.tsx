import SectionTitle from "@/components/ui/SectionTitle";
import { getWeddingScheduleTime, wedding } from "@/lib/wedding";

export type PracticalItem = {
  title: string;
  text: string;
};

type Props = {
  items?: readonly PracticalItem[];
};

const defaultPracticalItems: PracticalItem[] = [
  {
    title: "Parking",
    text: "Er is parking voorzien bij de locatie. Meer praktische informatie volgt binnenkort.",
  },
  {
    title: "Aankomstuur",
    text: `De ceremonie start om ${getWeddingScheduleTime("Ceremonie")}. We vragen onze gasten tijdig aanwezig te zijn.`,
  },
  {
    title: "Dresscode",
    text: `${wedding.dresscode}. Warme kleuren, elegante outfits en een feestelijke winterse sfeer.`,
  },
  {
    title: "Kinderen",
    text: "Placeholder — voeg hier later duidelijke informatie toe over kinderen op de huwelijksdag.",
  },
  {
    title: "Cadeau",
    text: wedding.gift,
  },
  {
    title: "Toegankelijkheid",
    text: "Placeholder — voeg hier later informatie toe over toegankelijkheid en eventuele specifieke noden.",
  },
  {
    title: "Contact op de dag",
    text: "Placeholder — voeg hier later een contactpersoon en bereikbaar telefoonnummer voor de dag zelf toe.",
  },
];

export default function WeddingPractical({ items = defaultPracticalItems }: Props) {
  return (
    <section id="praktisch" className="relative isolate overflow-hidden bg-[#183328] py-28 text-white md:py-36">
      <div className="pointer-events-none absolute -left-48 bottom-0 h-96 w-96 rounded-full bg-[#d4b06a]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl">
          <SectionTitle eyebrow="Praktische info" title="Goed om te weten" />
          <p className="mx-auto mt-7 max-w-xl text-center text-lg leading-relaxed text-white/65">
            Alles wat jullie nodig hebben om zorgeloos mee te vieren.
          </p>
        </div>

        <div className="mt-20 grid gap-x-12 gap-y-0 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <article key={item.title} className="group border-t border-white/10 py-8 md:py-10">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-3xl leading-none md:text-4xl" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-semibold tracking-[0.3em] text-[#d4b06a]/70">
                    0{index + 1}
                  </span>
                </div>
                <p className="mt-5 max-w-sm leading-relaxed text-white/65 transition-colors duration-300 group-hover:text-white/85">
                  {item.text}
                </p>
                <span className="mt-6 block h-px w-10 bg-[#d4b06a]/30 transition-all duration-500 group-hover:w-16 group-hover:bg-[#d4b06a]" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

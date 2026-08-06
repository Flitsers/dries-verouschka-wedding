import Reveal from "@/components/ui/Reveal";

export default function Practical() {
  const items = [
    {
      title: "Dresscode",
      text: "Christmas Chique. Warme kleuren, elegante outfits en een feestelijke winterse sfeer.",
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
      text: "Jullie aanwezigheid is het mooiste cadeau. Wie graag iets extra geeft, kan bijdragen aan onze huwelijksreis.",
    },
  ];

  return (
    <section
      id="praktisch"
      className="bg-[#183328] py-32 text-white"
    >
      <div className="mx-auto max-w-6xl px-6">

        <Reveal>
          <div className="mb-20 text-center">

            <p className="uppercase tracking-[0.5em] text-[#d4b06a]">
              Praktisch
            </p>

            <h2
              className="mt-5 text-6xl md:text-7xl"
              style={{
                fontFamily: "var(--font-cormorant)",
              }}
            >
              Goed om te weten
            </h2>

          </div>
        </Reveal>


        <div className="grid gap-8 md:grid-cols-2">

          {items.map((item) => (
            <Reveal key={item.title}>

              <div
                className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur transition hover:bg-white/10"
              >

                <h3
                  className="text-4xl"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                  }}
                >
                  {item.title}
                </h3>


                <p className="mt-5 text-lg leading-relaxed text-gray-300">
                  {item.text}
                </p>

              </div>

            </Reveal>
          ))}

        </div>

      </div>
    </section>
  );
}
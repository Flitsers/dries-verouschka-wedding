import Reveal from "@/components/ui/Reveal";

export default function Location() {
  return (
    <section
      className="bg-[#10261d] py-32 text-white"
      id="locatie"
    >
      <div className="mx-auto max-w-6xl px-6">

        <Reveal>
          <div className="text-center">

            <p className="uppercase tracking-[0.5em] text-[#d4b06a]">
              Locatie
            </p>

            <h2
              className="mt-5 text-6xl md:text-7xl"
              style={{
                fontFamily: "var(--font-cormorant)",
              }}
            >
              Kattebroek
            </h2>

            <p className="mt-8 text-xl text-gray-300">
              Kattebroekstraat
              <br />
              Dilbeek
            </p>

          </div>
        </Reveal>


        <div className="mt-16 grid items-stretch gap-10 md:grid-cols-2">

          <Reveal>

            <div className="group overflow-hidden rounded-3xl border border-[#d4b06a]/20">

              <img
                src="/images/kattebroek.jpg"
                alt="Kattebroek winter wedding locatie"
                className="h-full min-h-[500px] w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            </div>

          </Reveal>


          <Reveal>

            <div className="flex flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur">

              <p className="uppercase tracking-[0.4em] text-[#d4b06a]">
                Onze dag
              </p>

              <h3
                className="mt-5 text-5xl"
                style={{
                  fontFamily: "var(--font-cormorant)",
                }}
              >
                Een warme winterse setting
              </h3>


              <p className="mt-6 text-lg leading-relaxed text-gray-300">
                Op 19 december 2026 vieren we samen onze mooiste dag
                in het sfeervolle Kattebroek. Een plek waar gezelligheid,
                warmte en winterse charme samenkomen.
              </p>


              <div className="mt-8 space-y-3 text-gray-300">

                <p>
                  ✦ Ceremonie en feest op dezelfde locatie
                </p>

                <p>
                  ✦ Parking voorzien
                </p>

                <p>
                  ✦ Dresscode: Christmas Chique
                </p>

              </div>


              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex w-fit rounded-full border border-[#d4b06a] px-8 py-4 transition hover:bg-[#d4b06a] hover:text-[#183328]"
              >
                Route bekijken
              </a>

            </div>

          </Reveal>

        </div>

      </div>
    </section>
  );
}
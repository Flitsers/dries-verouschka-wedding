import Reveal from "@/components/ui/Reveal";

export default function RSVP() {
  return (
    <section
      id="rsvp"
      className="bg-[#183328] py-32 text-white"
    >
      <div className="mx-auto max-w-4xl px-6">

        <Reveal>
          <div className="text-center">

            <p className="uppercase tracking-[0.5em] text-[#d4b06a]">
              RSVP
            </p>

            <h2
              className="mt-5 text-6xl md:text-7xl"
              style={{
                fontFamily: "var(--font-cormorant)",
              }}
            >
              Laat ons weten
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-300">
              We kijken er enorm naar uit om samen met jullie
              onze mooiste dag te vieren.
            </p>

          </div>
        </Reveal>


        <Reveal>

          <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur">

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label className="text-sm text-gray-300">
                  Naam
                </label>

                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
                  placeholder="Voor- en achternaam"
                />
              </div>


              <div>
                <label className="text-sm text-gray-300">
                  E-mail
                </label>

                <input
                  type="email"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
                  placeholder="jouw@email.be"
                />
              </div>

            </div>


            <div className="mt-6">

              <label className="text-sm text-gray-300">
                Aanwezigheid
              </label>

              <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
              >
                <option>
                  Wij komen graag
                </option>

                <option>
                  Helaas kunnen wij niet komen
                </option>

              </select>

            </div>


            <div className="mt-6">

              <label className="text-sm text-gray-300">
                Bericht of dieetwensen
              </label>

              <textarea
                className="mt-2 h-32 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
                placeholder="Laat hier iets weten..."
              />

            </div>


            <button
              className="mt-8 rounded-full border border-[#d4b06a] px-10 py-4 transition hover:bg-[#d4b06a] hover:text-[#183328]"
            >
              Versturen
            </button>


          </div>

        </Reveal>

      </div>
    </section>
  );
}
"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { submitRSVP } from "@/app/actions/rsvp";

export default function RSVP() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);


  async function handleSubmit(formData: FormData) {
    setLoading(true);

    try {
      await submitRSVP(formData);
      setSent(true);
    } catch (error) {
      alert("Er ging iets mis. Probeer opnieuw.");
    }

    setLoading(false);
  }


  if (sent) {
    return (
      <section
        id="rsvp"
        className="bg-[#183328] py-32 text-center text-white"
      >
        <h2
          className="text-6xl"
          style={{
            fontFamily: "var(--font-cormorant)",
          }}
        >
          Bedankt!
        </h2>

        <p className="mt-6 text-lg text-gray-300">
          Jullie antwoord is goed ontvangen.
        </p>

      </section>
    );
  }


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

          <form
            action={handleSubmit}
            className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur"
          >


            <div className="grid gap-6 md:grid-cols-2">


              <div>

                <label className="text-sm text-gray-300">
                  Naam
                </label>

                <input
                  name="name"
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
                  placeholder="Voor- en achternaam"
                />

              </div>



              <div>

                <label className="text-sm text-gray-300">
                  E-mail
                </label>

                <input
                  name="email"
                  type="email"
                  required
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
                name="attending"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
              >

                <option value="Ja">
                  Wij komen graag
                </option>


                <option value="Nee">
                  Helaas kunnen wij niet komen
                </option>


              </select>

            </div>




            <div className="mt-6">

              <label className="text-sm text-gray-300">
                Aantal personen
              </label>


              <input
                name="guests_count"
                type="number"
                min="1"
                defaultValue="2"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
              />

            </div>




            <div className="mt-6">

              <label className="text-sm text-gray-300">
                Bericht of dieetwensen
              </label>


              <textarea
                name="message"
                className="mt-2 h-32 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
                placeholder="Laat hier iets weten..."
              />

            </div>




            <button
              disabled={loading}
              className="mt-8 rounded-full border border-[#d4b06a] px-10 py-4 transition hover:bg-[#d4b06a] hover:text-[#183328] disabled:opacity-50"
            >

              {loading ? "Versturen..." : "Versturen"}

            </button>



          </form>

        </Reveal>


      </div>
    </section>
  );
}
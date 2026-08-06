import Reveal from "@/components/ui/Reveal";

export default function Hotels() {
  const hotels = [
    {
      name: "Waerboom",
      distance: "2 minuten van Kattebroek",
      description:
        "Een comfortabele verblijfplaats vlak bij onze feestlocatie.",
    },
    {
      name: "Hotel in Dilbeek",
      distance: "Dicht bij de locatie",
      description:
        "Een handige optie voor gasten die graag in de buurt overnachten.",
    },
    {
      name: "Brussel",
      distance: "± 20 minuten rijden",
      description:
        "Voor wie liever kiest voor een hotel met meer faciliteiten.",
    },
  ];

  return (
    <section
      id="hotels"
      className="bg-[#10261d] py-32 text-white"
    >
      <div className="mx-auto max-w-6xl px-6">

        <Reveal>
          <div className="mb-20 text-center">

            <p className="uppercase tracking-[0.5em] text-[#d4b06a]">
              Overnachten
            </p>

            <h2
              className="mt-5 text-6xl md:text-7xl"
              style={{
                fontFamily: "var(--font-cormorant)",
              }}
            >
              Hotels
            </h2>

          </div>
        </Reveal>


        <div className="grid gap-8 md:grid-cols-3">

          {hotels.map((hotel) => (
            <Reveal key={hotel.name}>

              <div
                className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition duration-300 hover:bg-white/10"
              >

                <h3
                  className="text-4xl"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                  }}
                >
                  {hotel.name}
                </h3>


                <p className="mt-4 text-[#d4b06a]">
                  {hotel.distance}
                </p>


                <p className="mt-5 text-gray-300">
                  {hotel.description}
                </p>


              </div>

            </Reveal>
          ))}

        </div>

      </div>
    </section>
  );
}
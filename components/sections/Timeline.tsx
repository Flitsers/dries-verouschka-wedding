import Reveal from "@/components/ui/Reveal";

export default function Timeline() {
  const events = [
    {
      time: "16:00",
      title: "Ceremonie",
      text: "Het moment waarop onze dag echt begint.",
    },
    {
      time: "17:00",
      title: "Receptie",
      text: "Samen klinken op liefde, familie en vriendschap.",
    },
    {
      time: "19:00",
      title: "Diner",
      text: "Een gezellig diner met onze favoriete mensen.",
    },
    {
      time: "22:00",
      title: "Feest",
      text: "Tijd om samen te dansen en te vieren.",
    },
  ];

  return (
    <section
      id="planning"
      className="bg-[#183328] py-32 text-white"
    >
      <div className="mx-auto max-w-5xl px-6">

        <Reveal>
          <div className="mb-20 text-center">

            <p className="uppercase tracking-[0.5em] text-[#d4b06a]">
              Onze dag
            </p>

            <h2
              className="mt-5 text-6xl md:text-7xl"
              style={{
                fontFamily: "var(--font-cormorant)",
              }}
            >
              Planning
            </h2>

          </div>
        </Reveal>


        <div className="space-y-8">

          {events.map((event, index) => (
            <Reveal key={event.time}>

              <div
                className="flex items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:bg-white/10"
              >

                <div className="text-3xl text-[#d4b06a]">
                  {event.time}
                </div>

                <div>

                  <h3 className="text-3xl">
                    {event.title}
                  </h3>

                  <p className="mt-2 text-gray-300">
                    {event.text}
                  </p>

                </div>

              </div>

            </Reveal>
          ))}

        </div>

      </div>
    </section>
  );
}
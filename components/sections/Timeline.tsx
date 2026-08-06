export default function Timeline() {
  const items = [
    { time: "16:00", title: "Ceremonie", icon: "💍" },
    { time: "17:00", title: "Receptie", icon: "🥂" },
    { time: "19:00", title: "Diner", icon: "🍽️" },
    { time: "22:00", title: "Feest", icon: "🎉" },
    { time: "05:00", title: "Einde", icon: "❤️" },
  ];

  return (
    <section className="bg-[#183328] py-28 text-white">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-center uppercase tracking-[0.5em] text-[#d4b06a]">
          Onze dag
        </p>

        <h2
          className="mt-4 text-center text-6xl"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Planning
        </h2>

        <div className="mt-20 space-y-8">
          {items.map((item) => (
            <div
              key={item.time}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur"
            >
              <div className="text-5xl">{item.icon}</div>

              <div className="flex-1 px-8">
                <h3 className="text-2xl font-semibold">{item.title}</h3>
              </div>

              <div className="text-3xl font-bold text-[#d4b06a]">
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
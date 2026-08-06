import Countdown from "./Countdown";

export default function Hero() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/hero.jpg')",
      }}
    >
      {/* Donkere overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/70"></div>

      {/* Inhoud */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center text-white">
        <p className="mb-6 text-sm uppercase tracking-[0.6em] text-[#d4b06a]">
          Winter Wedding
        </p>

        <h1
          className="text-7xl font-semibold leading-tight md:text-9xl"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Dries
          <br />
          <span className="text-[#d4b06a]">&amp;</span>
          <br />
          Verouschka
        </h1>

        <p className="mt-10 text-xl">
          19 december 2026
        </p>

        <Countdown />

        <button className="mt-12 rounded-full border border-[#d4b06a] bg-[#d4b06a] px-10 py-4 font-semibold text-[#183328] transition-all duration-300 hover:scale-105 hover:bg-transparent hover:text-[#d4b06a]">
          Bekijk onze uitnodiging
        </button>
      </div>
    </section>
  );
}
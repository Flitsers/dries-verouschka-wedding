export default function Home() {
  return (
    <main className="min-h-screen bg-[#183328] text-white">

      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">

        <p className="mb-4 uppercase tracking-[0.5em] text-[#d4b06a]">
          Winter Wedding
        </p>

        <h1 className="text-6xl font-light leading-tight md:text-8xl">
          Dries
          <br />
          <span className="text-[#d4b06a]">&amp;</span>
          <br />
          Verouschka
        </h1>

        <p className="mt-8 text-xl text-gray-200">
          19 december 2026
        </p>

        <button className="mt-12 rounded-full bg-[#d4b06a] px-10 py-4 font-semibold text-[#183328] transition hover:scale-105">
          Bekijk onze uitnodiging
        </button>

      </section>

    </main>
  );
}
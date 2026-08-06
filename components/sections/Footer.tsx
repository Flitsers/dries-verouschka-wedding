export default function Footer() {
  return (
    <footer className="bg-black py-20 text-center text-white">

      <div className="mx-auto max-w-4xl px-6">

        <p
          className="text-5xl"
          style={{
            fontFamily: "var(--font-cormorant)",
          }}
        >
          Dries & Verouschka
        </p>


        <div className="mx-auto my-8 h-px w-24 bg-[#d4b06a]" />


        <p className="text-sm uppercase tracking-[0.5em] text-[#d4b06a]">
          Winter Wedding
        </p>


        <p className="mt-5 text-gray-400">
          19 december 2026
        </p>


        <p className="mt-10 text-sm text-gray-500">
          Bedankt om samen met ons deze bijzondere dag te vieren.
        </p>

      </div>

    </footer>
  );
}
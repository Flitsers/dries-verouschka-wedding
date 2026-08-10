import Button from "../ui/Button";
import { wedding } from "@/lib/wedding";

const snowflakes = Array.from({ length: 45 }, (_, index) => ({
  id: index,
  left: ((index * 37) % 100) + "%",
  size: 3 + (index % 5),
  duration: 10 + (index % 7),
  delay: (index % 8) * 0.8,
  opacity: 0.35 + (index % 4) * 0.15,
}));

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[700px] items-center justify-center overflow-hidden bg-cover bg-[position:58%_center] sm:min-h-[720px] sm:bg-center md:min-h-screen"
      style={{
        backgroundImage: "url('/images/hero.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Luxury gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07150f]/80 via-black/15 to-[#183328]" />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)]" />

      {/* Ambient light */}
      <div className="pointer-events-none absolute -right-32 top-1/4 h-72 w-72 rounded-full bg-[#d4b06a]/10 blur-3xl animate-pulse md:h-96 md:w-96" />

      {/* Snow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {snowflakes.map((flake) => (
          <span
            key={flake.id}
            className="snowflake absolute rounded-full bg-white"
            style={{
              left: flake.left,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
              opacity: flake.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-5 pb-16 pt-24 text-center text-white sm:px-8 sm:pb-20 sm:pt-32 md:pt-36">
        <div className="w-full">
          <div className="flex w-full flex-col items-center">
            <p className="mb-6 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d4b06a] sm:mb-8 sm:tracking-[0.75em] md:text-xs">
              <span className="h-px w-7 bg-[#d4b06a]/75" />
              Winter Wedding
              <span className="h-px w-7 bg-[#d4b06a]/75" />
            </p>

            <h1
              className="w-full max-w-[26rem] leading-[0.84] tracking-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.65)] sm:max-w-none"
              style={{
                fontFamily: "var(--font-cormorant)",
              }}
            >
              <span className="block break-words text-[clamp(2.25rem,9.5vw,8.125rem)] font-light">
                {wedding.couple.groom}
              </span>

              <span className="my-3 block text-4xl text-[#d4b06a] sm:my-5 sm:text-6xl md:text-8xl">
                &
              </span>

              <span className="block break-words text-[clamp(2.25rem,9.5vw,8.125rem)] font-light">
                {wedding.couple.bride}
              </span>
            </h1>
          </div>
        </div>

        <div className="w-full">
          <div className="flex w-full flex-col items-center">
            <div className="mt-8 flex w-full items-center justify-center gap-3 text-white/90 sm:mt-10 md:gap-4">
              <div className="h-px w-6 bg-[#d4b06a] sm:w-10" />
              <p className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] sm:text-sm sm:tracking-[0.35em] md:text-xl">
                {wedding.event.dateText}
              </p>
              <div className="h-px w-6 bg-[#d4b06a] sm:w-10" />
            </div>

            <div className="mt-8 flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:mt-11 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4 [&>a]:inline-flex [&>a]:justify-center [&>a]:shadow-[0_14px_35px_rgba(0,0,0,0.25)] sm:[&>a]:min-w-52">
              <Button href="#uitnodiging" variant="secondary">
                Persoonlijke uitnodiging
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-white/70 sm:block">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.6em]">
            Scroll
          </span>

          <div className="relative h-12 w-px overflow-hidden bg-white/20">
            <span className="absolute left-0 top-0 h-4 w-px animate-pulse bg-[#d4b06a]" />
          </div>
        </div>
      </div>
    </section>
  );
}

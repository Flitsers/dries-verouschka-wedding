import Countdown from "@/components/sections/Countdown";
import { wedding } from "@/lib/wedding";

type Props = {
  code: string;
  familyName: string;
  allowedGuests: number;
  countdownTargetTimestamp: number;
  countdownInitialTimestamp: number;
  answered: boolean;
};

const snowflakes = Array.from({ length: 45 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  size: 3 + (index % 5),
  duration: 10 + (index % 7),
  delay: (index % 8) * 0.8,
  opacity: 0.35 + (index % 4) * 0.15,
}));

export default function PersonalizedHero({
  code,
  familyName,
  allowedGuests,
  countdownTargetTimestamp,
  countdownInitialTimestamp,
  answered,
}: Props) {
  const plural = allowedGuests === 2;

  return (
    <section
      id="top"
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-[position:58%_center] px-5 pb-20 pt-28 text-center text-white sm:bg-center sm:px-8 sm:pb-24 sm:pt-36"
      style={{ backgroundImage: "url('/images/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07150f]/85 via-black/25 to-[#183328]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.5)_100%)]" />
      <div className="pointer-events-none absolute -right-32 top-1/4 h-72 w-72 animate-pulse rounded-full bg-[#d4b06a]/10 blur-3xl md:h-96 md:w-96" />

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

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#d4b06a] sm:text-xs sm:tracking-[0.55em]">
            Persoonlijke uitnodiging
          </p>

          <h1
            className="mt-6 text-[clamp(3rem,12vw,8.5rem)] font-light leading-[0.82] tracking-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.65)]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {wedding.couple.short}
          </h1>

          <div className="mx-auto mt-8 flex max-w-lg items-center justify-center gap-3 text-white/90 sm:mt-10 md:gap-4">
            <div className="h-px w-5 bg-[#d4b06a] sm:w-10" />
            <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.16em] sm:text-sm sm:tracking-[0.3em]">
              {wedding.event.dateText}
            </p>
            <div className="h-px w-5 bg-[#d4b06a] sm:w-10" />
          </div>

          <div className="mx-auto mt-10 max-w-2xl rounded-[1.75rem] border border-white/15 bg-[#10261d]/35 px-4 py-7 shadow-[0_20px_55px_rgba(0,0,0,0.25)] backdrop-blur-md sm:px-8 sm:py-9">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d4b06a]">Voor</p>
            <p
              className="mt-3 max-w-full [overflow-wrap:anywhere] text-[clamp(2.25rem,10vw,5rem)] leading-[0.95]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {familyName}
            </p>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
              {plural
                ? "Deze uitnodiging is geldig voor 2 personen."
                : "Deze uitnodiging is persoonlijk voor jou."}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[34rem] sm:mt-10">
          <Countdown
            targetTimestamp={countdownTargetTimestamp}
            initialTimestamp={countdownInitialTimestamp}
          />
        </div>

        <div className="mx-auto mt-9 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center">
          <a
            href={`/i/${code}/rsvp`}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d4b06a] px-7 py-3.5 text-sm font-semibold text-[#183328] shadow-[0_14px_35px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e2c17f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5d998]"
          >
            {answered ? "Antwoord bekijken of wijzigen" : "Bevestig aanwezigheid"}
          </a>
          <a
            href="#planning"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d4b06a] px-7 py-3.5 text-sm font-medium text-[#d4b06a] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d4b06a] hover:text-[#183328] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5d998]"
          >
            {plural ? "Ontdek jullie uitnodiging" : "Ontdek je uitnodiging"}
          </a>
        </div>
      </div>
    </section>
  );
}

import Reveal from "@/components/ui/Reveal";
import Countdown from "./Countdown";
import Button from "../ui/Button";
import { wedding } from "@/lib/wedding";

export default function Hero() {
  const snowflakes = Array.from({ length: 45 });

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/hero.jpg')",
      }}
    >

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />


      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-[#183328]" />


      {/* Falling snow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {snowflakes.map((_, index) => (
          <span
            key={index}
            className="snowflake absolute rounded-full bg-white/80"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 8 + 8}s`,
              animationDelay: `${Math.random() * 8}s`,
              width: `${Math.random() * 5 + 3}px`,
              height: `${Math.random() * 5 + 3}px`,
              opacity: Math.random() * 0.5 + 0.4,
            }}
          />
        ))}

      </div>



      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center text-white">

        <Reveal>

          <p className="mb-8 text-sm uppercase tracking-[0.7em] text-[#d4b06a]">
            Winter Wedding
          </p>


          <h1
            className="leading-none drop-shadow-2xl"
            style={{
              fontFamily: "var(--font-cormorant)",
            }}
          >

            <span className="block text-7xl font-light md:text-[130px]">
              {wedding.couple.groom}
            </span>


            <span className="my-5 block text-6xl text-[#d4b06a] md:text-8xl">
              &
            </span>


            <span className="block text-7xl font-light md:text-[130px]">
              {wedding.couple.bride}
            </span>

          </h1>

        </Reveal>



        <Reveal>

          <p className="mt-10 text-xl tracking-[0.15em] text-white/90">
            {wedding.event.dateText}
          </p>


          <Countdown />


          <div className="mt-12">
            <Button href="#planning">
              Bekijk onze dag
            </Button>
          </div>


        </Reveal>

      </div>



      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70">

        <div className="flex flex-col items-center gap-3">

          <span className="text-xs uppercase tracking-[0.5em]">
            Scroll
          </span>

          <div className="h-10 w-px bg-[#d4b06a]" />

        </div>

      </div>


    </section>
  );
}
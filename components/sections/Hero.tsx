import Countdown from "./Countdown";
import Button from "../ui/Button";
import { wedding } from "@/lib/wedding";

export default function Hero() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/hero.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/70"></div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center text-white">
        <p className="mb-6 text-sm uppercase tracking-[0.6em] text-[#d4b06a]">
          Winter Wedding
        </p>

        <h1
          className="text-7xl font-semibold leading-tight md:text-9xl"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {wedding.couple.groom}
          <br />
          <span className="text-[#d4b06a]">&amp;</span>
          <br />
          {wedding.couple.bride}
        </h1>

        <p className="mt-10 text-xl">
          {wedding.event.dateText}
        </p>

        <Countdown />

        <div className="mt-12">
          <Button>Bekijk onze uitnodiging</Button>
        </div>
      </div>
    </section>
  );
}
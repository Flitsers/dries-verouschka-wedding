type Props = {
  allowedGuests: number;
  attendingGuests: number | null;
};

export default function RSVPConfirmation({ allowedGuests, attendingGuests }: Props) {
  const possessivePronoun = allowedGuests === 1 ? "je" : "jullie";
  const message = attendingGuests === null
    ? `We hebben ${possessivePronoun} antwoord ontvangen.`
    : attendingGuests > 0
      ? `Bedankt voor ${possessivePronoun} antwoord. We kijken ernaar uit om samen te vieren.`
      : "Bedankt om ons iets te laten weten.";

  return (
    <section className="relative flex items-center justify-center overflow-hidden px-0 py-4 text-white">
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-[#d4b06a]/5 blur-3xl" />
      <div className="relative w-full max-w-xl rounded-[2rem] border border-[#d4b06a]/20 bg-gradient-to-br from-white/[0.09] to-white/[0.03] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#d4b06a]">RSVP ontvangen</p>
        <h1 className="mt-4 text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>Bedankt!</h1>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-gray-300">
          {message}
        </p>
      </div>
    </section>
  );
}

export default function InvitationAccess() {
  return (
    <section
      id="uitnodiging"
      className="relative isolate overflow-hidden bg-[#183328] px-5 py-28 text-center text-white sm:px-6 md:py-36"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4b06a]/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl rounded-[2rem] border border-[#d4b06a]/20 bg-gradient-to-br from-white/[0.08] to-white/[0.03] px-6 py-12 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:px-10 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.42em] text-[#d4b06a]">
          Voor onze genodigden
        </p>
        <h2
          className="mt-5 text-5xl leading-none sm:text-6xl"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Jullie persoonlijke uitnodiging
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-white/65">
          Hebben jullie een persoonlijke uitnodiging ontvangen? Scan de QR-code
          op jullie kaart of open de unieke link om alle informatie te bekijken
          en te RSVP&apos;en.
        </p>
      </div>
    </section>
  );
}

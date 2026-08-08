import Link from "next/link";
import RSVPConfirmation from "@/components/rsvp/RSVPConfirmation";
import { wedding } from "@/lib/wedding";

type InvitationType = "full_day" | "reception_plus" | "evening_only";

type Props = {
  code: string;
  familyName: string;
  allowedGuests: number;
  invitationType: InvitationType;
  answered: boolean;
  attendingGuests: number | null;
};

type EventItem = {
  title: string;
  time?: string;
  description?: string;
};

const ceremony = wedding.schedule.find((event) => event.title === "Ceremonie")!;
const reception = wedding.schedule.find((event) => event.title === "Receptie")!;
const dinner = wedding.schedule.find((event) => event.title === "Diner")!;
const party = wedding.schedule.find((event) => event.title === "Feest")!;

const eventsByInvitationType: Record<InvitationType, EventItem[]> = {
  full_day: [
    { title: "Stadhuis" },
    { title: "Ceremonie", time: ceremony.time, description: ceremony.description },
    { title: "Dagsreceptie", time: reception.time, description: reception.description },
    { title: "Diner", time: dinner.time, description: dinner.description },
    { title: "Avondfeest", time: party.time, description: party.description },
  ],
  reception_plus: [
    { title: "Dagsreceptie", time: reception.time, description: reception.description },
    { title: "Diner", time: dinner.time, description: dinner.description },
    { title: "Avondfeest", time: party.time, description: party.description },
  ],
  evening_only: [
    { title: "Avondreceptie" },
    { title: "Avondfeest", time: party.time, description: party.description },
  ],
};

export default function PersonalizedInvitation({
  code,
  familyName,
  allowedGuests,
  invitationType,
  answered,
  attendingGuests,
}: Props) {
  const visibleEvents = eventsByInvitationType[invitationType];
  const practicalItems = [
    {
      title: "Parking",
      text: "Er is parking voorzien bij de locatie. Meer praktische informatie volgt binnenkort.",
    },
    ...(invitationType === "full_day"
      ? [{ title: "Aankomstuur", text: "De ceremonie start om 16:00. We vragen onze gasten tijdig aanwezig te zijn." }]
      : []),
    {
      title: "Dresscode",
      text: `${wedding.dresscode}. Warme kleuren, elegante outfits en een feestelijke winterse sfeer.`,
    },
    {
      title: "Overnachten",
      text: `${wedding.hotels[0].name} ligt op ongeveer ${wedding.hotels[0].distance} van ${wedding.venue.name}.`,
    },
    {
      title: "Cadeau",
      text: wedding.gift,
    },
  ];

  return (
    <main id="top" className="min-h-screen overflow-x-hidden bg-[#183328] text-white">
      <nav aria-label="Navigatie persoonlijke uitnodiging" className="sticky top-0 z-30 border-b border-white/10 bg-[#10261d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-4 sm:px-6">
          <a href="#top" className="text-2xl text-white" style={{ fontFamily: "var(--font-cormorant)" }}>D <span className="text-[#d4b06a]">&amp;</span> V</a>
          <div className="flex items-center gap-3 text-xs text-white/65 sm:gap-6 sm:text-sm">
            <a href="#planning" className="transition hover:text-[#d4b06a]">Onze dag</a>
            <a href="#locatie" className="hidden transition hover:text-[#d4b06a] sm:inline">Locatie</a>
            <a href="#praktisch" className="transition hover:text-[#d4b06a]">Praktisch</a>
            <a href="#rsvp" className="transition hover:text-[#d4b06a]">RSVP</a>
          </div>
        </div>
      </nav>

      <header className="relative isolate flex min-h-[78vh] items-center justify-center overflow-hidden px-5 py-20 text-center sm:px-6 sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d4b06a]/10" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4b06a]/5 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-[#d4b06a]">Dries &amp; Verouschka</p>
          <p className="mt-6 text-sm uppercase tracking-[0.28em] text-white/50">nodigen uit</p>
          <div className="mx-auto mt-10 h-px w-20 bg-[#d4b06a]/60" />
          <p className="mt-10 text-sm uppercase tracking-[0.35em] text-[#d4b06a]">Voor</p>
          <h1 className="mx-auto mt-4 max-w-full [overflow-wrap:anywhere] text-5xl leading-[0.95] sm:text-7xl md:text-8xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            {familyName}
          </h1>
          <p className="mt-9 text-lg text-white/70">{wedding.event.dateText}</p>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
            {allowedGuests === 1
              ? "Deze uitnodiging is persoonlijk voor jou."
              : "Deze uitnodiging is geldig voor 2 personen."}
          </p>
          <a href="#planning" className="mt-10 inline-flex rounded-full border border-[#d4b06a] px-7 py-3.5 text-sm text-[#d4b06a] transition hover:bg-[#d4b06a] hover:text-[#183328]">
            {allowedGuests === 1 ? "Ontdek je uitnodiging" : "Ontdek jullie uitnodiging"}
          </a>
        </div>
      </header>

      <section id="planning" className="bg-[#10261d] px-5 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d4b06a]">19 december 2026</p>
            <h2 className="mt-4 text-5xl sm:text-6xl" style={{ fontFamily: "var(--font-cormorant)" }}>Jullie dag met ons</h2>
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-white/60">Dit zijn de momenten waarop we jullie graag verwelkomen.</p>
          </div>

          <div className="mx-auto mt-16 max-w-3xl border-y border-white/10">
            {visibleEvents.map((event, index) => (
              <article key={event.title} className="grid gap-3 border-b border-white/10 py-7 last:border-b-0 sm:grid-cols-[6rem_1fr] sm:gap-8 sm:py-9">
                <div className="flex items-baseline justify-between gap-4 sm:block">
                  {event.time && <p className="font-mono text-sm text-[#d4b06a]">{event.time}</p>}
                  <span className="text-[10px] tracking-[0.25em] text-white/25 sm:mt-3 sm:block">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <h3 className="text-4xl leading-none sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>{event.title}</h3>
                  {event.description && <p className="mt-4 max-w-xl leading-relaxed text-white/60">{event.description}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="locatie" className="px-5 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto grid max-w-5xl gap-10 border-y border-white/10 py-12 md:grid-cols-2 md:items-center md:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d4b06a]">Locatie</p>
            <h2 className="mt-4 text-5xl sm:text-6xl" style={{ fontFamily: "var(--font-cormorant)" }}>{wedding.venue.name}</h2>
          </div>
          <div className="text-white/65">
            <address className="not-italic leading-relaxed">{wedding.venue.address}<br />{wedding.venue.city}</address>
            <p className="mt-6 text-sm leading-relaxed">Dresscode: <span className="text-white/85">{wedding.dresscode}</span></p>
            <a href="https://maps.app.goo.gl/JL6naH5Aq5r98jfZ6" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex rounded-full border border-[#d4b06a] px-6 py-3 text-sm text-[#d4b06a] transition hover:bg-[#d4b06a] hover:text-[#183328]">Open in Google Maps</a>
          </div>
        </div>
      </section>

      <section id="praktisch" className="bg-[#10261d] px-5 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d4b06a]">Praktische info</p>
            <h2 className="mt-4 text-5xl sm:text-6xl" style={{ fontFamily: "var(--font-cormorant)" }}>Goed om te weten</h2>
          </div>
          <div className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {practicalItems.map((item, index) => (
              <article key={item.title} className="border-t border-white/10 py-7 sm:py-9">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-3xl leading-none" style={{ fontFamily: "var(--font-cormorant)" }}>{item.title}</h3>
                  <span className="text-[10px] tracking-[0.25em] text-[#d4b06a]/60">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-5 leading-relaxed text-white/60">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="rsvp" className="bg-[#10261d] px-5 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-3xl">
          {answered ? (
            <RSVPConfirmation attendingGuests={attendingGuests} />
          ) : (
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d4b06a]">Laat iets weten</p>
              <h2 className="mt-4 text-5xl sm:text-6xl" style={{ fontFamily: "var(--font-cormorant)" }}>{allowedGuests === 1 ? "Ben je erbij?" : "Zijn jullie erbij?"}</h2>
              <p className="mx-auto mt-6 max-w-lg leading-relaxed text-white/60">We ontvangen {allowedGuests === 1 ? "je" : "jullie"} antwoord graag via de persoonlijke RSVP.</p>
              <Link href={`/i/${code}/rsvp`} className="mt-9 inline-flex rounded-full bg-[#d4b06a] px-8 py-4 font-semibold text-[#183328] transition hover:bg-[#e2c17f]">RSVP invullen</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

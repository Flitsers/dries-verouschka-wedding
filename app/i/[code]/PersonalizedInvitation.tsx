import type { InvitationType } from "@/app/i/[code]/invitation-types";
import PersonalizedHero from "@/components/invitation/PersonalizedHero";
import Navbar, { type NavigationLink } from "@/components/layout/Navbar";
import RSVPConfirmation from "@/components/rsvp/RSVPConfirmation";
import Footer from "@/components/sections/Footer";
import WeddingDayTimeline, {
  type TimelineEvent,
} from "@/components/sections/WeddingDayTimeline";
import WeddingDresscode from "@/components/sections/WeddingDresscode";
import WeddingFaq from "@/components/sections/WeddingFaq";
import WeddingHotels from "@/components/sections/WeddingHotels";
import WeddingLocation from "@/components/sections/WeddingLocation";
import WeddingPractical, {
  type PracticalItem,
} from "@/components/sections/WeddingPractical";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  getInvitationCountdownTargetTimestamp,
  getRequestTimestamp,
} from "@/lib/invitations/countdown";
import {
  getRsvpDeadlineText,
  getWeddingScheduleEvent,
  getWeddingScheduleTime,
  wedding,
  type WeddingScheduleEvent,
} from "@/lib/wedding";

type Props = {
  code: string;
  familyName: string;
  allowedGuests: number;
  invitationType: InvitationType;
  includesStadhuis: boolean;
  answered: boolean;
  attendingGuests: number | null;
};

const navigationLinks: readonly NavigationLink[] = [
  { name: "Onze dag", href: "#planning" },
  { name: "Locatie", href: "#locatie" },
  { name: "Praktisch", href: "#praktisch" },
  { name: "Hotels", href: "#hotels" },
  { name: "Dresscode", href: "#dresscode" },
  { name: "FAQ", href: "#faq" },
  { name: "RSVP", href: "#rsvp" },
];

const mobileNavigationLinks: readonly NavigationLink[] = [
  { name: "Bovenaan", href: "#top" },
  ...navigationLinks.filter((link) => link.href !== "#rsvp"),
];

const footerLinks = [
  { label: "Naar boven", href: "#top" },
  ...navigationLinks.map((link) => ({ label: link.name, href: link.href })),
];

function toTimelineEvent(
  event: WeddingScheduleEvent,
  title = event.title,
): TimelineEvent {
  return {
    title,
    time: event.time,
    description: event.description,
  };
}

const ceremony = getWeddingScheduleEvent("Ceremonie");
const cityHall = getWeddingScheduleEvent("Stadhuis");
const dayReception = getWeddingScheduleEvent("Dagsreceptie");
const dinner = getWeddingScheduleEvent("Diner");
const eveningReception = getWeddingScheduleEvent("Avondreceptie");
const party = getWeddingScheduleEvent("Avondfeest");
const midnightSnack = getWeddingScheduleEvent("Midnight snack");
const end = getWeddingScheduleEvent("Einde");

const eventsByInvitationType: Record<InvitationType, TimelineEvent[]> = {
  full_day: [
    toTimelineEvent(ceremony),
    toTimelineEvent(dayReception),
    toTimelineEvent(dinner),
    toTimelineEvent(party),
    toTimelineEvent(midnightSnack),
    toTimelineEvent(end),
  ],
  reception_plus: [
    toTimelineEvent(dayReception),
    toTimelineEvent(dinner),
    toTimelineEvent(party),
    toTimelineEvent(midnightSnack),
    toTimelineEvent(end),
  ],
  evening_only: [
    toTimelineEvent(eveningReception),
    toTimelineEvent(party),
    toTimelineEvent(midnightSnack),
    toTimelineEvent(end),
  ],
};

const locationCopyByInvitationType: Record<InvitationType, string> = {
  full_day: "Hier vieren we samen onze trouwdag.",
  reception_plus: "Hier vieren we samen onze trouwdag.",
  evening_only: "Hier vieren we samen onze feestelijke avond.",
};

function getPracticalItems(invitationType: InvitationType): PracticalItem[] {
  return [
    {
      title: "Parking",
      text: "Er is ruime gratis parking voorzien aan de locatie.",
    },
    {
      title: "Geen kinderen",
      text: "Onze trouw is een feest voor volwassenen. We vragen daarom vriendelijk om geen kinderen mee te brengen.",
    },
    ...(invitationType === "full_day"
      ? [
          {
            title: "Aankomstuur",
            text: `De ceremonie start om ${getWeddingScheduleTime("Ceremonie")}. We vragen onze gasten tijdig aanwezig te zijn.`,
          },
        ]
      : []),
    {
      title: "Dresscode",
      text: `${wedding.dresscode}. Warme kleuren, elegante outfits en een feestelijke winterse sfeer.`,
    },
    {
      title: "Overnachten",
      text: "Voor wie graag in de buurt overnacht, zijn er verschillende mogelijkheden in en rond Dilbeek.",
    },
    {
      title: "Cadeau",
      text: wedding.gift,
    },
  ];
}

export default function PersonalizedInvitation({
  code,
  familyName,
  allowedGuests,
  invitationType,
  includesStadhuis,
  answered,
  attendingGuests,
}: Props) {
  const plural = allowedGuests === 2;
  const countdownInitialTimestamp = getRequestTimestamp();
  const rsvpDeadlineText = getRsvpDeadlineText();
  const visibleEvents =
    invitationType === "full_day" && includesStadhuis
      ? [toTimelineEvent(cityHall), ...eventsByInvitationType.full_day]
      : eventsByInvitationType[invitationType];

  return (
    <>
      <Navbar
        links={navigationLinks}
        mobileLinks={mobileNavigationLinks}
        mobilePrimaryLink={{
          name: "Bevestig aanwezigheid",
          href: `/i/${code}/rsvp`,
        }}
        ariaLabel="Navigatie persoonlijke uitnodiging"
      />

      <main className="overflow-x-hidden bg-[#183328]">
        <PersonalizedHero
          code={code}
          familyName={familyName}
          allowedGuests={allowedGuests}
          countdownTargetTimestamp={getInvitationCountdownTargetTimestamp(
            invitationType,
          )}
          countdownInitialTimestamp={countdownInitialTimestamp}
          answered={answered}
        />
        <WeddingDayTimeline schedule={visibleEvents} />
        <WeddingLocation
          title="Waar we samen vieren"
          description={locationCopyByInvitationType[invitationType]}
        />
        <WeddingPractical items={getPracticalItems(invitationType)} />
        <WeddingHotels />
        <WeddingDresscode includeDinnerReference={invitationType !== "evening_only"} />
        <WeddingFaq includeCeremonyDetails={invitationType === "full_day"} />

        <section id="rsvp" className="relative isolate overflow-hidden bg-[#183328] px-5 py-28 text-white sm:px-6 md:py-36">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4b06a]/5 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            {answered ? (
              <RSVPConfirmation
                allowedGuests={allowedGuests}
                attendingGuests={attendingGuests}
              />
            ) : (
              <div className="text-center">
                <SectionTitle
                  eyebrow="Laat iets weten"
                  title={plural ? "Zijn jullie erbij?" : "Ben je erbij?"}
                />
                <p className="mx-auto mt-7 max-w-lg text-lg leading-relaxed text-white/65">
                  We ontvangen {plural ? "jullie" : "je"} antwoord graag via de persoonlijke RSVP.
                </p>
                <a
                  href={`/i/${code}/rsvp`}
                  className="mt-10 inline-flex rounded-full bg-[#d4b06a] px-8 py-4 font-semibold text-[#183328] shadow-[0_14px_35px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e2c17f]"
                >
                  RSVP invullen
                </a>
              </div>
            )}
            <p className="mx-auto mt-7 max-w-lg text-center text-sm leading-relaxed text-[#f5d998]/80">
              Gelieve ten laatste op {rsvpDeadlineText} te antwoorden.
            </p>
          </div>
        </section>
      </main>

      <Footer links={footerLinks} />
    </>
  );
}

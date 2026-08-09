import { notFound } from "next/navigation";
import RSVPWizard from "@/components/rsvp/RSVPWizard";
import { isInvitationType } from "@/app/i/[code]/invitation-types";
import { getPublicInvitationByCode } from "@/lib/invitations/server";

type Props = {
  params: Promise<{
    code: string;
  }>;
};

export default async function RSVPPage({ params }: Props) {
  const { code } = await params;
  const invitation = await getPublicInvitationByCode(code);

  if (!invitation) {
    notFound();
  }

  if (!isInvitationType(invitation.invitation_type)) {
    notFound();
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#183328] px-5 py-16 text-white sm:px-6 sm:py-24">
      <div className="pointer-events-none absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-[#d4b06a]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl rounded-[2rem] border border-[#d4b06a]/20 bg-gradient-to-br from-white/[0.09] to-white/[0.03] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-8 md:p-12">

        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#d4b06a]">
          RSVP
        </p>

        <h1
          className="mt-4 text-5xl md:text-6xl"
          style={{
            fontFamily: "var(--font-cormorant)",
          }}
        >
          Welkom
        </h1>

        <h2
          className="mt-10 text-4xl md:text-5xl"
          style={{
            fontFamily: "var(--font-cormorant)",
          }}
        >
          {invitation.family_name}
        </h2>

        <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/15 px-5 py-3 text-gray-300">
          <span className="font-serif text-2xl text-[#d4b06a]">{invitation.allowed_guests}</span>
          <span>{invitation.allowed_guests === 1 ? "persoon uitgenodigd" : "personen uitgenodigd"}</span>
        </div>

        <RSVPWizard
          code={invitation.code}
          familyName={invitation.family_name}
          allowedGuests={invitation.allowed_guests}
          initialAttendingGuests={invitation.answered ? invitation.attending_guests : null}
        />

      </div>

    </main>
  );
}

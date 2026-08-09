import { notFound } from "next/navigation";
import PersonalizedInvitation from "@/app/i/[code]/PersonalizedInvitation";
import { isInvitationType } from "@/app/i/[code]/invitation-types";
import { getPublicInvitationByCode } from "@/lib/invitations/server";

type Props = {
  params: Promise<{
    code: string;
  }>;
};

export default async function InvitePage({ params }: Props) {
  const { code } = await params;
  const invitation = await getPublicInvitationByCode(code);

  if (!invitation) {
    notFound();
  }

  if (!isInvitationType(invitation.invitation_type)) {
    notFound();
  }

  return (
    <PersonalizedInvitation
      code={invitation.code}
      familyName={invitation.family_name}
      allowedGuests={invitation.allowed_guests}
      invitationType={invitation.invitation_type}
      includesStadhuis={
        invitation.invitation_type === "full_day" &&
        invitation.includes_stadhuis === true
      }
      answered={invitation.answered}
      attendingGuests={invitation.attending_guests}
    />
  );
}

import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PersonalizedInvitation from "@/app/i/[code]/PersonalizedInvitation";
import { isInvitationType } from "@/app/i/[code]/invitation-types";

type Props = {
  params: Promise<{
    code: string;
  }>;
};

export default async function InvitePage({ params }: Props) {
  const { code } = await params;

  const { data, error } = await supabase
    .from("invites")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !data) {
    notFound();
  }

  if (!isInvitationType(data.invitation_type)) {
    notFound();
  }

  return (
    <PersonalizedInvitation
      code={data.code}
      familyName={data.family_name}
      allowedGuests={data.allowed_guests}
      invitationType={data.invitation_type}
      includesStadhuis={
        data.invitation_type === "full_day" && data.includes_stadhuis === true
      }
      answered={data.answered}
      attendingGuests={typeof data.attending_guests === "number" ? data.attending_guests : null}
    />
  );
}

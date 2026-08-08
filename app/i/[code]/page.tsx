import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PersonalizedInvitation from "@/app/i/[code]/PersonalizedInvitation";

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

  const invitationType = data.invitation_type === "reception_plus" || data.invitation_type === "evening_only"
    ? data.invitation_type
    : "full_day";

  return (
    <PersonalizedInvitation
      code={data.code}
      familyName={data.family_name}
      allowedGuests={data.allowed_guests}
      invitationType={invitationType}
      answered={data.answered}
      attendingGuests={typeof data.attending_guests === "number" ? data.attending_guests : null}
    />
  );
}

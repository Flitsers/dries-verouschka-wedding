"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type UpdateRsvpState = {
  error: string | null;
  success: string | null;
};

export async function updateRsvp(
  _previousState: UpdateRsvpState,
  formData: FormData,
): Promise<UpdateRsvpState> {
  await requireAdmin();

  const inviteId = formData.get("invite_id");
  const rsvpValue = formData.get("rsvp_value");

  if (typeof inviteId !== "string" || !inviteId || typeof rsvpValue !== "string") {
    return { error: "De RSVP-gegevens zijn ongeldig.", success: null };
  }

  const supabase = createSupabaseAdminClient();
  const { data: invite, error: lookupError } = await supabase
    .from("invites")
    .select("id, allowed_guests")
    .eq("id", inviteId)
    .single();

  if (lookupError || !invite) {
    console.error("Invite lookup before RSVP update failed", lookupError);
    return { error: "De uitnodiging kon niet worden gevonden.", success: null };
  }

  let answered: boolean;
  let attendingGuests: number | null;

  if (rsvpValue === "pending") {
    answered = false;
    attendingGuests = null;
  } else {
    const parsedAttendance = Number(rsvpValue);
    if (
      !Number.isInteger(parsedAttendance) ||
      parsedAttendance < 0 ||
      parsedAttendance > invite.allowed_guests
    ) {
      return { error: "Het aantal aanwezigen past niet bij deze uitnodiging.", success: null };
    }

    answered = true;
    attendingGuests = parsedAttendance;
  }

  const { data: updatedInvite, error: updateError } = await supabase
    .from("invites")
    .update({ answered, attending_guests: attendingGuests })
    .eq("id", invite.id)
    .select("id")
    .maybeSingle();

  if (updateError || !updatedInvite) {
    console.error("Manual RSVP update failed", updateError);
    return { error: "De RSVP kon niet worden opgeslagen.", success: null };
  }

  revalidatePath(`/admin/${invite.id}`);
  revalidatePath("/admin");

  return { error: null, success: "RSVP opgeslagen." };
}

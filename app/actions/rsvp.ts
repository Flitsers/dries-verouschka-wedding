"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export type SubmitRsvpState = {
  error: string | null;
};

export async function submitRSVP(
  _previousState: SubmitRsvpState,
  formData: FormData,
): Promise<SubmitRsvpState> {
  const code = formData.get("code");
  const attendingGuestsValue = formData.get("attending_guests");

  if (
    typeof code !== "string" ||
    !code.trim() ||
    typeof attendingGuestsValue !== "string" ||
    !["0", "1", "2"].includes(attendingGuestsValue)
  ) {
    return { error: "De RSVP-gegevens zijn ongeldig. Controleer het antwoord en probeer opnieuw." };
  }

  const normalizedCode = code.trim();
  const attendingGuests = Number(attendingGuestsValue);

  let invite: { allowed_guests: number } | null;

  try {
    const { data, error } = await supabase
      .from("invites")
      .select("allowed_guests")
      .eq("code", normalizedCode)
      .single();

    if (error || !data) {
      console.error("Public RSVP lookup failed", error);
      return { error: "We konden jullie uitnodiging niet laden. Probeer het straks opnieuw." };
    }

    invite = data;
  } catch (error) {
    console.error("Public RSVP lookup failed", error);
    return { error: "We konden jullie uitnodiging niet laden. Probeer het straks opnieuw." };
  }

  if (
    (invite.allowed_guests !== 1 && invite.allowed_guests !== 2) ||
    !Number.isInteger(attendingGuests) ||
    attendingGuests < 0 ||
    attendingGuests > invite.allowed_guests
  ) {
    return { error: "Het aantal aanwezigen past niet bij deze uitnodiging." };
  }

  try {
    const { data: updatedInvite, error: inviteError } = await supabase
      .from("invites")
      .update({
        answered: true,
        attending_guests: attendingGuests,
      })
      .eq("code", normalizedCode)
      .select("code")
      .maybeSingle();

    if (inviteError || !updatedInvite) {
      console.error("Public RSVP update failed", inviteError);
      return { error: "Jullie antwoord kon niet worden opgeslagen. Probeer het opnieuw." };
    }
  } catch (error) {
    console.error("Public RSVP update failed", error);
    return { error: "Jullie antwoord kon niet worden opgeslagen. Probeer het opnieuw." };
  }

  revalidatePath(`/i/${normalizedCode}`);
  revalidatePath(`/i/${normalizedCode}/rsvp`);
  redirect(`/i/${normalizedCode}`);
}

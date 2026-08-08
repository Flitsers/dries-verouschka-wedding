"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function submitRSVP(formData: FormData) {
  const code = formData.get("code");
  const attendingGuestsValue = formData.get("attending_guests");
  const attendingGuests = Number(attendingGuestsValue);

  if (
    typeof code !== "string" ||
    !code ||
    typeof attendingGuestsValue !== "string" ||
    !attendingGuestsValue.trim()
  ) {
    throw new Error("Ongeldige RSVP-gegevens.");
  }

  const { data: invite, error: inviteLookupError } = await supabase
    .from("invites")
    .select("allowed_guests")
    .eq("code", code)
    .single();

  if (inviteLookupError || !invite) {
    throw new Error("RSVP laden mislukt.");
  }

  if (
    (invite.allowed_guests !== 1 && invite.allowed_guests !== 2) ||
    !Number.isInteger(attendingGuests) ||
    attendingGuests < 0 ||
    attendingGuests > invite.allowed_guests
  ) {
    throw new Error("Ongeldige RSVP-gegevens.");
  }

  const { error: inviteError } = await supabase
    .from("invites")
    .update({
      answered: true,
      attending_guests: attendingGuests,
    })
    .eq("code", code);

  if (inviteError) {
    console.error(inviteError);
    throw new Error("Uitnodiging kon niet bijgewerkt worden.");
  }

  revalidatePath(`/i/${code}`);
  revalidatePath(`/i/${code}/rsvp`);
  redirect(`/i/${code}`);
}

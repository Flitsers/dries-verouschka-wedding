"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

type CreateInviteState = {
  error: string | null;
};

export async function createInvite(
  _previousState: CreateInviteState,
  formData: FormData,
): Promise<CreateInviteState> {
  const familyName = String(formData.get("family_name") ?? "").trim();
  const allowedGuests = Number(formData.get("allowed_guests"));
  const email = String(formData.get("email") ?? "").trim();
  const invitationType = formData.get("invitation_type");
  if (!familyName || (allowedGuests !== 1 && allowedGuests !== 2)) {
    return { error: "Kies een uitnodigingsnaam en één of twee personen." };
  }

  if (
    invitationType !== "full_day" &&
    invitationType !== "reception_plus" &&
    invitationType !== "evening_only"
  ) {
    return { error: "Kies een geldig type uitnodiging." };
  }

  const code = randomUUID().replace(/-/g, "").substring(0, 8).toUpperCase();
  const { error: inviteError } = await supabase
    .from("invites")
    .insert({
      code,
      family_name: familyName,
      allowed_guests: allowedGuests,
      email,
      invitation_type: invitationType,
      answered: false,
      attending_guests: null,
    });

  if (inviteError) {
    console.error("Invite creation failed", inviteError);
    return { error: "De uitnodiging kon niet worden aangemaakt. Probeer opnieuw." };
  }

  redirect("/admin");
}

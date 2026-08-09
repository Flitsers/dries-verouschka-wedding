"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type CreateInviteState = {
  error: string | null;
};

export async function createInvite(
  _previousState: CreateInviteState,
  formData: FormData,
): Promise<CreateInviteState> {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
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

  const includesStadhuis =
    invitationType === "full_day" && formData.get("includes_stadhuis") === "on";

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const code = randomBytes(16).toString("base64url");
    const { error: inviteError } = await supabase
      .from("invites")
      .insert({
        code,
        family_name: familyName,
        allowed_guests: allowedGuests,
        email,
        invitation_type: invitationType,
        includes_stadhuis: includesStadhuis,
        answered: false,
        attending_guests: null,
      });

    if (!inviteError) {
      redirect("/admin");
    }

    if (inviteError.code !== "23505") {
      console.error("Invite creation failed", {
        errorCode: inviteError.code,
        message: inviteError.message,
      });
      return { error: "De uitnodiging kon niet worden aangemaakt. Probeer opnieuw." };
    }
  }

  console.error("Invite creation failed after repeated unique-code collisions");
  return { error: "De uitnodiging kon niet worden aangemaakt. Probeer opnieuw." };
}

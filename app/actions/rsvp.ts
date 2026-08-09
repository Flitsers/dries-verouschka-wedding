"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { submitPublicInvitationRsvp } from "@/lib/invitations/server";

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

  const attendingGuests = Number(attendingGuestsValue);
  let updatedCode: string;

  try {
    const result = await submitPublicInvitationRsvp(code, attendingGuests);

    if (
      result.status === "invalid_code" ||
      result.status === "invalid_attendance"
    ) {
      return { error: "De RSVP-gegevens zijn ongeldig. Controleer het antwoord en probeer opnieuw." };
    }

    if (result.status === "over_capacity") {
      return { error: "Het aantal aanwezigen past niet bij deze uitnodiging." };
    }

    if (result.status === "invitation_not_found") {
      return { error: "We konden jullie uitnodiging niet laden. Probeer het straks opnieuw." };
    }

    if (result.status === "database_error") {
      return { error: "Jullie antwoord kon niet worden opgeslagen. Probeer het opnieuw." };
    }

    updatedCode = result.code;
  } catch {
    console.error("Public RSVP update failed unexpectedly");
    return { error: "Jullie antwoord kon niet worden opgeslagen. Probeer het opnieuw." };
  }

  revalidatePath(`/i/${updatedCode}`);
  revalidatePath(`/i/${updatedCode}/rsvp`);
  redirect(`/i/${updatedCode}`);
}

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import {
  resetInvitationRsvp,
  submitPublicInvitationRsvp,
} from "@/lib/invitations/server";
import { toRsvpAttendees, type RsvpAttendee } from "@/lib/invitations/rsvp";
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
  const stadhuisValue = formData.get("stadhuis_attending");

  if (typeof inviteId !== "string" || !inviteId || typeof rsvpValue !== "string") {
    return { error: "De RSVP-gegevens zijn ongeldig.", success: null };
  }

  const supabase = createSupabaseAdminClient();
  const { data: invite, error: lookupError } = await supabase
    .from("invites")
    .select(
      "id, code, allowed_guests, includes_stadhuis, stadhuis_attending",
    )
    .eq("id", inviteId)
    .single();

  if (lookupError || !invite) {
    console.error("Invite lookup before RSVP update failed", lookupError);
    return { error: "De uitnodiging kon niet worden gevonden.", success: null };
  }

  let result;

  if (rsvpValue === "pending") {
    result = await resetInvitationRsvp(invite.code);
  } else {
    const parsedAttendance = Number(rsvpValue);
    if (
      !Number.isInteger(parsedAttendance) ||
      parsedAttendance < 0 ||
      parsedAttendance > invite.allowed_guests
    ) {
      return { error: "Het aantal aanwezigen past niet bij deze uitnodiging.", success: null };
    }

    let attendees: RsvpAttendee[] = [];
    let stadhuisAttending: boolean | null = null;

    if (invite.includes_stadhuis === true) {
      if (parsedAttendance === 0) {
        stadhuisAttending = false;
      } else if (stadhuisValue === "true" || stadhuisValue === "false") {
        stadhuisAttending = stadhuisValue === "true";
      } else {
        return {
          error: "Kies of deze uitnodiging mee naar het stadhuis komt.",
          success: null,
        };
      }
    }

    if (parsedAttendance > 0) {
      const { data: attendeeRows, error: attendeeError } = await supabase
        .from("rsvp_attendees")
        .select(
          "attendee_position, name, dietary_preference, notes, details_complete",
        )
        .eq("invite_code", invite.code)
        .order("attendee_position");

      if (attendeeError) {
        console.error("Admin RSVP attendee lookup failed", attendeeError);
        return {
          error: "De persoonsgegevens konden niet worden geladen.",
          success: null,
        };
      }

      attendees = toRsvpAttendees(attendeeRows).slice(0, parsedAttendance);

      if (attendees.length !== parsedAttendance) {
        return {
          error:
            "Voor dit aantal ontbreken persoonsgegevens. Laat de gast de RSVP via de uitnodigingslink invullen.",
          success: null,
        };
      }
    }

    result = await submitPublicInvitationRsvp(
      invite.code,
      parsedAttendance,
      attendees,
      stadhuisAttending,
    );
  }

  if (result.status !== "success") {
    console.error("Manual RSVP update failed", { status: result.status });
    return { error: "De RSVP kon niet worden opgeslagen.", success: null };
  }

  revalidatePath(`/admin/${invite.id}`);
  revalidatePath("/admin");
  revalidatePath(`/i/${invite.code}`);
  revalidatePath(`/i/${invite.code}/rsvp`);

  return { error: null, success: "RSVP opgeslagen." };
}

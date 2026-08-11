import "server-only";

import {
  isInvitationType,
  type InvitationType,
} from "@/app/i/[code]/invitation-types";
import { normalizeInvitationCode } from "@/lib/invitations/code";
import {
  isDietaryPreference,
  RSVP_ATTENDEE_NAME_MAX_LENGTH,
  RSVP_ATTENDEE_NOTES_MAX_LENGTH,
  toStoredRsvpAttendees,
  type RsvpAttendee,
  type StoredRsvpAttendee,
} from "@/lib/invitations/rsvp";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const publicInvitationFields = [
  "code",
  "family_name",
  "allowed_guests",
  "answered",
  "attending_guests",
  "invitation_type",
  "includes_stadhuis",
  "stadhuis_attending",
].join(",");

export type PublicInvitation = {
  code: string;
  family_name: string;
  allowed_guests: 1 | 2;
  answered: boolean;
  attending_guests: number | null;
  invitation_type: InvitationType;
  includes_stadhuis: boolean;
  stadhuis_attending: boolean | null;
};

export type PublicInvitationRsvp = PublicInvitation & {
  attendees: StoredRsvpAttendee[];
};

export type PublicRsvpResult =
  | { status: "success"; code: string }
  | { status: "invalid_code" }
  | { status: "invalid_attendance" }
  | { status: "invitation_not_found" }
  | { status: "over_capacity" }
  | { status: "database_error" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toPublicInvitation(value: unknown): PublicInvitation | null {
  if (!isRecord(value)) return null;

  const allowedGuests = value.allowed_guests;
  const attendingGuests = value.attending_guests;

  if (
    typeof value.code !== "string" ||
    typeof value.family_name !== "string" ||
    (allowedGuests !== 1 && allowedGuests !== 2) ||
    typeof value.answered !== "boolean" ||
    !isInvitationType(value.invitation_type) ||
    typeof value.includes_stadhuis !== "boolean" ||
    !(
      value.stadhuis_attending === null ||
      typeof value.stadhuis_attending === "boolean"
    ) ||
    !(
      attendingGuests === null ||
      (typeof attendingGuests === "number" &&
        Number.isInteger(attendingGuests) &&
        attendingGuests >= 0 &&
        attendingGuests <= allowedGuests)
    )
  ) {
    return null;
  }

  return {
    code: value.code,
    family_name: value.family_name,
    allowed_guests: allowedGuests,
    answered: value.answered,
    attending_guests: attendingGuests,
    invitation_type: value.invitation_type,
    includes_stadhuis: value.includes_stadhuis,
    stadhuis_attending: value.stadhuis_attending,
  };
}

function hasValidRsvpAttendees(
  attendees: RsvpAttendee[],
  attendingGuests: number,
) {
  return (
    attendees.length === attendingGuests &&
    attendees.every(
      (attendee, index) =>
        attendee.position === index + 1 &&
        attendee.name.trim().length > 0 &&
        attendee.name.length <= RSVP_ATTENDEE_NAME_MAX_LENGTH &&
        isDietaryPreference(attendee.dietaryPreference) &&
        (attendee.notes === null ||
          attendee.notes.length <= RSVP_ATTENDEE_NOTES_MAX_LENGTH),
    )
  );
}

function reportInvitationDatabaseError(
  context: string,
  error: { code?: string; message?: string },
) {
  console.error(context, {
    errorCode: error.code,
    message: error.message,
  });
}

export async function getPublicInvitationByCode(
  code: string,
): Promise<PublicInvitation | null> {
  const normalizedCode = normalizeInvitationCode(code);
  if (!normalizedCode) return null;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("invites")
    .select(publicInvitationFields)
    .eq("code", normalizedCode)
    .maybeSingle();

  if (error) {
    reportInvitationDatabaseError("Public invitation lookup failed", error);
    throw new Error("Public invitation data is temporarily unavailable.");
  }

  if (data === null) return null;

  const invitation = toPublicInvitation(data);

  if (!invitation) {
    console.error("Public invitation lookup returned an invalid result shape");
    throw new Error("Public invitation data is temporarily unavailable.");
  }

  return invitation;
}

export async function getPublicInvitationRsvpByCode(
  code: string,
): Promise<PublicInvitationRsvp | null> {
  const invitation = await getPublicInvitationByCode(code);
  if (!invitation) return null;

  const supabase = createSupabaseAdminClient();
  const { data: attendeeRows, error: attendeeError } = await supabase
    .from("rsvp_attendees")
    .select(
      "attendee_position, name, dietary_preference, notes, details_complete",
    )
    .eq("invite_code", invitation.code)
    .order("attendee_position");

  if (attendeeError) {
    reportInvitationDatabaseError(
      "Public RSVP attendee lookup failed",
      attendeeError,
    );
    throw new Error("Public RSVP data is temporarily unavailable.");
  }

  return {
    ...invitation,
    attendees: toStoredRsvpAttendees(attendeeRows),
  };
}

export async function submitPublicInvitationRsvp(
  code: string,
  attendingGuests: number,
  attendees: RsvpAttendee[],
  stadhuisAttending: boolean | null,
): Promise<PublicRsvpResult> {
  const normalizedCode = normalizeInvitationCode(code);
  if (!normalizedCode) return { status: "invalid_code" };

  if (
    !Number.isInteger(attendingGuests) ||
    attendingGuests < 0 ||
    attendingGuests > 2 ||
    !hasValidRsvpAttendees(attendees, attendingGuests)
  ) {
    return { status: "invalid_attendance" };
  }

  const supabase = createSupabaseAdminClient();
  const { data: invitation, error: lookupError } = await supabase
    .from("invites")
    .select("allowed_guests, includes_stadhuis")
    .eq("code", normalizedCode)
    .maybeSingle();

  if (lookupError) {
    reportInvitationDatabaseError("Public RSVP lookup failed", lookupError);
    return { status: "database_error" };
  }

  if (!invitation) return { status: "invitation_not_found" };

  if (
    (invitation.allowed_guests !== 1 && invitation.allowed_guests !== 2) ||
    attendingGuests > invitation.allowed_guests
  ) {
    return { status: "over_capacity" };
  }

  let storedStadhuisAttendance: boolean | null;

  if (invitation.includes_stadhuis === true) {
    if (attendingGuests === 0) {
      if (stadhuisAttending === true) return { status: "invalid_attendance" };
      storedStadhuisAttendance = false;
    } else {
      if (typeof stadhuisAttending !== "boolean") {
        return { status: "invalid_attendance" };
      }
      storedStadhuisAttendance = stadhuisAttending;
    }
  } else {
    if (stadhuisAttending !== null) return { status: "invalid_attendance" };
    storedStadhuisAttendance = null;
  }

  const { data: updatedCode, error: updateError } = await supabase.rpc(
    "save_invitation_rsvp",
    {
      p_invite_code: normalizedCode,
      p_answered: true,
      p_attending_guests: attendingGuests,
      p_stadhuis_attending: storedStadhuisAttendance,
      p_attendees: attendees.map((attendee) => ({
        name: attendee.name.trim(),
        dietary_preference: attendee.dietaryPreference,
        notes: attendee.notes?.trim() || null,
      })),
    },
  );

  if (updateError) {
    reportInvitationDatabaseError("Public RSVP update failed", updateError);
    return { status: "database_error" };
  }

  if (updatedCode !== normalizedCode) {
    return { status: "invitation_not_found" };
  }

  return { status: "success", code: normalizedCode };
}

export async function resetInvitationRsvp(
  code: string,
): Promise<PublicRsvpResult> {
  const normalizedCode = normalizeInvitationCode(code);
  if (!normalizedCode) return { status: "invalid_code" };

  const supabase = createSupabaseAdminClient();
  const { data: updatedCode, error } = await supabase.rpc(
    "save_invitation_rsvp",
    {
      p_invite_code: normalizedCode,
      p_answered: false,
      p_attending_guests: null,
      p_stadhuis_attending: null,
      p_attendees: [],
    },
  );

  if (error) {
    reportInvitationDatabaseError("RSVP reset failed", error);
    return { status: "database_error" };
  }

  if (updatedCode !== normalizedCode) {
    return { status: "invitation_not_found" };
  }

  return { status: "success", code: normalizedCode };
}

import "server-only";

import {
  isInvitationType,
  type InvitationType,
} from "@/app/i/[code]/invitation-types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const legacyInvitationCodePattern = /^[0-9A-Fa-f]{8}$/;
const secureInvitationCodePattern = /^[A-Za-z0-9_-]{22}$/;
const publicInvitationFields = [
  "code",
  "family_name",
  "allowed_guests",
  "answered",
  "attending_guests",
  "invitation_type",
  "includes_stadhuis",
].join(",");

export type PublicInvitation = {
  code: string;
  family_name: string;
  allowed_guests: 1 | 2;
  answered: boolean;
  attending_guests: number | null;
  invitation_type: InvitationType;
  includes_stadhuis: boolean;
};

export type PublicRsvpResult =
  | { status: "success"; code: string }
  | { status: "invalid_code" }
  | { status: "invalid_attendance" }
  | { status: "invitation_not_found" }
  | { status: "over_capacity" }
  | { status: "database_error" };

function normalizeInvitationCode(code: string) {
  const normalizedCode = code.trim();

  if (
    normalizedCode.length > 64 ||
    (!legacyInvitationCodePattern.test(normalizedCode) &&
      !secureInvitationCodePattern.test(normalizedCode))
  ) {
    return null;
  }

  return normalizedCode;
}

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
  };
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
    return null;
  }

  return toPublicInvitation(data);
}

export async function submitPublicInvitationRsvp(
  code: string,
  attendingGuests: number,
): Promise<PublicRsvpResult> {
  const normalizedCode = normalizeInvitationCode(code);
  if (!normalizedCode) return { status: "invalid_code" };

  if (
    !Number.isInteger(attendingGuests) ||
    attendingGuests < 0 ||
    attendingGuests > 2
  ) {
    return { status: "invalid_attendance" };
  }

  const supabase = createSupabaseAdminClient();
  const { data: invitation, error: lookupError } = await supabase
    .from("invites")
    .select("allowed_guests")
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

  const { data: updatedInvitation, error: updateError } = await supabase
    .from("invites")
    .update({
      answered: true,
      attending_guests: attendingGuests,
    })
    .eq("code", normalizedCode)
    .select("code")
    .maybeSingle();

  if (updateError) {
    reportInvitationDatabaseError("Public RSVP update failed", updateError);
    return { status: "database_error" };
  }

  if (!updatedInvitation || updatedInvitation.code !== normalizedCode) {
    return { status: "invitation_not_found" };
  }

  return { status: "success", code: normalizedCode };
}

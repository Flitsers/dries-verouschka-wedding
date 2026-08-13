import "server-only";

import { revalidatePath } from "next/cache";
import { submitPublicInvitationRsvp } from "@/lib/invitations/server";
import {
  isDietaryPreference,
  RSVP_ATTENDEE_NAME_MAX_LENGTH,
  RSVP_ATTENDEE_NOTES_MAX_LENGTH,
  RSVP_ATTENDEE_SONG_REQUEST_MAX_LENGTH,
  type RsvpAttendee,
} from "@/lib/invitations/rsvp";

export type SubmitRsvpState = {
  error: string | null;
  code: string | null;
};

type AttendeeParseResult =
  | { attendees: RsvpAttendee[]; error: null }
  | { attendees: null; error: string };

function parseAttendees(
  formData: FormData,
  attendingGuests: number,
): AttendeeParseResult {
  const attendees: RsvpAttendee[] = [];

  for (const position of [1, 2] as const) {
    const nameKey = `attendee_${position}_name`;
    const dietaryPreferenceKey = `attendee_${position}_dietary_preference`;
    const notesKey = `attendee_${position}_notes`;
    const songRequestKey = `attendee_${position}_song_request`;
    const isAttending = position <= attendingGuests;

    if (!isAttending) {
      if (
        formData.has(nameKey) ||
        formData.has(dietaryPreferenceKey) ||
        formData.has(notesKey) ||
        formData.has(songRequestKey)
      ) {
        return {
          attendees: null,
          error: "Er zijn gegevens meegestuurd voor een persoon die niet aanwezig is.",
        };
      }

      continue;
    }

    if (
      formData.getAll(nameKey).length !== 1 ||
      formData.getAll(dietaryPreferenceKey).length !== 1 ||
      formData.getAll(notesKey).length > 1 ||
      formData.getAll(songRequestKey).length > 1
    ) {
      return { attendees: null, error: "De persoonsgegevens zijn ongeldig." };
    }

    const nameValue = formData.get(nameKey);
    const dietaryPreference = formData.get(dietaryPreferenceKey);
    const notesValue = formData.get(notesKey);
    const songRequestValue = formData.get(songRequestKey);

    if (
      typeof nameValue !== "string" ||
      typeof dietaryPreference !== "string" ||
      !(notesValue === null || typeof notesValue === "string") ||
      !(songRequestValue === null || typeof songRequestValue === "string")
    ) {
      return { attendees: null, error: "De persoonsgegevens zijn ongeldig." };
    }

    const name = nameValue.trim();
    const notes = notesValue?.trim() || null;
    const songRequest = songRequestValue?.trim() || null;

    if (!name || name.length > RSVP_ATTENDEE_NAME_MAX_LENGTH) {
      return {
        attendees: null,
        error: `Vul voor persoon ${position} een geldige naam in.`,
      };
    }

    if (!isDietaryPreference(dietaryPreference)) {
      return {
        attendees: null,
        error: `Kies voor persoon ${position} een geldige eetvoorkeur.`,
      };
    }

    if (
      notesValue !== null &&
      notesValue.length > RSVP_ATTENDEE_NOTES_MAX_LENGTH
    ) {
      return {
        attendees: null,
        error: `De opmerkingen voor persoon ${position} mogen maximaal 500 tekens bevatten.`,
      };
    }

    if (
      songRequestValue !== null &&
      songRequestValue.length > RSVP_ATTENDEE_SONG_REQUEST_MAX_LENGTH
    ) {
      return {
        attendees: null,
        error: `Het verzoeknummer voor persoon ${position} mag maximaal 200 tekens bevatten.`,
      };
    }

    attendees.push({
      position,
      name,
      dietaryPreference,
      notes,
      songRequest,
    });
  }

  if (attendees.length !== attendingGuests) {
    return {
      attendees: null,
      error: "Het aantal personen en de persoonsgegevens komen niet overeen.",
    };
  }

  return { attendees, error: null };
}

export async function submitRSVP(
  _previousState: SubmitRsvpState,
  formData: FormData,
): Promise<SubmitRsvpState> {
  const code = formData.get("code");
  const attendingGuestsValue = formData.get("attending_guests");
  const stadhuisAttendanceValues = formData.getAll("stadhuis_attending");

  if (
    typeof code !== "string" ||
    !code.trim() ||
    typeof attendingGuestsValue !== "string" ||
    !["0", "1", "2"].includes(attendingGuestsValue)
  ) {
    return {
      error: "De RSVP-gegevens zijn ongeldig. Controleer het antwoord en probeer opnieuw.",
      code: null,
    };
  }

  const attendingGuests = Number(attendingGuestsValue);
  const stadhuisAttendanceValue = stadhuisAttendanceValues[0] ?? null;

  if (
    stadhuisAttendanceValues.length > 1 ||
    !(
      stadhuisAttendanceValue === null ||
      stadhuisAttendanceValue === "" ||
      stadhuisAttendanceValue === "true" ||
      stadhuisAttendanceValue === "false"
    )
  ) {
    return {
      error: "De RSVP-gegevens zijn ongeldig. Controleer het antwoord en probeer opnieuw.",
      code: null,
    };
  }

  const stadhuisAttending =
    stadhuisAttendanceValue === "true"
      ? true
      : stadhuisAttendanceValue === "false"
        ? false
        : null;
  const attendeeResult = parseAttendees(formData, attendingGuests);

  if (attendeeResult.attendees === null) {
    return { error: attendeeResult.error, code: null };
  }

  let updatedCode: string;

  try {
    const result = await submitPublicInvitationRsvp(
      code,
      attendingGuests,
      attendeeResult.attendees,
      stadhuisAttending,
    );

    if (
      result.status === "invalid_code" ||
      result.status === "invalid_attendance"
    ) {
      return {
        error: "De RSVP-gegevens zijn ongeldig. Controleer het antwoord en probeer opnieuw.",
        code: null,
      };
    }

    if (result.status === "over_capacity") {
      return {
        error: "Het aantal aanwezigen past niet bij deze uitnodiging.",
        code: null,
      };
    }

    if (result.status === "invitation_not_found") {
      return {
        error: "We konden jullie uitnodiging niet laden. Probeer het straks opnieuw.",
        code: null,
      };
    }

    if (result.status === "database_error") {
      return {
        error: "Jullie antwoord kon niet worden opgeslagen. Probeer het opnieuw.",
        code: null,
      };
    }

    updatedCode = result.code;
  } catch {
    console.error("Public RSVP update failed unexpectedly");
    return {
      error: "Jullie antwoord kon niet worden opgeslagen. Probeer het opnieuw.",
      code: null,
    };
  }

  revalidatePath(`/i/${updatedCode}`);
  revalidatePath(`/i/${updatedCode}/rsvp`);
  return { error: null, code: updatedCode };
}

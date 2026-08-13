import "server-only";

import type {
  AdminSongRequestOverview,
  AdminSongRequestOverviewPerson,
} from "@/lib/admin/song-request-overview-types";
import { RSVP_ATTENDEE_SONG_REQUEST_MAX_LENGTH } from "@/lib/invitations/rsvp";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type InviteRelation = {
  id: unknown;
  family_name: unknown;
  answered: unknown;
  attending_guests: unknown;
};

function getInviteRelation(value: unknown): InviteRelation | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  return value as InviteRelation;
}

export async function getAdminSongRequestOverview(): Promise<AdminSongRequestOverview> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("rsvp_attendees")
    .select(`
      attendee_position,
      name,
      song_request,
      details_complete,
      invites!inner (
        id,
        family_name,
        answered,
        attending_guests
      )
    `)
    .eq("details_complete", true)
    .eq("invites.answered", true)
    .gt("invites.attending_guests", 0)
    .not("song_request", "is", null);

  if (error) {
    console.error("Failed to load the admin song-request overview", error);
    throw new Error("The admin song-request overview could not be loaded.");
  }

  const people = (data ?? []).flatMap(
    (value): AdminSongRequestOverviewPerson[] => {
      const invite = getInviteRelation(value.invites);
      const position = value.attendee_position;
      const name = typeof value.name === "string" ? value.name.trim() : "";
      const songRequest =
        typeof value.song_request === "string" ? value.song_request.trim() : "";
      const attendingGuests = invite?.attending_guests;

      if (
        value.details_complete !== true ||
        invite?.answered !== true ||
        typeof invite.id !== "number" ||
        typeof invite.family_name !== "string" ||
        typeof attendingGuests !== "number" ||
        !Number.isInteger(attendingGuests) ||
        attendingGuests < 1 ||
        (position !== 1 && position !== 2) ||
        position > attendingGuests ||
        !name ||
        !songRequest ||
        songRequest.length > RSVP_ATTENDEE_SONG_REQUEST_MAX_LENGTH
      ) {
        return [];
      }

      return [{
        inviteId: invite.id,
        familyName: invite.family_name,
        attendeePosition: position,
        name,
        songRequest,
      }];
    },
  );

  const collator = new Intl.Collator("nl-BE", { sensitivity: "base" });
  people.sort(
    (left, right) =>
      collator.compare(left.name, right.name) ||
      collator.compare(left.familyName, right.familyName) ||
      left.attendeePosition - right.attendeePosition,
  );

  return { people, count: people.length };
}

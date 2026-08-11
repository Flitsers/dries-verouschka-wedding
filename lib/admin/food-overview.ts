import "server-only";

import type {
  AdminFoodOverview,
  AdminFoodOverviewPerson,
} from "@/lib/admin/food-overview-types";
import { isDietaryPreference } from "@/lib/invitations/rsvp";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type InviteRelation = {
  id: unknown;
  code: unknown;
  family_name: unknown;
  answered: unknown;
  attending_guests: unknown;
};

const dietaryPreferenceOrder = {
  vegan: 0,
  vegetarian: 1,
  none: 2,
} as const;

function getInviteRelation(value: unknown): InviteRelation | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  return value as InviteRelation;
}

export async function getAdminFoodOverview(): Promise<AdminFoodOverview> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("rsvp_attendees")
    .select(`
      attendee_position,
      name,
      dietary_preference,
      notes,
      details_complete,
      invites!inner (
        id,
        code,
        family_name,
        answered,
        attending_guests
      )
    `)
    .eq("details_complete", true)
    .eq("invites.answered", true)
    .gt("invites.attending_guests", 0);

  if (error) {
    console.error("Failed to load the admin food overview", error);
    throw new Error("The admin food overview could not be loaded.");
  }

  const people = (data ?? []).flatMap((value): AdminFoodOverviewPerson[] => {
    const invite = getInviteRelation(value.invites);
    const position = value.attendee_position;
    const name = typeof value.name === "string" ? value.name.trim() : "";
    const notes = typeof value.notes === "string" ? value.notes.trim() : "";
    const dietaryPreference = value.dietary_preference;
    const attendingGuests = invite?.attending_guests;

    if (
      value.details_complete !== true ||
      invite?.answered !== true ||
      typeof invite.id !== "number" ||
      typeof invite.code !== "string" ||
      typeof invite.family_name !== "string" ||
      !Number.isInteger(attendingGuests) ||
      typeof attendingGuests !== "number" ||
      attendingGuests < 1 ||
      (position !== 1 && position !== 2) ||
      position > attendingGuests ||
      !name ||
      !isDietaryPreference(dietaryPreference) ||
      (dietaryPreference === "none" && !notes)
    ) {
      return [];
    }

    return [{
      inviteId: invite.id,
      inviteCode: invite.code,
      familyName: invite.family_name,
      attendeePosition: position,
      name,
      dietaryPreference,
      notes: notes || null,
    }];
  });

  const collator = new Intl.Collator("nl-BE", { sensitivity: "base" });
  people.sort((left, right) => (
    dietaryPreferenceOrder[left.dietaryPreference] - dietaryPreferenceOrder[right.dietaryPreference] ||
    collator.compare(left.name, right.name) ||
    collator.compare(left.familyName, right.familyName) ||
    left.attendeePosition - right.attendeePosition
  ));

  return {
    people,
    counts: {
      vegetarian: people.filter((person) => person.dietaryPreference === "vegetarian").length,
      vegan: people.filter((person) => person.dietaryPreference === "vegan").length,
      withNotes: people.filter((person) => person.notes !== null).length,
    },
  };
}

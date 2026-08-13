export const dietaryPreferenceValues = [
  "none",
  "vegetarian",
  "vegan",
] as const;

export type DietaryPreference = (typeof dietaryPreferenceValues)[number];

export type RsvpAttendee = {
  position: 1 | 2;
  name: string;
  dietaryPreference: DietaryPreference;
  notes: string | null;
  songRequest: string | null;
};

export type StoredRsvpAttendee =
  | (RsvpAttendee & {
      detailsComplete: true;
    })
  | {
      position: 1 | 2;
      name: null;
      dietaryPreference: "none";
      notes: null;
      songRequest: null;
      detailsComplete: false;
    };

export const RSVP_ATTENDEE_NAME_MAX_LENGTH = 150;
export const RSVP_ATTENDEE_NOTES_MAX_LENGTH = 500;
export const RSVP_ATTENDEE_SONG_REQUEST_MAX_LENGTH = 200;

const dietaryPreferenceLabels: Record<DietaryPreference, string> = {
  none: "Geen voorkeur",
  vegetarian: "Vegetarisch",
  vegan: "Vegan",
};

export function isDietaryPreference(
  value: unknown,
): value is DietaryPreference {
  return (
    typeof value === "string" &&
    dietaryPreferenceValues.includes(value as DietaryPreference)
  );
}

export function getDietaryPreferenceLabel(value: DietaryPreference) {
  return dietaryPreferenceLabels[value];
}

export function toStoredRsvpAttendees(
  values: unknown,
): StoredRsvpAttendee[] {
  if (!Array.isArray(values)) return [];

  return values
    .map((value): StoredRsvpAttendee | null => {
      if (typeof value !== "object" || value === null) return null;

      const row = value as Record<string, unknown>;
      const position = row.attendee_position;
      const name = row.name;
      const dietaryPreference = row.dietary_preference;
      const notes = row.notes;
      const songRequest = row.song_request;
      const detailsComplete = row.details_complete;

      if ((position !== 1 && position !== 2) || typeof detailsComplete !== "boolean") {
        return null;
      }

      if (!detailsComplete) {
        if (
          name !== null ||
          dietaryPreference !== "none" ||
          notes !== null ||
          songRequest !== null
        ) {
          return null;
        }

        return {
          position,
          name: null,
          dietaryPreference: "none",
          notes: null,
          songRequest: null,
          detailsComplete: false,
        };
      }

      if (
        typeof name !== "string" ||
        !name.trim() ||
        name.length > RSVP_ATTENDEE_NAME_MAX_LENGTH ||
        !isDietaryPreference(dietaryPreference) ||
        !(notes === null || typeof notes === "string") ||
        (typeof notes === "string" &&
          notes.length > RSVP_ATTENDEE_NOTES_MAX_LENGTH) ||
        !(songRequest === null || typeof songRequest === "string") ||
        (typeof songRequest === "string" &&
          songRequest.length > RSVP_ATTENDEE_SONG_REQUEST_MAX_LENGTH)
      ) {
        return null;
      }

      return {
        position,
        name,
        dietaryPreference,
        notes,
        songRequest,
        detailsComplete: true,
      };
    })
    .filter((attendee): attendee is StoredRsvpAttendee => attendee !== null)
    .sort((left, right) => left.position - right.position);
}

export function toRsvpAttendees(values: unknown): RsvpAttendee[] {
  return toStoredRsvpAttendees(values)
    .filter(
      (
        attendee,
      ): attendee is Extract<StoredRsvpAttendee, { detailsComplete: true }> =>
        attendee.detailsComplete,
    )
    .map(({ position, name, dietaryPreference, notes, songRequest }) => ({
      position,
      name,
      dietaryPreference,
      notes,
      songRequest,
    }));
}

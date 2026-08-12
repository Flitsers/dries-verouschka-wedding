import "server-only";

import type { InvitationType } from "@/app/i/[code]/invitation-types";
import type { DietaryPreference } from "@/lib/invitations/rsvp";

type RsvpStatus = "pending" | "attending" | "absent";

type ExportAttendee = {
  position: 1 | 2;
  name: string | null;
  dietaryPreference: DietaryPreference;
  notes: string | null;
  detailsComplete: boolean;
};

type ExportInvitation = {
  familyName: string;
  invitationType: InvitationType;
  allowedGuests: 1 | 2;
  rsvpStatus: RsvpStatus;
  attendingGuests: number | null;
  includesStadhuis: boolean;
  stadhuisAttending: boolean | null;
  attendees: ExportAttendee[];
};

const invitationTypeLabels: Record<InvitationType, string> = {
  full_day: "Volledige dag",
  reception_plus: "Receptie + diner + avondfeest",
  evening_only: "Avond",
};

const dietaryPreferenceLabels: Record<DietaryPreference, string> = {
  none: "Geen voorkeur",
  vegetarian: "Vegetarisch",
  vegan: "Vegan",
};

const dietaryPreferenceOrder: Record<DietaryPreference, number> = {
  vegan: 0,
  vegetarian: 1,
  none: 2,
};

const guestListColumns = [
  "Familie / uitnodiging",
  "Type uitnodiging",
  "Maximum gasten",
  "RSVP-status",
  "Aantal aanwezig",
  "Naam gast",
  "Eetvoorkeur",
  "Opmerkingen",
  "Uitgenodigd Stadhuis",
  "Stadhuis RSVP",
];

const foodColumns = [
  "Naam",
  "Familie / uitnodiging",
  "Eetvoorkeur",
  "Opmerkingen",
];

function asRecord(value: unknown, context: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Ongeldige exportdata voor ${context}.`);
  }

  return value as Record<string, unknown>;
}

function requiredTrimmedString(value: unknown, context: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Ontbrekende exportwaarde voor ${context}.`);
  }

  return value.trim();
}

function getInvitationType(value: unknown): InvitationType {
  if (
    value === "full_day" ||
    value === "reception_plus" ||
    value === "evening_only"
  ) {
    return value;
  }

  throw new Error("Ongeldig uitnodigingstype in exportdata.");
}

function getDietaryPreference(value: unknown): DietaryPreference {
  if (value === "none" || value === "vegetarian" || value === "vegan") {
    return value;
  }

  throw new Error("Ongeldige eetvoorkeur in exportdata.");
}

function getAttendee(value: unknown, context: string): ExportAttendee {
  const row = asRecord(value, context);
  const position = row.attendee_position;
  const detailsComplete = row.details_complete;

  if ((position !== 1 && position !== 2) || typeof detailsComplete !== "boolean") {
    throw new Error(`Ongeldige deelnemer in exportdata voor ${context}.`);
  }

  if (!detailsComplete) {
    return {
      position,
      name: null,
      dietaryPreference: "none",
      notes: null,
      detailsComplete: false,
    };
  }

  const name = requiredTrimmedString(row.name, `${context}, persoon ${position}`);
  const notes = typeof row.notes === "string" && row.notes.trim()
    ? row.notes.trim()
    : null;

  return {
    position,
    name,
    dietaryPreference: getDietaryPreference(row.dietary_preference),
    notes,
    detailsComplete: true,
  };
}

function getInvitation(value: unknown, index: number): ExportInvitation {
  const row = asRecord(value, `uitnodiging ${index + 1}`);
  const familyName = requiredTrimmedString(
    row.family_name,
    `uitnodiging ${index + 1}`,
  );
  const allowedGuests = row.allowed_guests;
  const answered = row.answered;

  if ((allowedGuests !== 1 && allowedGuests !== 2) || typeof answered !== "boolean") {
    throw new Error(`Ongeldige RSVP-exportdata voor ${familyName}.`);
  }

  let attendingGuests: number | null = null;
  let rsvpStatus: RsvpStatus = "pending";

  if (answered) {
    if (
      typeof row.attending_guests !== "number" ||
      !Number.isInteger(row.attending_guests) ||
      row.attending_guests < 0 ||
      row.attending_guests > allowedGuests
    ) {
      throw new Error(`Ongeldig aanwezigheidsaantal voor ${familyName}.`);
    }

    attendingGuests = row.attending_guests;
    rsvpStatus = attendingGuests === 0 ? "absent" : "attending";
  }

  const attendeeRows = Array.isArray(row.rsvp_attendees)
    ? row.rsvp_attendees.map((attendee, attendeeIndex) =>
        getAttendee(attendee, `${familyName}, rij ${attendeeIndex + 1}`),
      )
    : [];

  const attendees = rsvpStatus === "attending"
    ? Array.from({ length: attendingGuests ?? 0 }, (_, attendeeIndex) => {
        const position = (attendeeIndex + 1) as 1 | 2;
        return attendeeRows.find((attendee) => attendee.position === position) ?? {
          position,
          name: null,
          dietaryPreference: "none" as const,
          notes: null,
          detailsComplete: false,
        };
      })
    : [];

  return {
    familyName,
    invitationType: getInvitationType(row.invitation_type),
    allowedGuests,
    rsvpStatus,
    attendingGuests,
    includesStadhuis: row.includes_stadhuis === true,
    stadhuisAttending:
      row.stadhuis_attending === true || row.stadhuis_attending === false
        ? row.stadhuis_attending
        : null,
    attendees,
  };
}

function getInvitations(values: unknown): ExportInvitation[] {
  if (!Array.isArray(values)) {
    throw new Error("Ongeldige uitnodigingsdata voor CSV-export.");
  }

  const invitations = values.map(getInvitation);
  const collator = new Intl.Collator("nl-BE", { sensitivity: "base" });

  invitations.sort((left, right) =>
    collator.compare(left.familyName, right.familyName),
  );

  return invitations;
}

function getRsvpStatusLabel(status: RsvpStatus) {
  if (status === "attending") return "Aanwezig";
  if (status === "absent") return "Afwezig";
  return "Nog niet geantwoord";
}

function getStadhuisRsvpLabel(invitation: ExportInvitation) {
  if (!invitation.includesStadhuis) return "Niet van toepassing";
  if (invitation.stadhuisAttending === true) return "Komt mee";
  if (invitation.stadhuisAttending === false) return "Komt niet mee";
  return "Nog niet doorgegeven";
}

function protectSpreadsheetCell(value: string) {
  return /^[\t\r\n ]*[=+\-@]/.test(value) ? `'${value}` : value;
}

function escapeCsvCell(value: string | number) {
  const safeValue = protectSpreadsheetCell(String(value));
  return `"${safeValue.replace(/"/g, '""')}"`;
}

function toCsv(rows: (string | number)[][]) {
  return `\uFEFF${rows
    .map((row) => row.map(escapeCsvCell).join(";"))
    .join("\r\n")}\r\n`;
}

export function buildGuestListCsv(values: unknown) {
  const rows: (string | number)[][] = [guestListColumns];

  for (const invitation of getInvitations(values)) {
    const sharedValues: (string | number)[] = [
      invitation.familyName,
      invitationTypeLabels[invitation.invitationType],
      invitation.allowedGuests,
      getRsvpStatusLabel(invitation.rsvpStatus),
      invitation.attendingGuests ?? "",
    ];
    const stadhuisValues = [
      invitation.includesStadhuis ? "Ja" : "Nee",
      getStadhuisRsvpLabel(invitation),
    ];

    if (invitation.rsvpStatus !== "attending") {
      rows.push([...sharedValues, "", "", "", ...stadhuisValues]);
      continue;
    }

    for (const attendee of invitation.attendees) {
      rows.push([
        ...sharedValues,
        attendee.detailsComplete && attendee.name
          ? attendee.name
          : "Gegevens nog niet aangevuld",
        dietaryPreferenceLabels[attendee.dietaryPreference],
        attendee.notes ?? "",
        ...stadhuisValues,
      ]);
    }
  }

  return toCsv(rows);
}

export function buildFoodNotesCsv(values: unknown) {
  const collator = new Intl.Collator("nl-BE", { sensitivity: "base" });
  const people = getInvitations(values)
    .flatMap((invitation) =>
      invitation.rsvpStatus === "attending"
        ? invitation.attendees.flatMap((attendee) =>
            attendee.detailsComplete &&
            attendee.name &&
            (attendee.dietaryPreference !== "none" || attendee.notes)
              ? [{ invitation, attendee }]
              : [],
          )
        : [],
    )
    .sort((left, right) =>
      dietaryPreferenceOrder[left.attendee.dietaryPreference] -
        dietaryPreferenceOrder[right.attendee.dietaryPreference] ||
      collator.compare(left.attendee.name ?? "", right.attendee.name ?? "") ||
      collator.compare(left.invitation.familyName, right.invitation.familyName),
    );

  return toCsv([
    foodColumns,
    ...people.map(({ invitation, attendee }) => [
      attendee.name ?? "Gegevens nog niet aangevuld",
      invitation.familyName,
      dietaryPreferenceLabels[attendee.dietaryPreference],
      attendee.notes ?? "",
    ]),
  ]);
}

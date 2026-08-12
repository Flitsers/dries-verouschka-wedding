import "server-only";

import type {
  AdminGuestAttendee,
  AdminGuestInvitationType,
  AdminGuestOverview,
  AdminGuestOverviewInvitation,
  AdminGuestRsvpStatus,
} from "@/lib/admin/guest-overview-types";

const invitationTypeValues = new Set<AdminGuestInvitationType>([
  "full_day",
  "reception_plus",
  "evening_only",
]);

const rsvpStatusOrder: Record<AdminGuestRsvpStatus, number> = {
  pending: 0,
  attending: 1,
  absent: 2,
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function getInvitationType(value: unknown): AdminGuestInvitationType {
  return typeof value === "string" &&
    invitationTypeValues.has(value as AdminGuestInvitationType)
    ? value as AdminGuestInvitationType
    : "full_day";
}

function getAttendingGuests(
  answered: boolean,
  value: unknown,
  allowedGuests: number,
): number | null {
  return answered &&
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= allowedGuests
    ? value
    : null;
}

function getRsvpStatus(
  answered: boolean,
  attendingGuests: number | null,
): AdminGuestRsvpStatus {
  if (!answered || attendingGuests === null) return "pending";
  return attendingGuests === 0 ? "absent" : "attending";
}

function getAttendees(
  values: unknown,
  attendingGuests: number | null,
): AdminGuestAttendee[] {
  if (attendingGuests === null || attendingGuests === 0) return [];

  const rows = Array.isArray(values) ? values : [];

  return Array.from({ length: attendingGuests }, (_, index) => {
    const position = (index + 1) as 1 | 2;
    const row = rows
      .map(asRecord)
      .find((candidate) => candidate?.attendee_position === position);
    const name = typeof row?.name === "string" ? row.name.trim() : "";
    const detailsComplete = row?.details_complete === true && name !== "";

    return {
      position,
      name: detailsComplete ? name : null,
      detailsComplete,
    };
  });
}

export function buildAdminGuestOverview(values: unknown): AdminGuestOverview {
  const rows = Array.isArray(values) ? values : [];
  const invitations = rows.flatMap((value): AdminGuestOverviewInvitation[] => {
    const row = asRecord(value);
    if (!row) return [];

    const id = row.id;
    const familyName = typeof row.family_name === "string"
      ? row.family_name.trim()
      : "";
    const code = typeof row.code === "string" ? row.code.trim() : "";
    const allowedGuests = row.allowed_guests;
    const answered = row.answered === true;

    if (
      (typeof id !== "string" && typeof id !== "number") ||
      !familyName ||
      !code ||
      typeof allowedGuests !== "number" ||
      !Number.isInteger(allowedGuests) ||
      allowedGuests < 1 ||
      allowedGuests > 2
    ) {
      return [];
    }

    const attendingGuests = getAttendingGuests(
      answered,
      row.attending_guests,
      allowedGuests,
    );
    const rsvpStatus = getRsvpStatus(answered, attendingGuests);
    const includesStadhuis = row.includes_stadhuis === true;
    const stadhuisStatus = !includesStadhuis
      ? null
      : row.stadhuis_attending === true
        ? "attending" as const
        : row.stadhuis_attending === false
          ? "not_attending" as const
          : "pending" as const;

    return [{
      id,
      familyName,
      code,
      invitationType: getInvitationType(row.invitation_type),
      allowedGuests,
      attendingGuests,
      rsvpStatus,
      includesStadhuis,
      stadhuisStatus,
      attendees: getAttendees(row.rsvp_attendees, attendingGuests),
    }];
  });

  const collator = new Intl.Collator("nl-BE", { sensitivity: "base" });
  invitations.sort((left, right) => (
    rsvpStatusOrder[left.rsvpStatus] - rsvpStatusOrder[right.rsvpStatus] ||
    collator.compare(left.familyName, right.familyName) ||
    collator.compare(left.code, right.code)
  ));

  return {
    invitations,
    counts: {
      totalInvitations: invitations.length,
      pendingInvitations: invitations.filter(
        (invitation) => invitation.rsvpStatus === "pending",
      ).length,
      confirmedGuests: invitations.reduce(
        (total, invitation) => total +
          (invitation.rsvpStatus === "attending"
            ? invitation.attendingGuests ?? 0
            : 0),
        0,
      ),
      absentInvitations: invitations.filter(
        (invitation) => invitation.rsvpStatus === "absent",
      ).length,
      stadhuisConfirmedGuests: invitations.reduce(
        (total, invitation) => total +
          (invitation.stadhuisStatus === "attending"
            ? invitation.attendingGuests ?? 0
            : 0),
        0,
      ),
      stadhuisPendingInvitations: invitations.filter(
        (invitation) => invitation.stadhuisStatus === "pending",
      ).length,
    },
    hasStadhuisInvitations: invitations.some(
      (invitation) => invitation.includesStadhuis,
    ),
  };
}

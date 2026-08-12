export type AdminGuestInvitationType =
  | "full_day"
  | "reception_plus"
  | "evening_only";

export type AdminGuestRsvpStatus = "pending" | "attending" | "absent";

export type AdminGuestStadhuisStatus =
  | "attending"
  | "not_attending"
  | "pending";

export type AdminGuestAttendee = {
  position: 1 | 2;
  name: string | null;
  detailsComplete: boolean;
};

export type AdminGuestOverviewInvitation = {
  id: string | number;
  familyName: string;
  code: string;
  invitationType: AdminGuestInvitationType;
  allowedGuests: number;
  attendingGuests: number | null;
  rsvpStatus: AdminGuestRsvpStatus;
  includesStadhuis: boolean;
  stadhuisStatus: AdminGuestStadhuisStatus | null;
  attendees: AdminGuestAttendee[];
};

export type AdminGuestOverview = {
  invitations: AdminGuestOverviewInvitation[];
  counts: {
    totalInvitations: number;
    pendingInvitations: number;
    confirmedGuests: number;
    absentInvitations: number;
    stadhuisConfirmedGuests: number;
    stadhuisPendingInvitations: number;
  };
  hasStadhuisInvitations: boolean;
};

export const invitationTypes = [
  "full_day",
  "reception_plus",
  "evening_only",
] as const;

export type InvitationType = (typeof invitationTypes)[number];

export function isInvitationType(value: unknown): value is InvitationType {
  return typeof value === "string" && invitationTypes.includes(value as InvitationType);
}

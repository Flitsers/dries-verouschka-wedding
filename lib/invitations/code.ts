export const INVITATION_CODE_ALPHABET =
  "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const INVITATION_CODE_LENGTH = 7;
export const INVITATION_CODE_PATTERN =
  /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{7}$/;

export function formatInvitationCodeInput(value: string): string {
  return value.trim().toUpperCase().slice(0, INVITATION_CODE_LENGTH);
}

export function normalizeInvitationCode(value: string): string | null {
  const normalizedCode = value.trim().toUpperCase();

  return INVITATION_CODE_PATTERN.test(normalizedCode)
    ? normalizedCode
    : null;
}

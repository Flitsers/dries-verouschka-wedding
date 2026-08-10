import "server-only";

import { randomBytes } from "node:crypto";
import {
  INVITATION_CODE_ALPHABET,
  INVITATION_CODE_LENGTH,
} from "@/lib/invitations/code";

const unbiasedByteLimit =
  256 - (256 % INVITATION_CODE_ALPHABET.length);

export function generateInvitationCode(): string {
  let code = "";

  while (code.length < INVITATION_CODE_LENGTH) {
    const bytes = randomBytes(INVITATION_CODE_LENGTH);

    for (const byte of bytes) {
      if (byte >= unbiasedByteLimit) continue;

      code +=
        INVITATION_CODE_ALPHABET[
          byte % INVITATION_CODE_ALPHABET.length
        ];

      if (code.length === INVITATION_CODE_LENGTH) break;
    }
  }

  return code;
}

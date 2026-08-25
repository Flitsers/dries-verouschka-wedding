import type { InvitationType } from "@/app/i/[code]/invitation-types";
import { getWeddingScheduleStartTime, wedding } from "@/lib/wedding";

const countdownTimeByInvitationType: Record<InvitationType, string> = {
  full_day: getWeddingScheduleStartTime("Ceremonie"),
  reception_plus: getWeddingScheduleStartTime("Receptie"),
  evening_only: getWeddingScheduleStartTime("Avondfeest"),
};

// 19 December is standard time (CET) in Europe/Brussels.
const belgiumWeddingOffset = "+01:00";

export function getInvitationCountdownTargetTimestamp(
  invitationType: InvitationType,
) {
  const eventTime = countdownTimeByInvitationType[invitationType].match(
    /^\d{2}:\d{2}/,
  )?.[0];

  if (!eventTime) {
    throw new Error(`Ongeldig tijdstip voor countdown: ${invitationType}`);
  }

  const targetTimestamp = Date.parse(
    `${wedding.event.date}T${eventTime}:00${belgiumWeddingOffset}`,
  );

  if (!Number.isFinite(targetTimestamp)) {
    throw new Error(`Ongeldige datum voor countdown: ${invitationType}`);
  }

  return targetTimestamp;
}

export function getRequestTimestamp() {
  return Date.now();
}

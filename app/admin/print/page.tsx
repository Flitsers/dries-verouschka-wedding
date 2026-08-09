import QRCode from "qrcode";
import BulkInvitationPrint from "@/components/admin/BulkInvitationPrint";
import { requireAdmin } from "@/lib/admin-auth";
import { getCanonicalInvitationUrl } from "@/lib/site-url";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type InvitationType = "full_day" | "reception_plus" | "evening_only";

export default async function BulkPrintPage() {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("invites")
    .select("code, family_name, allowed_guests, invitation_type");

  if (error) {
    console.error("Bulk print invitations could not be loaded", error);
    throw new Error("De uitnodigingen konden niet worden geladen.");
  }

  const sortedInvitations = (data ?? [])
    .map((invite) => ({
      code: String(invite.code),
      familyName: String(invite.family_name),
      allowedGuests: Number(invite.allowed_guests),
      invitationType: (invite.invitation_type === "reception_plus" || invite.invitation_type === "evening_only"
        ? invite.invitation_type
        : "full_day") as InvitationType,
    }))
    .sort((current, next) => current.familyName.localeCompare(next.familyName, "nl", { sensitivity: "base" }));
  const invitations = await Promise.all(sortedInvitations.map(async (invite) => ({
    ...invite,
    qrSource: await QRCode.toDataURL(getCanonicalInvitationUrl(invite.code), {
      width: 720,
      margin: 2,
      errorCorrectionLevel: "M",
    }),
  })));

  return <BulkInvitationPrint invitations={invitations} />;
}

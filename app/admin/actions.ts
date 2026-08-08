"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type DeleteInviteState = {
  error: string | null;
};

export async function deleteInvite(
  _previousState: DeleteInviteState,
  formData: FormData,
): Promise<DeleteInviteState> {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const inviteId = formData.get("invite_id");

  if (typeof inviteId !== "string" || !inviteId) {
    return { error: "De uitnodiging kon niet worden geïdentificeerd." };
  }

  const { data: invite, error: inviteLookupError } = await supabase
    .from("invites")
    .select("id, code")
    .eq("id", inviteId)
    .single();

  if (inviteLookupError || !invite) {
    console.error("Invite lookup before deletion failed", inviteLookupError);
    return { error: "De uitnodiging kon niet worden gevonden." };
  }

  const { count: legacyGuestCount, error: guestCountError } = await supabase
    .from("guests")
    .select("id", { count: "exact", head: true })
    .eq("invite_code", invite.code);

  if (guestCountError) {
    console.error("Legacy guest lookup before deletion failed", guestCountError);
    return { error: "De gekoppelde historische gastgegevens konden niet worden gecontroleerd. De uitnodiging is niet verwijderd." };
  }

  const { data: deletedGuests, error: guestDeleteError } = await supabase
    .from("guests")
    .delete()
    .eq("invite_code", invite.code)
    .select("id");

  if (guestDeleteError) {
    console.error("Legacy guest deletion failed", {
      code: guestDeleteError.code,
      details: guestDeleteError.details,
      hint: guestDeleteError.hint,
      message: guestDeleteError.message,
    });
    return { error: "De gekoppelde historische gastgegevens konden niet worden verwijderd. De uitnodiging is niet verwijderd." };
  }

  if ((deletedGuests?.length ?? 0) < (legacyGuestCount ?? 0)) {
    console.error("Legacy guest deletion did not remove every matching row", {
      expected: legacyGuestCount,
      deleted: deletedGuests?.length ?? 0,
      inviteCode: invite.code,
    });
    return { error: "De gekoppelde historische gastgegevens konden niet volledig worden verwijderd. De uitnodiging is niet verwijderd." };
  }

  const { data: deletedInvite, error: inviteDeleteError } = await supabase
    .from("invites")
    .delete()
    .eq("id", invite.id)
    .select("id")
    .maybeSingle();

  if (inviteDeleteError) {
    console.error("Invite deletion failed", {
      code: inviteDeleteError.code,
      details: inviteDeleteError.details,
      hint: inviteDeleteError.hint,
      message: inviteDeleteError.message,
    });
    return { error: "De uitnodiging kon niet worden verwijderd. Probeer opnieuw." };
  }

  if (!deletedInvite) {
    console.error("Invite deletion did not remove a row", { inviteId: invite.id });
    return { error: "De uitnodiging kon niet worden verwijderd. Controleer je toegangsrechten en probeer opnieuw." };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

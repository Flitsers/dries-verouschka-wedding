import InviteDashboard from "@/components/admin/InviteDashboard";
import { getAdminFoodOverview } from "@/lib/admin/food-overview";
import { buildAdminGuestOverview } from "@/lib/admin/guest-overview";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function AdminPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const [{ data: inviteData, error: invitesError }, foodOverview] = await Promise.all([
    supabase
      .from("invites")
      .select(`
        *,
        rsvp_attendees (
          attendee_position,
          name,
          details_complete
        )
      `)
      .order("family_name"),
    getAdminFoodOverview(),
  ]);

  if (invitesError) {
    console.error("Failed to load the admin invitation dashboard", invitesError);
    throw new Error("The admin dashboard could not be loaded.");
  }

  const guestOverview = buildAdminGuestOverview(inviteData ?? []);

  return (
    <InviteDashboard
      invites={inviteData ?? []}
      foodOverview={foodOverview}
      guestOverview={guestOverview}
    />
  );
}

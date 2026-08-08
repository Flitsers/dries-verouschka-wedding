import InviteDashboard from "@/components/admin/InviteDashboard";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function AdminPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { data: inviteData } = await supabase
    .from("invites")
    .select("*")
    .order("family_name");

  return <InviteDashboard invites={inviteData ?? []} />;
}

import InviteDashboard from "@/components/admin/InviteDashboard";
import { supabase } from "@/lib/supabase";

export default async function AdminPage() {
  const [{ data: inviteData }, { data: guestData }] = await Promise.all([
    supabase.from("invites").select("*").order("family_name"),
    supabase.from("guests").select("invite_code, attending"),
  ]);

  return <InviteDashboard invites={inviteData ?? []} guests={guestData ?? []} />;
}

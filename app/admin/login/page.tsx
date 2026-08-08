import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { isAllowedAdminEmail } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLoginPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user && isAllowedAdminEmail(user.email)) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#183328] px-5 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#d4b06a]">Wedding management</p>
        <h1 className="mt-3 text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>Beheerder</h1>
        <p className="mt-3 text-sm text-white/55">Log in om de uitnodigingen te beheren.</p>
        <LoginForm />
      </div>
    </main>
  );
}

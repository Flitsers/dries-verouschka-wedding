import NewInviteForm from "@/components/admin/NewInviteForm";

export default function NewInvitePage() {
  return (
    <main className="min-h-screen bg-[#183328] px-5 py-10 text-white sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10">
        <h1 className="text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
          Nieuwe uitnodiging
        </h1>
        <NewInviteForm />
      </div>
    </main>
  );
}

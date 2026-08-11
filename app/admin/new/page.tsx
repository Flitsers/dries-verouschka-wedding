import NewInviteForm from "@/components/admin/NewInviteForm";
import { requireAdmin } from "@/lib/admin-auth";

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const createInviteErrors = new Set([
  "Kies een uitnodigingsnaam en één of twee personen.",
  "Kies een geldig type uitnodiging.",
  "De uitnodiging kon niet worden aangemaakt. Probeer opnieuw.",
]);

export default async function NewInvitePage({ searchParams }: Props) {
  await requireAdmin();
  const { error } = await searchParams;
  const initialError =
    typeof error === "string" && createInviteErrors.has(error) ? error : null;

  return (
    <main className="min-h-screen bg-[#183328] px-5 py-10 text-white sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10">
        <h1 className="text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
          Nieuwe uitnodiging
        </h1>
        <NewInviteForm initialError={initialError} />
      </div>
    </main>
  );
}

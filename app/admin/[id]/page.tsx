import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import CopyLinkButton from "@/components/admin/CopyLinkButton";
import QRCodeCard from "@/components/admin/QRCodeCard";
import { supabase } from "@/lib/supabase";

const invitationTypes = {
  full_day: "Volledige dag",
  reception_plus: "Vanaf receptie",
  evening_only: "Enkel avondfeest",
} as const;

async function updateInvitationType(formData: FormData) {
  "use server";

  const id = formData.get("id");
  const invitationType = formData.get("invitation_type");

  if (
    typeof id !== "string" ||
    typeof invitationType !== "string" ||
    !(invitationType in invitationTypes)
  ) {
    throw new Error("Ongeldig type uitnodiging.");
  }

  const { error } = await supabase
    .from("invites")
    .update({ invitation_type: invitationType })
    .eq("id", id);

  if (error) {
    console.error("Invitation type update failed", {
      code: error.code,
      details: error.details,
      hint: error.hint,
      message: error.message,
    });
    throw new Error("Type uitnodiging kon niet worden bijgewerkt.");
  }

  redirect(`/admin/${id}`);
}

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InviteDetails({ params }: Props) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("invites")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const invitationType = typeof data.invitation_type === "string" && data.invitation_type in invitationTypes
    ? data.invitation_type as keyof typeof invitationTypes
    : "full_day";
  const attendingGuests = typeof data.attending_guests === "number" ? data.attending_guests : null;
  const attendanceLabel = !data.answered || attendingGuests === null
    ? "Nog niet geantwoord"
    : attendingGuests === 0
      ? "Niet aanwezig"
      : `${attendingGuests} ${attendingGuests === 1 ? "persoon" : "personen"} aanwezig`;

  return (
    <main className="min-h-screen bg-[#183328] px-5 py-10 text-white md:px-8 md:py-14">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#d4b06a] transition hover:text-[#e2c17f]">
          ← Terug naar dashboard
        </Link>

        <header className="mt-8 border-b border-white/10 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#d4b06a]">Uitnodiging</p>
          <h1 className="mt-3 text-5xl md:text-6xl" style={{ fontFamily: "var(--font-cormorant)" }}>{data.family_name}</h1>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
            <p className="text-sm text-white/50">Code</p>
            <p className="mt-3 font-mono text-3xl tracking-[0.12em] text-[#d4b06a]">{data.code}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
            <p className="text-sm text-white/50">Aantal personen</p>
            <p className="mt-3 text-3xl text-white">{data.allowed_guests}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
            <p className="text-sm text-white/50">Email</p>
            <p className="mt-3 break-words text-white/85">{data.email || "-"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
            <p className="text-sm text-white/50">Status</p>
            <p className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-sm ${data.answered ? "bg-emerald-400/10 text-emerald-200" : "bg-amber-300/10 text-amber-100"}`}>
              {attendanceLabel}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 md:col-span-2">
            <p className="text-sm text-white/50">Type uitnodiging</p>
            <form action={updateInvitationType} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input type="hidden" name="id" value={data.id} />
              <select
                name="invitation_type"
                defaultValue={invitationType}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white sm:max-w-xs"
              >
                <option value="full_day">Volledige dag</option>
                <option value="reception_plus">Vanaf receptie</option>
                <option value="evening_only">Enkel avondfeest</option>
              </select>
              <button className="rounded-full border border-[#d4b06a] px-5 py-3 text-sm text-[#d4b06a] transition hover:bg-[#d4b06a] hover:text-[#183328]">
                Opslaan
              </button>
            </form>
            <p className="mt-3 text-sm text-white/50">Huidig: {invitationTypes[invitationType]}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`/i/${data.code}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#d4b06a] px-6 py-3 text-[#d4b06a] transition hover:bg-[#d4b06a] hover:text-[#183328]">
            Open uitnodiging
          </a>
          <CopyLinkButton code={data.code} />
        </div>

        <div className="mt-8 max-w-sm">
          <QRCodeCard code={data.code} />
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import CopyLinkButton from "@/components/admin/CopyLinkButton";
import AdminRsvpForm from "@/components/admin/AdminRsvpForm";
import DeleteInviteButton from "@/components/admin/DeleteInviteButton";
import PrintInvitationSummary, { PrintButton } from "@/components/admin/PrintInvitationSummary";
import QRCodeCard from "@/components/admin/QRCodeCard";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const invitationTypes = {
  full_day: "Volledige dag",
  reception_plus: "Vanaf receptie",
  evening_only: "Enkel avondfeest",
} as const;

async function updateInvitationType(formData: FormData) {
  "use server";

  await requireAdmin();
  const supabase = createSupabaseAdminClient();

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
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { id } = await params;
  const requestHeaders = await headers();

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
  const attendanceLabel = !data.answered
    ? "Nog niet geantwoord"
    : attendingGuests === null
      ? "Historisch antwoord"
      : attendingGuests === 0
        ? "Niet aanwezig"
        : `${attendingGuests} aanwezig`;
  const attendanceBadge = !data.answered
    ? "border-amber-300/20 bg-amber-300/10 text-amber-100"
    : attendingGuests === null
      ? "border-[#d4b06a]/25 bg-[#d4b06a]/10 text-[#f5d998]"
      : attendingGuests === 0
        ? "border-rose-300/20 bg-rose-400/10 text-rose-100"
        : "border-emerald-300/20 bg-emerald-400/10 text-emerald-200";
  const publicInvitePath = `/i/${data.code}`;
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || requestHeaders.get("host");
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol || (host?.startsWith("localhost") ? "http" : "https");
  const publicInviteUrl = host ? `${protocol}://${host}${publicInvitePath}` : publicInvitePath;

  return (
    <main className="min-h-screen bg-[#183328] px-5 py-10 text-white print:bg-white print:p-0 md:px-8 md:py-14">
      <div className="mx-auto max-w-5xl print:hidden">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#d4b06a] transition hover:text-[#e2c17f]">
          ← Terug naar dashboard
        </Link>

        <header className="mt-8 border-b border-white/10 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#d4b06a]">Uitnodiging</p>
          <h1 className="mt-3 text-5xl md:text-6xl" style={{ fontFamily: "var(--font-cormorant)" }}>{data.family_name}</h1>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex rounded-full border border-sky-200/15 bg-sky-200/[0.07] px-3 py-1.5 text-xs font-medium text-sky-100">
              {invitationTypes[invitationType]}
            </span>
            <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${attendanceBadge}`}>
              {attendanceLabel}
            </span>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)] lg:items-start">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05]" aria-labelledby="summary-heading">
              <div className="border-b border-white/10 px-6 py-5">
                <h2 id="summary-heading" className="text-2xl" style={{ fontFamily: "var(--font-cormorant)" }}>Overzicht</h2>
              </div>
              <dl className="grid sm:grid-cols-2">
                {[
                  ["Aantal uitgenodigd", `${data.allowed_guests} ${data.allowed_guests === 1 ? "persoon" : "personen"}`],
                  ["Aantal aanwezig", data.answered && attendingGuests !== null ? String(attendingGuests) : "—"],
                  ["RSVP-status", attendanceLabel],
                  ["Uitnodigingstype", invitationTypes[invitationType]],
                  ["E-mailadres", data.email || "Niet opgegeven"],
                  ["Telefoonnummer", data.phone || "Niet opgegeven"],
                  ["Uitnodigingscode", data.code],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-white/[0.07] px-6 py-5 odd:sm:border-r last:border-b-0">
                    <dt className="text-xs uppercase tracking-[0.12em] text-white/40">{label}</dt>
                    <dd className={`mt-2 break-words text-white/85 ${label === "Uitnodigingscode" ? "font-mono tracking-[0.1em] text-[#d4b06a]" : ""}`}>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <AdminRsvpForm
              inviteId={data.id}
              allowedGuests={data.allowed_guests}
              answered={data.answered}
              attendingGuests={attendingGuests}
            />

            <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-6" aria-labelledby="type-heading">
              <h2 id="type-heading" className="text-2xl" style={{ fontFamily: "var(--font-cormorant)" }}>Uitnodigingstype</h2>
              <p className="mt-2 text-sm text-white/50">Bepaal tot welke onderdelen van de dag deze uitnodiging toegang geeft.</p>
              <form action={updateInvitationType} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input type="hidden" name="id" value={data.id} />
                <select name="invitation_type" defaultValue={invitationType} className="w-full rounded-xl border border-white/10 bg-[#10261d] px-4 py-3 text-white outline-none focus:border-[#d4b06a] sm:max-w-xs">
                  <option value="full_day">Volledige dag</option>
                  <option value="reception_plus">Vanaf receptie</option>
                  <option value="evening_only">Enkel avondfeest</option>
                </select>
                <button className="w-full rounded-full border border-[#d4b06a] px-5 py-3 text-sm text-[#d4b06a] transition hover:bg-[#d4b06a] hover:text-[#183328] sm:w-auto">Opslaan</button>
              </form>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-[#10261d]/55 p-6" aria-labelledby="link-heading">
              <h2 id="link-heading" className="text-2xl" style={{ fontFamily: "var(--font-cormorant)" }}>Uitnodigingslink</h2>
              <p className="mt-2 text-sm text-white/50">De persoonlijke openbare link voor deze uitnodiging.</p>
              <p className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-sm text-[#d4b06a]">{publicInvitePath}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <a href={publicInvitePath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-[#d4b06a] px-5 py-3 text-sm text-[#d4b06a] transition hover:bg-[#d4b06a] hover:text-[#183328]">Open uitnodiging</a>
                <CopyLinkButton code={data.code} />
                <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2"><PrintButton /></div>
              </div>
            </section>
            <QRCodeCard code={data.code} />
          </aside>
        </div>

        <section className="mt-10 rounded-3xl border border-rose-300/15 bg-rose-400/[0.04] p-6" aria-labelledby="danger-heading">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="danger-heading" className="text-2xl text-rose-100" style={{ fontFamily: "var(--font-cormorant)" }}>Gevarenzone</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/45">Verwijder deze uitnodiging en de gekoppelde historische gastgegevens permanent.</p>
            </div>
            <DeleteInviteButton inviteId={data.id} familyName={data.family_name} />
          </div>
        </section>
      </div>
      <PrintInvitationSummary
        familyName={data.family_name}
        invitationType={invitationTypes[invitationType]}
        allowedGuests={data.allowed_guests}
        attendanceLabel={attendanceLabel}
        attendingGuests={data.answered ? attendingGuests : null}
        email={data.email || null}
        code={data.code}
        publicUrl={publicInviteUrl}
      />
    </main>
  );
}

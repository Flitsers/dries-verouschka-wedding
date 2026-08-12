"use client";

import { CheckCircle2, Clock3, ExternalLink, Plus, Printer, Search, Users, XCircle } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import DeleteInviteButton from "@/components/admin/DeleteInviteButton";
import FoodOverviewSection from "@/components/admin/FoodOverviewSection";
import GuestOverviewSection from "@/components/admin/GuestOverviewSection";
import LogoutButton from "@/components/admin/LogoutButton";
import type { AdminFoodOverview } from "@/lib/admin/food-overview-types";
import type { AdminGuestOverview } from "@/lib/admin/guest-overview-types";

type Invite = {
  id: string;
  family_name: string;
  code: string;
  email: string | null;
  allowed_guests: number;
  attending_guests: number | null;
  answered: boolean;
  invitation_type: string | null;
  includes_stadhuis: boolean;
  stadhuis_attending: boolean | null;
};

type Props = {
  invites: Invite[];
  foodOverview: AdminFoodOverview;
  guestOverview: AdminGuestOverview;
};

type Filter = "all" | "yes" | "no" | "pending" | "received";
type InvitationType = "full_day" | "reception_plus" | "evening_only";
type InviteStatus = "yes" | "no" | "pending" | "received";

const invitationTypes: Record<InvitationType, string> = {
  full_day: "Volledige dag",
  reception_plus: "Vanaf receptie",
  evening_only: "Enkel avondfeest",
};

function getInvitationType(invite: Invite): InvitationType {
  return typeof invite.invitation_type === "string" && invite.invitation_type in invitationTypes
    ? invite.invitation_type as InvitationType
    : "full_day";
}

function includesStadhuis(invite: Invite) {
  return getInvitationType(invite) === "full_day" && invite.includes_stadhuis === true;
}

function getAttendingGuests(invite: Invite) {
  if (!invite.answered) return null;
  if (Number.isInteger(invite.attending_guests)) return invite.attending_guests;
  return null;
}

function getInviteStatus(invite: Invite): InviteStatus {
  const attendingGuests = getAttendingGuests(invite);

  if (!invite.answered || attendingGuests === null) return invite.answered ? "received" : "pending";
  return attendingGuests === 0 ? "no" : "yes";
}

function getPendingGuestCount(invite: Invite) {
  return invite.answered ? 0 : invite.allowed_guests;
}

function getDecliningGuestCount(invite: Invite) {
  const attendingGuests = getAttendingGuests(invite);
  return attendingGuests === null ? 0 : invite.allowed_guests - attendingGuests;
}

function StatusBadge({ invite }: { invite: Invite }) {
  const status = getInviteStatus(invite);
  const styles = {
    yes: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
    no: "border-rose-300/20 bg-rose-400/10 text-rose-100",
    pending: "border-amber-300/20 bg-amber-300/10 text-amber-100",
    received: "border-[#d4b06a]/25 bg-[#d4b06a]/10 text-[#f5d998]",
  };
  const labels = {
    yes: `${invite.attending_guests} aanwezig`,
    no: "Niet aanwezig",
    pending: "Nog niet geantwoord",
    received: "Historisch antwoord",
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "yes" ? "bg-emerald-300" : status === "no" ? "bg-rose-300" : status === "pending" ? "bg-amber-200" : "bg-[#d4b06a]"}`} />
      {labels[status]}
    </span>
  );
}

function InvitationTypeBadge({ type }: { type: InvitationType }) {
  return (
    <span className="inline-flex rounded-full border border-sky-200/15 bg-sky-200/[0.07] px-3 py-1.5 text-xs font-medium text-sky-100">
      {invitationTypes[type]}
    </span>
  );
}

function InviteActions({ invite }: { invite: Invite }) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:justify-end">
      <Link href={`/admin/${invite.id}`} className="rounded-full border border-[#d4b06a]/55 px-4 py-2 text-sm text-[#d4b06a] transition hover:bg-[#d4b06a] hover:text-[#183328]">Open</Link>
      <a href={`/i/${invite.code}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-white/40 hover:text-white">
        Uitnodiging <ExternalLink size={14} aria-hidden="true" />
      </a>
      <DeleteInviteButton inviteId={invite.id} familyName={invite.family_name} />
    </div>
  );
}

export default function InviteDashboard({ invites, foodOverview, guestOverview }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [invitationTypeFilter, setInvitationTypeFilter] = useState<"all" | InvitationType>("all");
  const totalGuests = invites.reduce((total, invite) => total + invite.allowed_guests, 0);
  const pendingGuests = invites.reduce((total, invite) => total + getPendingGuestCount(invite), 0);
  const attendingGuests = invites.reduce((total, invite) => total + (getAttendingGuests(invite) ?? 0), 0);
  const decliningGuests = invites.reduce((total, invite) => total + getDecliningGuestCount(invite), 0);
  const answeredGuestCapacity = invites.reduce((total, invite) => total + (invite.answered ? invite.allowed_guests : 0), 0);
  const responsePercentage = totalGuests ? Math.round((answeredGuestCapacity / totalGuests) * 100) : 0;
  const unknownLegacyResponses = invites.filter((invite) => invite.answered && invite.attending_guests === null);

  const typeStatistics = (Object.keys(invitationTypes) as InvitationType[]).map((type) => {
    const typeInvites = invites.filter((invite) => getInvitationType(invite) === type);

    return {
      type,
      label: invitationTypes[type],
      invited: typeInvites.reduce((total, invite) => total + invite.allowed_guests, 0),
      attending: typeInvites.reduce((total, invite) => total + (getAttendingGuests(invite) ?? 0), 0),
      declined: typeInvites.reduce((total, invite) => total + getDecliningGuestCount(invite), 0),
      pending: typeInvites.reduce((total, invite) => total + getPendingGuestCount(invite), 0),
    };
  });

  const statsForType = (type: InvitationType) => typeStatistics.find((statistic) => statistic.type === type)!;
  const fullDay = statsForType("full_day");
  const receptionPlus = statsForType("reception_plus");
  const eveningOnly = statsForType("evening_only");
  const stadhuisInvites = invites.filter(includesStadhuis);
  const stadhuisAttending = stadhuisInvites.reduce(
    (total, invite) => {
      const attending = invite.attending_guests;
      return total +
        (invite.stadhuis_attending === true &&
        typeof attending === "number" &&
        Number.isInteger(attending)
          ? attending
          : 0);
    },
    0,
  );
  const stadhuisPending = stadhuisInvites.reduce(
    (total, invite) => {
      if (!invite.answered) return total + invite.allowed_guests;
      if (
        invite.stadhuis_attending === null &&
        typeof invite.attending_guests === "number" &&
        invite.attending_guests > 0
      ) {
        return total + invite.attending_guests;
      }
      return total;
    },
    0,
  );
  const eventAttendance = [
    { event: "Stadhuis", attending: stadhuisAttending, pending: stadhuisPending },
    { event: "Ceremonie", attending: fullDay.attending, pending: fullDay.pending },
    { event: "Dagsreceptie", attending: fullDay.attending + receptionPlus.attending, pending: fullDay.pending + receptionPlus.pending },
    { event: "Diner", attending: fullDay.attending + receptionPlus.attending, pending: fullDay.pending + receptionPlus.pending },
    { event: "Avondreceptie", attending: eveningOnly.attending, pending: eveningOnly.pending },
    { event: "Avondfeest", attending: fullDay.attending + receptionPlus.attending + eveningOnly.attending, pending: fullDay.pending + receptionPlus.pending + eveningOnly.pending },
  ];

  const filteredInvites = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return invites.filter((invite) => {
      const status = getInviteStatus(invite);
      const matchesFilter = filter === "all" || status === filter;
      const matchesInvitationType = invitationTypeFilter === "all" || getInvitationType(invite) === invitationTypeFilter;
      const matchesQuery = !normalizedQuery || [invite.family_name, invite.email ?? "", invite.code]
        .some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesFilter && matchesInvitationType && matchesQuery;
    });
  }, [filter, invitationTypeFilter, invites, query]);
  const hasActiveFilters = query.trim() !== "" || filter !== "all" || invitationTypeFilter !== "all";

  function clearFilters() {
    setQuery("");
    setFilter("all");
    setInvitationTypeFilter("all");
  }

  const statistics = [
    { label: "Totaal uitgenodigd", value: totalGuests, detail: "Personen over alle uitnodigingen", icon: Users, color: "text-[#d4b06a]" },
    { label: "Bevestigd aanwezig", value: attendingGuests, detail: "Personen met bevestigde aanwezigheid", icon: CheckCircle2, color: "text-emerald-300" },
    { label: "Niet aanwezig", value: decliningGuests, detail: "Bevestigde afmeldingen", icon: XCircle, color: "text-rose-200" },
    { label: "Nog niet geantwoord", value: pendingGuests, detail: "Genodigden op open uitnodigingen", icon: Clock3, color: "text-amber-200" },
    { label: "Antwoordpercentage", value: `${responsePercentage}%`, detail: `${answeredGuestCapacity} van ${totalGuests} personen beantwoord`, icon: CheckCircle2, color: "text-[#d4b06a]" },
  ];

  return (
    <main className="min-h-screen bg-[#183328] px-5 py-10 text-white md:px-8 md:py-14">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#d4b06a]">Wedding management</p>
            <h1 className="mt-3 text-5xl leading-none md:text-6xl" style={{ fontFamily: "var(--font-cormorant)" }}>Dashboard</h1>
            <p className="mt-4 text-white/60">Overzicht van uitnodigingen en RSVP-antwoorden.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <LogoutButton />
            <Link href="/admin/print" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm text-white/75 transition hover:border-white/50 hover:text-white sm:w-auto">
              <Printer size={17} aria-hidden="true" /> Uitnodigingen afdrukken
            </Link>
            <Link href="/admin/new" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d4b06a] px-6 py-3.5 font-semibold text-[#183328] transition hover:-translate-y-0.5 hover:bg-[#e2c17f] sm:w-auto">
              <Plus size={18} aria-hidden="true" /> Nieuwe uitnodiging
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="RSVP statistieken">
          {statistics.map((statistic) => {
            const Icon = statistic.icon;

            return (
              <article key={statistic.label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-white/60">{statistic.label}</p>
                  <Icon size={18} className={statistic.color} aria-hidden="true" />
                </div>
                <p className={`mt-5 text-4xl font-semibold ${statistic.color}`}>{statistic.value}</p>
                <p className="mt-2 text-xs text-white/40">{statistic.detail}</p>
              </article>
            );
          })}
        </section>

        {unknownLegacyResponses.length > 0 && (
          <p className="mt-4 rounded-xl border border-[#d4b06a]/20 bg-[#d4b06a]/[0.07] px-4 py-3 text-sm text-[#f5d998]/80">
            {unknownLegacyResponses.length} historische {unknownLegacyResponses.length === 1 ? "uitnodiging heeft" : "uitnodigingen hebben"} wel een antwoord, maar geen betrouwbaar aantal aanwezigen. Deze {unknownLegacyResponses.length === 1 ? "is" : "zijn"} niet meegerekend bij aanwezig en niet aanwezig.
          </p>
        )}

        <section className="mt-10" aria-labelledby="invitation-type-statistics">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4b06a]">Uitnodigingstypes</p>
              <h2 id="invitation-type-statistics" className="mt-2 text-3xl" style={{ fontFamily: "var(--font-cormorant)" }}>Aanwezigheid per uitnodiging</h2>
            </div>
            <p className="text-sm text-white/50">Personen, geen uitnodigingsrecords</p>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {typeStatistics.map((statistic) => (
              <article key={statistic.type} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                <h3 className="text-2xl text-white" style={{ fontFamily: "var(--font-cormorant)" }}>{statistic.label}</h3>
                <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 text-sm">
                  <div><dt className="text-white/45">Uitgenodigd</dt><dd className="mt-1 text-2xl font-semibold text-white">{statistic.invited}</dd></div>
                  <div><dt className="text-white/45">Bevestigd aanwezig</dt><dd className="mt-1 text-2xl font-semibold text-emerald-200">{statistic.attending}</dd></div>
                  <div><dt className="text-white/45">Niet aanwezig</dt><dd className="mt-1 text-xl text-rose-200">{statistic.declined}</dd></div>
                  <div><dt className="text-white/45">Nog geen antwoord</dt><dd className="mt-1 text-xl text-amber-100">{statistic.pending}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="event-attendance">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4b06a]">Verwachte aanwezigheid</p>
            <h2 id="event-attendance" className="mt-2 text-3xl" style={{ fontFamily: "var(--font-cormorant)" }}>Bevestigd per moment</h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {eventAttendance.map((item) => (
              <article key={item.event} className="flex items-end justify-between gap-4 rounded-2xl border border-white/10 bg-[#10261d]/55 p-5">
                <div>
                  <h3 className="text-2xl text-white" style={{ fontFamily: "var(--font-cormorant)" }}>{item.event}</h3>
                  <p className="mt-2 text-sm text-white/50">Pending potentieel: <span className="text-amber-100">{item.pending}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/40">Bevestigd</p>
                  <p className="mt-1 text-4xl font-semibold text-emerald-200">{item.attending}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <GuestOverviewSection overview={guestOverview} />

        <FoodOverviewSection overview={foodOverview} />

        <section className="mt-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#10261d]/55 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-5 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <div>
              <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)" }}>Uitnodigingen</h2>
              <p className="mt-1 text-sm text-white/50">
                {hasActiveFilters ? `${filteredInvites.length} van ${invites.length} uitnodigingen` : `${invites.length} uitnodigingen`}
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="relative min-w-0 sm:w-72">
                <span className="sr-only">Zoek uitnodigingen</span>
                <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45" aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek naam, e-mail of code" className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#d4b06a] focus:ring-2 focus:ring-[#d4b06a]/20" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2 lg:flex">
                <label>
                  <span className="sr-only">Filter op RSVP-status</span>
                  <select value={filter} onChange={(event) => setFilter(event.target.value as Filter)} className="w-full rounded-xl border border-white/10 bg-[#10261d] px-4 py-3 text-sm text-white outline-none focus:border-[#d4b06a]">
                    <option value="all">Alle RSVP-statussen</option>
                    <option value="yes">Aanwezig</option>
                    <option value="no">Niet aanwezig</option>
                    <option value="pending">Nog niet geantwoord</option>
                    <option value="received">Historisch antwoord</option>
                  </select>
                </label>
                <label>
                  <span className="sr-only">Filter op uitnodigingstype</span>
                  <select value={invitationTypeFilter} onChange={(event) => setInvitationTypeFilter(event.target.value as "all" | InvitationType)} className="w-full rounded-xl border border-white/10 bg-[#10261d] px-4 py-3 text-sm text-white outline-none focus:border-[#d4b06a]">
                    <option value="all">Alle types</option>
                    <option value="full_day">Volledige dag</option>
                    <option value="reception_plus">Vanaf receptie</option>
                    <option value="evening_only">Enkel avondfeest</option>
                  </select>
                </label>
              </div>
              {hasActiveFilters && (
                <button type="button" onClick={clearFilters} className="self-start px-2 py-2 text-sm text-white/55 transition hover:text-white lg:self-auto">
                  Wis filters
                </button>
              )}
            </div>
          </div>

          {invites.length > 0 && (
          <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[960px] text-left">
              <thead className="sticky top-0 z-10 bg-[#10261d] text-xs uppercase tracking-[0.16em] text-white/45">
                <tr>
                  <th className="px-6 py-4 font-medium">Familie</th>
                  <th className="px-6 py-4 font-medium">Uitnodiging</th>
                  <th className="px-6 py-4 font-medium">Uitgenodigd</th>
                  <th className="px-6 py-4 font-medium">RSVP status</th>
                  <th className="px-6 py-4 font-medium">E-mail</th>
                  <th className="px-6 py-4 text-right font-medium">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvites.map((invite, index) => {
                  const invitationType = getInvitationType(invite);
                  return (
                    <tr key={invite.id} className={`border-t border-white/[0.07] transition-colors hover:bg-white/[0.05] ${index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}`}>
                      <td className="px-6 py-5">
                        <p className="font-medium text-white">{invite.family_name}</p>
                        <p className="mt-1 font-mono text-xs tracking-[0.1em] text-[#d4b06a]/75">{invite.code}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          <InvitationTypeBadge type={invitationType} />
                          {includesStadhuis(invite) && (
                            <span className="inline-flex rounded-full border border-[#d4b06a]/25 bg-[#d4b06a]/10 px-3 py-1.5 text-xs font-medium text-[#f5d998]">
                              Stadhuis
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-white/75">{invite.allowed_guests} {invite.allowed_guests === 1 ? "persoon" : "personen"}</td>
                      <td className="px-6 py-5"><StatusBadge invite={invite} /></td>
                      <td className="max-w-52 truncate px-6 py-5 text-sm text-white/60" title={invite.email ?? undefined}>{invite.email || "—"}</td>
                      <td className="px-6 py-5">
                        <InviteActions invite={invite} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-white/[0.07] md:hidden">
            {filteredInvites.map((invite) => {
              const invitationType = getInvitationType(invite);
              return (
                <article key={invite.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-white">{invite.family_name}</h3>
                      <p className="mt-1 font-mono text-xs tracking-[0.1em] text-[#d4b06a]/75">{invite.code}</p>
                    </div>
                    <StatusBadge invite={invite} />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <InvitationTypeBadge type={invitationType} />
                    {includesStadhuis(invite) && (
                      <span className="inline-flex rounded-full border border-[#d4b06a]/25 bg-[#d4b06a]/10 px-3 py-1.5 text-xs font-medium text-[#f5d998]">
                        Stadhuis
                      </span>
                    )}
                    <span className="text-sm text-white/65">{invite.allowed_guests} {invite.allowed_guests === 1 ? "persoon uitgenodigd" : "personen uitgenodigd"}</span>
                  </div>
                  {invite.email && <p className="mt-3 break-all text-sm text-white/55">{invite.email}</p>}
                  <div className="mt-5 border-t border-white/[0.07] pt-4"><InviteActions invite={invite} /></div>
                </article>
              );
            })}
          </div>
          </>
          )}

          {!invites.length && (
            <div className="px-6 py-14 text-center">
              <p className="text-white/55">Er zijn nog geen uitnodigingen.</p>
              <Link href="/admin/new" className="mt-5 inline-flex rounded-full border border-[#d4b06a] px-5 py-2.5 text-sm text-[#d4b06a] transition hover:bg-[#d4b06a] hover:text-[#183328]">Nieuwe uitnodiging maken</Link>
            </div>
          )}
          {invites.length > 0 && !filteredInvites.length && (
            <div className="px-6 py-14 text-center">
              <p className="text-white/55">Geen uitnodigingen gevonden met deze filters.</p>
              <button type="button" onClick={clearFilters} className="mt-4 text-sm text-[#d4b06a] hover:text-[#e2c17f]">Wis filters</button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

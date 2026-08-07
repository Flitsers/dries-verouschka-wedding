"use client";

import { CheckCircle2, Clock3, ExternalLink, Plus, Search, Users, XCircle } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import DeleteInviteButton from "@/components/admin/DeleteInviteButton";

type Invite = {
  id: string;
  family_name: string;
  code: string;
  allowed_guests: number;
  attending_guests: number | null;
  answered: boolean;
  invitation_type: string | null;
};

type Props = {
  invites: Invite[];
  guests: LegacyGuestResponse[];
};

type LegacyGuestResponse = {
  invite_code: string;
  attending: string | null;
};

type Filter = "all" | "yes" | "no" | "pending";
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

function isGuestAttendance(value: string | null): value is "Ja" | "Nee" {
  return value === "Ja" || value === "Nee";
}

function getLegacyAttendingGuests(invite: Invite, guests: LegacyGuestResponse[]) {
  // Legacy RSVP data is reliable only when every invited person has a final answer.
  if (!invite.answered || invite.attending_guests !== null || guests.length !== invite.allowed_guests) {
    return null;
  }

  if (!guests.every((guest) => isGuestAttendance(guest.attending))) {
    return null;
  }

  return guests.filter((guest) => guest.attending === "Ja").length;
}

function getAttendingGuests(invite: Invite, guests: LegacyGuestResponse[]) {
  if (!invite.answered) return null;
  if (Number.isInteger(invite.attending_guests)) return invite.attending_guests;
  return getLegacyAttendingGuests(invite, guests);
}

function getInviteStatus(invite: Invite, guests: LegacyGuestResponse[]): InviteStatus {
  const attendingGuests = getAttendingGuests(invite, guests);

  if (!invite.answered || attendingGuests === null) return invite.answered ? "received" : "pending";
  return attendingGuests === 0 ? "no" : "yes";
}

function getPendingGuestCount(invite: Invite) {
  return invite.answered ? 0 : invite.allowed_guests;
}

function getDecliningGuestCount(invite: Invite, guests: LegacyGuestResponse[]) {
  const attendingGuests = getAttendingGuests(invite, guests);
  return attendingGuests === null ? 0 : invite.allowed_guests - attendingGuests;
}

function StatusBadge({ status }: { status: InviteStatus }) {
  const styles = {
    yes: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
    no: "border-rose-300/20 bg-rose-400/10 text-rose-100",
    pending: "border-amber-300/20 bg-amber-300/10 text-amber-100",
    received: "border-[#d4b06a]/25 bg-[#d4b06a]/10 text-[#f5d998]",
  };
  const labels = {
    yes: "Ja",
    no: "Nee",
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

function formatAttendance(invite: Invite, guests: LegacyGuestResponse[]) {
  const attendingGuests = getAttendingGuests(invite, guests);
  if (!invite.answered) return "Nog niet geantwoord";
  if (attendingGuests === null) return "Historisch antwoord";
  if (attendingGuests === 0) return "Niet aanwezig";
  return `${invite.allowed_guests} uitgenodigd · ${attendingGuests} aanwezig`;
}

export default function InviteDashboard({ invites, guests }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [invitationTypeFilter, setInvitationTypeFilter] = useState<"all" | InvitationType>("all");
  const legacyGuestsByInvite = useMemo(() => {
    return guests.reduce<Record<string, LegacyGuestResponse[]>>((groups, guest) => {
      groups[guest.invite_code] ??= [];
      groups[guest.invite_code].push(guest);
      return groups;
    }, {});
  }, [guests]);

  const totalGuests = invites.reduce((total, invite) => total + invite.allowed_guests, 0);
  const pendingGuests = invites.reduce((total, invite) => total + getPendingGuestCount(invite), 0);
  const attendingGuests = invites.reduce((total, invite) => total + (getAttendingGuests(invite, legacyGuestsByInvite[invite.code] ?? []) ?? 0), 0);
  const decliningGuests = invites.reduce((total, invite) => total + getDecliningGuestCount(invite, legacyGuestsByInvite[invite.code] ?? []), 0);
  const answeredInvites = invites.filter((invite) => invite.answered).length;
  const responsePercentage = invites.length ? Math.round((answeredInvites / invites.length) * 100) : 0;

  const typeStatistics = (Object.keys(invitationTypes) as InvitationType[]).map((type) => {
    const typeInvites = invites.filter((invite) => getInvitationType(invite) === type);

    return {
      type,
      label: invitationTypes[type],
      invited: typeInvites.reduce((total, invite) => total + invite.allowed_guests, 0),
      attending: typeInvites.reduce((total, invite) => total + (getAttendingGuests(invite, legacyGuestsByInvite[invite.code] ?? []) ?? 0), 0),
      declined: typeInvites.reduce((total, invite) => total + getDecliningGuestCount(invite, legacyGuestsByInvite[invite.code] ?? []), 0),
      pending: typeInvites.reduce((total, invite) => total + getPendingGuestCount(invite), 0),
    };
  });

  const statsForType = (type: InvitationType) => typeStatistics.find((statistic) => statistic.type === type)!;
  const fullDay = statsForType("full_day");
  const receptionPlus = statsForType("reception_plus");
  const eveningOnly = statsForType("evening_only");
  const eventAttendance = [
    { event: "Stadhuis", attending: fullDay.attending, pending: fullDay.pending },
    { event: "Ceremonie", attending: fullDay.attending, pending: fullDay.pending },
    { event: "Dagsreceptie", attending: fullDay.attending + receptionPlus.attending, pending: fullDay.pending + receptionPlus.pending },
    { event: "Diner", attending: fullDay.attending + receptionPlus.attending, pending: fullDay.pending + receptionPlus.pending },
    { event: "Avondreceptie", attending: eveningOnly.attending, pending: eveningOnly.pending },
    { event: "Avondfeest", attending: fullDay.attending + receptionPlus.attending + eveningOnly.attending, pending: fullDay.pending + receptionPlus.pending + eveningOnly.pending },
  ];

  const filteredInvites = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return invites.filter((invite) => {
      const status = getInviteStatus(invite, legacyGuestsByInvite[invite.code] ?? []);
      const matchesFilter = filter === "all" || status === filter;
      const matchesInvitationType = invitationTypeFilter === "all" || getInvitationType(invite) === invitationTypeFilter;
      const matchesQuery = !normalizedQuery || [invite.family_name, invite.code]
        .some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesFilter && matchesInvitationType && matchesQuery;
    });
  }, [filter, invitationTypeFilter, invites, legacyGuestsByInvite, query]);

  const statistics = [
    { label: "Totaal genodigden", value: totalGuests, detail: "Uit alle uitnodigingen", icon: Users, color: "text-[#d4b06a]" },
    { label: "Aanwezig", value: attendingGuests, detail: "Bevestigde personen", icon: CheckCircle2, color: "text-emerald-300" },
    { label: "Niet aanwezig", value: decliningGuests, detail: "Bevestigde afmeldingen", icon: XCircle, color: "text-rose-200" },
    { label: "Nog niet geantwoord", value: pendingGuests, detail: "Genodigden op open uitnodigingen", icon: Clock3, color: "text-amber-200" },
    { label: "Antwoordratio", value: `${responsePercentage}%`, detail: `${answeredInvites} van ${invites.length} uitnodigingen`, icon: CheckCircle2, color: "text-[#d4b06a]" },
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
          <Link href="/admin/new" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d4b06a] px-6 py-3.5 font-semibold text-[#183328] transition hover:-translate-y-0.5 hover:bg-[#e2c17f] sm:w-auto">
            <Plus size={18} aria-hidden="true" /> Nieuwe uitnodiging
          </Link>
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
                  <div><dt className="text-white/45">Genodigd</dt><dd className="mt-1 text-xl text-white">{statistic.invited}</dd></div>
                  <div><dt className="text-white/45">Aanwezig</dt><dd className="mt-1 text-xl text-emerald-200">{statistic.attending}</dd></div>
                  <div><dt className="text-white/45">Niet aanwezig</dt><dd className="mt-1 text-xl text-rose-200">{statistic.declined}</dd></div>
                  <div><dt className="text-white/45">Open</dt><dd className="mt-1 text-xl text-amber-100">{statistic.pending}</dd></div>
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
                  <p className="mt-2 text-sm text-white/50">{item.pending} nog open</p>
                </div>
                <p className="text-4xl font-semibold text-emerald-200">{item.attending}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#10261d]/55 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-5 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <div>
              <h2 className="text-3xl" style={{ fontFamily: "var(--font-cormorant)" }}>Uitnodigingen</h2>
              <p className="mt-1 text-sm text-white/50">{filteredInvites.length} van {invites.length} weergegeven</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative min-w-0 sm:w-72">
                <span className="sr-only">Zoek uitnodigingen</span>
                <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45" aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek familie of code" className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#d4b06a] focus:ring-2 focus:ring-[#d4b06a]/20" />
              </label>
              <div className="flex rounded-xl border border-white/10 bg-black/15 p-1" aria-label="Filter uitnodigingen">
                {([ ["all", "Alle"], ["yes", "Ja"], ["no", "Nee"], ["pending", "Open"] ] as const).map(([value, label]) => (
                  <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-lg px-3 py-2 text-xs transition ${filter === value ? "bg-[#d4b06a] font-semibold text-[#183328]" : "text-white/60 hover:text-white"}`}>
                    {label}
                  </button>
                ))}
              </div>
              <label className="sr-only" htmlFor="invitation-type-filter">Filter op uitnodigingstype</label>
              <select id="invitation-type-filter" value={invitationTypeFilter} onChange={(event) => setInvitationTypeFilter(event.target.value as "all" | InvitationType)} className="rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-xs text-white outline-none focus:border-[#d4b06a]">
                <option value="all">Alle types</option>
                <option value="full_day">Volledige dag</option>
                <option value="reception_plus">Vanaf receptie</option>
                <option value="evening_only">Enkel avondfeest</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[880px] w-full text-left">
              <thead className="sticky top-0 z-10 bg-[#10261d] text-xs uppercase tracking-[0.16em] text-white/45">
                <tr>
                  <th className="px-6 py-4 font-medium">Familie</th>
                  <th className="px-6 py-4 font-medium">Code</th>
                  <th className="px-6 py-4 font-medium">Personen</th>
                  <th className="px-6 py-4 font-medium">Uitnodiging</th>
                  <th className="px-6 py-4 font-medium">RSVP status</th>
                  <th className="px-6 py-4 font-medium">Aanwezigheid</th>
                  <th className="px-6 py-4 text-right font-medium">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvites.map((invite, index) => {
                  const invitationType = getInvitationType(invite);
                  return (
                    <tr key={invite.id} className={`border-t border-white/[0.07] transition-colors hover:bg-white/[0.05] ${index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}`}>
                      <td className="px-6 py-5 font-medium text-white">{invite.family_name}</td>
                      <td className="px-6 py-5 font-mono text-sm tracking-[0.12em] text-[#d4b06a]">{invite.code}</td>
                      <td className="px-6 py-5 text-white/75">{invite.allowed_guests}</td>
                      <td className="px-6 py-5 text-sm text-white/75">{invitationTypes[invitationType]}</td>
                      <td className="px-6 py-5"><StatusBadge status={getInviteStatus(invite, legacyGuestsByInvite[invite.code] ?? [])} /></td>
                      <td className="px-6 py-5 text-sm text-white/65">{formatAttendance(invite, legacyGuestsByInvite[invite.code] ?? [])}</td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/${invite.id}`} className="rounded-full border border-[#d4b06a]/55 px-4 py-2 text-sm text-[#d4b06a] transition hover:bg-[#d4b06a] hover:text-[#183328]">Open</Link>
                          <a href={`/i/${invite.code}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-white/40 hover:text-white">
                            Uitnodiging <ExternalLink size={14} aria-hidden="true" />
                          </a>
                          <DeleteInviteButton inviteId={invite.id} familyName={invite.family_name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!filteredInvites.length && <p className="px-6 py-14 text-center text-white/55">Geen uitnodigingen gevonden voor deze zoekopdracht.</p>}
        </section>
      </div>
    </main>
  );
}

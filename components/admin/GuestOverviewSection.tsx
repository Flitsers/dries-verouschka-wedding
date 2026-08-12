"use client";

import { Check, Copy, Search, Users, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  AdminGuestInvitationType,
  AdminGuestOverview,
  AdminGuestOverviewInvitation,
  AdminGuestRsvpStatus,
  AdminGuestStadhuisStatus,
} from "@/lib/admin/guest-overview-types";

type Props = {
  overview: AdminGuestOverview;
};

type RsvpFilter = "all" | AdminGuestRsvpStatus;
type InvitationTypeFilter = "all" | AdminGuestInvitationType;
type StadhuisFilter = "all" | AdminGuestStadhuisStatus;

const invitationTypeLabels: Record<AdminGuestInvitationType, string> = {
  full_day: "Volledige dag",
  reception_plus: "Receptie + diner + avondfeest",
  evening_only: "Avond",
};

const stadhuisStatusLabels: Record<AdminGuestStadhuisStatus, string> = {
  attending: "Komt mee",
  not_attending: "Komt niet mee",
  pending: "Nog niet doorgegeven",
};

function getAttendanceLabel(invitation: AdminGuestOverviewInvitation) {
  if (invitation.rsvpStatus === "pending") return "Nog niet geantwoord";
  if (invitation.rsvpStatus === "absent") return "Niemand aanwezig";

  const count = invitation.attendingGuests ?? 0;
  return `${count} ${count === 1 ? "persoon aanwezig" : "personen aanwezig"}`;
}

function getStatusBadgeStyles(status: AdminGuestRsvpStatus) {
  if (status === "attending") {
    return "border-emerald-300/20 bg-emerald-400/10 text-emerald-200";
  }
  if (status === "absent") {
    return "border-rose-300/20 bg-rose-400/10 text-rose-100";
  }
  return "border-amber-300/20 bg-amber-300/10 text-amber-100";
}

function formatCopyEntry(invitation: AdminGuestOverviewInvitation) {
  if (invitation.rsvpStatus === "pending") {
    return `* ${invitation.familyName} — max. ${invitation.allowedGuests} ${invitation.allowedGuests === 1 ? "persoon" : "personen"}`;
  }

  if (invitation.rsvpStatus === "absent") {
    return `* ${invitation.familyName} — 0 personen`;
  }

  const count = invitation.attendingGuests ?? 0;
  const lines = [
    `* ${invitation.familyName} — ${count} ${count === 1 ? "persoon" : "personen"}`,
    ...invitation.attendees.map((attendee) =>
      `  ${attendee.detailsComplete && attendee.name ? attendee.name : "Gegevens nog niet aangevuld"}`
    ),
  ];

  if (invitation.stadhuisStatus) {
    lines.push(`  Stadhuis: ${stadhuisStatusLabels[invitation.stadhuisStatus]}`);
  }

  return lines.join("\n");
}

function formatGuestOverviewText(invitations: AdminGuestOverviewInvitation[]) {
  const groups = [
    {
      label: "Nog niet geantwoord",
      invitations: invitations.filter(
        (invitation) => invitation.rsvpStatus === "pending",
      ),
    },
    {
      label: "Aanwezig",
      invitations: invitations.filter(
        (invitation) => invitation.rsvpStatus === "attending",
      ),
    },
    {
      label: "Afwezig",
      invitations: invitations.filter(
        (invitation) => invitation.rsvpStatus === "absent",
      ),
    },
  ].filter((group) => group.invitations.length > 0);

  return [
    "Gastenoverzicht",
    ...groups.flatMap((group) => [
      "",
      group.label,
      "",
      ...group.invitations.map(formatCopyEntry),
    ]),
  ].join("\n");
}

function copyWithTemporaryTextarea(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);

  try {
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

function AttendeeNames({ invitation }: { invitation: AdminGuestOverviewInvitation }) {
  if (invitation.rsvpStatus !== "attending") {
    return <span className="text-white/35">—</span>;
  }

  return (
    <ul className="space-y-1 text-sm text-white/75">
      {invitation.attendees.map((attendee) => (
        <li key={attendee.position} className="break-words">
          {attendee.detailsComplete && attendee.name
            ? attendee.name
            : <span className="text-amber-100">Gegevens nog niet aangevuld</span>}
        </li>
      ))}
    </ul>
  );
}

export default function GuestOverviewSection({ overview }: Props) {
  const [query, setQuery] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState<RsvpFilter>("all");
  const [invitationTypeFilter, setInvitationTypeFilter] =
    useState<InvitationTypeFilter>("all");
  const [stadhuisFilter, setStadhuisFilter] =
    useState<StadhuisFilter>("all");
  const [copied, setCopied] = useState(false);

  const filteredInvitations = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("nl-BE");

    return overview.invitations.filter((invitation) => {
      const matchesQuery = !normalizedQuery || [
        invitation.familyName,
        invitation.code,
        ...invitation.attendees.flatMap((attendee) => attendee.name ?? []),
      ].some((value) => value.toLocaleLowerCase("nl-BE").includes(normalizedQuery));
      const matchesRsvp = rsvpFilter === "all" ||
        invitation.rsvpStatus === rsvpFilter;
      const matchesType = invitationTypeFilter === "all" ||
        invitation.invitationType === invitationTypeFilter;
      const matchesStadhuis = stadhuisFilter === "all" ||
        invitation.stadhuisStatus === stadhuisFilter;

      return matchesQuery && matchesRsvp && matchesType && matchesStadhuis;
    });
  }, [invitationTypeFilter, overview.invitations, query, rsvpFilter, stadhuisFilter]);

  const hasActiveFilters = query.trim() !== "" ||
    rsvpFilter !== "all" ||
    invitationTypeFilter !== "all" ||
    stadhuisFilter !== "all";

  function clearFilters() {
    setQuery("");
    setRsvpFilter("all");
    setInvitationTypeFilter("all");
    setStadhuisFilter("all");
  }

  async function copyOverview() {
    const text = formatGuestOverviewText(overview.invitations);
    let succeeded = false;

    if (window.isSecureContext && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        succeeded = true;
      } catch {
        succeeded = false;
      }
    }

    if (!succeeded) succeeded = copyWithTemporaryTextarea(text);
    if (!succeeded) return;

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const summaryCards = [
    {
      label: "Uitnodigingen totaal",
      value: overview.counts.totalInvitations,
      detail: "uitnodigingen",
      color: "text-[#f5d998]",
    },
    {
      label: "Nog niet geantwoord",
      value: overview.counts.pendingInvitations,
      detail: "uitnodigingen",
      color: "text-amber-100",
    },
    {
      label: "Bevestigde gasten",
      value: overview.counts.confirmedGuests,
      detail: "personen",
      color: "text-emerald-200",
    },
    {
      label: "Afgezegd / 0 personen",
      value: overview.counts.absentInvitations,
      detail: "uitnodigingen",
      color: "text-rose-100",
    },
    ...(overview.hasStadhuisInvitations
      ? [
          {
            label: "Stadhuis bevestigd",
            value: overview.counts.stadhuisConfirmedGuests,
            detail: "personen",
            color: "text-emerald-200",
          },
          {
            label: "Stadhuis nog open",
            value: overview.counts.stadhuisPendingInvitations,
            detail: "uitnodigingen",
            color: "text-amber-100",
          },
        ]
      : []),
  ];

  return (
    <section
      className="mt-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#10261d]/55 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
      aria-labelledby="guest-overview-title"
    >
      <div className="flex flex-col gap-5 border-b border-white/10 p-5 sm:flex-row sm:items-end sm:justify-between md:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4b06a]">Master gastenlijst</p>
          <h2 id="guest-overview-title" className="mt-2 text-3xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Gastenoverzicht
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/50">
            Alle uitnodigingen, RSVP-statussen en namen van aanwezige gasten.
          </p>
        </div>
        {overview.invitations.length > 0 && (
          <button
            type="button"
            onClick={copyOverview}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#d4b06a]/70 px-5 py-2.5 text-sm font-medium text-[#f5d998] transition hover:bg-[#d4b06a] hover:text-[#183328] sm:w-auto"
          >
            {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
            <span aria-live="polite">{copied ? "Gekopieerd!" : "Kopieer gastenoverzicht"}</span>
          </button>
        )}
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 md:p-6">
        {summaryCards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm text-white/60">{card.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${card.color}`}>{card.value}</p>
            <p className="mt-1 text-xs text-white/35">{card.detail}</p>
          </article>
        ))}
      </div>

      <div className="border-y border-white/10 p-5 md:p-6">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(16rem,1.5fr)_repeat(3,minmax(10rem,1fr))]">
          <label className="relative min-w-0">
            <span className="sr-only">Zoek op naam of familie</span>
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Zoek op naam of familie"
              className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#d4b06a] focus:ring-2 focus:ring-[#d4b06a]/20"
            />
          </label>
          <label>
            <span className="sr-only">Filter gastenoverzicht op RSVP-status</span>
            <select value={rsvpFilter} onChange={(event) => setRsvpFilter(event.target.value as RsvpFilter)} className="w-full rounded-xl border border-white/10 bg-[#10261d] px-4 py-3 text-sm text-white outline-none focus:border-[#d4b06a]">
              <option value="all">RSVP: Alle</option>
              <option value="pending">Nog niet geantwoord</option>
              <option value="attending">Aanwezig</option>
              <option value="absent">Afwezig</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Filter gastenoverzicht op uitnodigingstype</span>
            <select value={invitationTypeFilter} onChange={(event) => setInvitationTypeFilter(event.target.value as InvitationTypeFilter)} className="w-full rounded-xl border border-white/10 bg-[#10261d] px-4 py-3 text-sm text-white outline-none focus:border-[#d4b06a]">
              <option value="all">Type: Alle</option>
              <option value="full_day">Volledige dag</option>
              <option value="reception_plus">Receptie + diner + avondfeest</option>
              <option value="evening_only">Avond</option>
            </select>
          </label>
          {overview.hasStadhuisInvitations && (
            <label>
              <span className="sr-only">Filter gastenoverzicht op Stadhuis-status</span>
              <select value={stadhuisFilter} onChange={(event) => setStadhuisFilter(event.target.value as StadhuisFilter)} className="w-full rounded-xl border border-white/10 bg-[#10261d] px-4 py-3 text-sm text-white outline-none focus:border-[#d4b06a]">
                <option value="all">Stadhuis: Alle</option>
                <option value="attending">Komt mee</option>
                <option value="not_attending">Komt niet mee</option>
                <option value="pending">Nog niet doorgegeven</option>
              </select>
            </label>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-white/50">
            {filteredInvitations.length} van {overview.invitations.length} uitnodigingen
          </p>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1.5 text-[#d4b06a] transition hover:text-[#e2c17f]">
              <X size={15} aria-hidden="true" /> Wis filters
            </button>
          )}
        </div>
      </div>

      {overview.invitations.length === 0 ? (
        <div className="px-5 py-12 text-center md:px-6">
          <Users size={24} className="mx-auto text-white/30" aria-hidden="true" />
          <p className="mt-3 text-sm text-white/55">Er zijn nog geen uitnodigingen.</p>
        </div>
      ) : filteredInvitations.length === 0 ? (
        <div className="px-5 py-12 text-center md:px-6">
          <p className="text-sm text-white/55">Geen uitnodigingen gevonden met deze zoekopdracht of filters.</p>
          <button type="button" onClick={clearFilters} className="mt-4 text-sm text-[#d4b06a] transition hover:text-[#e2c17f]">Toon alles</button>
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <table className="w-full table-fixed text-left">
              <thead className="bg-white/[0.025] text-xs uppercase tracking-[0.12em] text-white/45">
                <tr>
                  <th className="w-[22%] px-6 py-4 font-medium">Familie / uitnodiging</th>
                  <th className="w-[20%] px-6 py-4 font-medium">Type / maximum</th>
                  <th className="w-[18%] px-6 py-4 font-medium">RSVP-status</th>
                  <th className="w-[15%] px-6 py-4 font-medium">Stadhuis</th>
                  <th className="w-[19%] px-6 py-4 font-medium">Aanwezigen</th>
                  <th className="w-[6%] px-4 py-4 text-right font-medium"><span className="sr-only">Openen</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredInvitations.map((invitation) => (
                  <tr key={invitation.code} className="border-t border-white/[0.07] align-top transition hover:bg-white/[0.03]">
                    <td className="break-words px-6 py-5">
                      <p className="font-medium text-white">{invitation.familyName}</p>
                      <p className="mt-1 font-mono text-xs tracking-[0.08em] text-[#d4b06a]/75">{invitation.code}</p>
                    </td>
                    <td className="break-words px-6 py-5 text-sm text-white/70">
                      <p>{invitationTypeLabels[invitation.invitationType]}</p>
                      <p className="mt-1 text-xs text-white/40">Max. {invitation.allowedGuests} {invitation.allowedGuests === 1 ? "persoon" : "personen"}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusBadgeStyles(invitation.rsvpStatus)}`}>
                        {getAttendanceLabel(invitation)}
                      </span>
                    </td>
                    <td className="break-words px-6 py-5 text-sm text-white/65">
                      {invitation.stadhuisStatus ? stadhuisStatusLabels[invitation.stadhuisStatus] : <span className="text-white/25">—</span>}
                    </td>
                    <td className="px-6 py-5"><AttendeeNames invitation={invitation} /></td>
                    <td className="px-4 py-5 text-right">
                      <Link href={`/admin/${invitation.id}`} className="text-sm text-[#d4b06a] transition hover:text-[#e2c17f]">Open</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:hidden md:p-6">
            {filteredInvitations.map((invitation) => (
              <article key={invitation.code} className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex flex-col gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-semibold text-white">{invitation.familyName}</h3>
                    <p className="mt-1 font-mono text-xs tracking-[0.08em] text-[#d4b06a]/75">{invitation.code}</p>
                  </div>
                  <span className={`self-start rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusBadgeStyles(invitation.rsvpStatus)}`}>
                    {getAttendanceLabel(invitation)}
                  </span>
                </div>
                <dl className="mt-4 space-y-3 border-t border-white/[0.07] pt-4 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-white/35">Uitnodiging</dt>
                    <dd className="mt-1 break-words text-white/70">{invitationTypeLabels[invitation.invitationType]} · max. {invitation.allowedGuests}</dd>
                  </div>
                  {invitation.stadhuisStatus && (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.12em] text-white/35">Stadhuis</dt>
                      <dd className="mt-1 text-white/70">{stadhuisStatusLabels[invitation.stadhuisStatus]}</dd>
                    </div>
                  )}
                  {invitation.rsvpStatus === "attending" && (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.12em] text-white/35">Aanwezigen</dt>
                      <dd className="mt-1"><AttendeeNames invitation={invitation} /></dd>
                    </div>
                  )}
                </dl>
                <Link href={`/admin/${invitation.id}`} className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#d4b06a]/55 px-4 py-2 text-sm text-[#d4b06a] transition hover:bg-[#d4b06a] hover:text-[#183328]">
                  Open uitnodiging
                </Link>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

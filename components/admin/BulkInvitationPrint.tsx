"use client";

import Image from "next/image";
import Link from "next/link";
import { Printer } from "lucide-react";
import { Fragment, useMemo, useState } from "react";

type InvitationType = "full_day" | "reception_plus" | "evening_only";

type Invitation = {
  code: string;
  familyName: string;
  allowedGuests: number;
  invitationType: InvitationType;
  qrSource: string;
};

type Props = {
  invitations: Invitation[];
};

const invitationTypeLabels: Record<InvitationType, string> = {
  full_day: "Volledige dag",
  reception_plus: "Vanaf receptie",
  evening_only: "Enkel avondfeest",
};

export default function BulkInvitationPrint({ invitations }: Props) {
  const [filter, setFilter] = useState<"all" | InvitationType>("all");
  const filteredInvitations = useMemo(
    () => invitations.filter((invite) => filter === "all" || invite.invitationType === filter),
    [filter, invitations],
  );

  return (
    <main className="min-h-screen bg-[#183328] px-4 py-8 text-white print:bg-white print:p-0 sm:px-6">
      <style>{`
        @media print {
          @page { size: 148mm 210mm; margin: 0; }
          html, body { background: #fff !important; }
          .bulk-print-card { width: 148mm !important; height: 210mm !important; break-after: page; page-break-after: always; }
          .bulk-print-card:last-child { break-after: auto; page-break-after: auto; }
        }
      `}</style>

      <section className="mx-auto mb-8 max-w-5xl rounded-3xl border border-white/10 bg-white/[0.05] p-5 print:hidden sm:p-6" aria-label="Afdrukinstellingen">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/admin" className="text-sm text-[#d4b06a] transition hover:text-[#e2c17f]">← Terug naar dashboard</Link>
            <h1 className="mt-4 text-4xl sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>Uitnodigingen afdrukken</h1>
            <p className="mt-2 text-sm text-white/50">{filteredInvitations.length} van {invitations.length} uitnodigingen</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label>
              <span className="sr-only">Filter uitnodigingen</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value as "all" | InvitationType)} className="w-full rounded-xl border border-white/10 bg-[#10261d] px-4 py-3 text-sm text-white outline-none focus:border-[#d4b06a]">
                <option value="all">Alle uitnodigingen</option>
                {(Object.keys(invitationTypeLabels) as InvitationType[]).map((type) => <option key={type} value={type}>{invitationTypeLabels[type]}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => window.print()} disabled={!filteredInvitations.length} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d4b06a] px-6 py-3 font-semibold text-[#183328] transition hover:bg-[#e2c17f] disabled:cursor-not-allowed disabled:opacity-50">
              <Printer size={18} aria-hidden="true" /> Alles afdrukken
            </button>
          </div>
        </div>
      </section>

      {!filteredInvitations.length && <p className="mx-auto max-w-5xl py-20 text-center text-white/55 print:hidden">Geen uitnodigingen gevonden voor dit type.</p>}

      <div className="mx-auto flex max-w-[148mm] flex-col gap-8 print:block print:max-w-none print:gap-0">
        {filteredInvitations.map((invite) => (
          <Fragment key={invite.code}>
            <article className="bulk-print-card relative flex min-h-[210mm] w-full max-w-[148mm] items-center justify-center overflow-hidden bg-[#f8f4eb] shadow-2xl print:max-w-none print:shadow-none">
              <Image
                src="/images/invitation-front.png"
                alt="Voorzijde van de huwelijksuitnodiging van Dries en Verouschka"
                width={1060}
                height={1484}
                unoptimized
                className="h-full max-h-[210mm] w-full max-w-[148mm] object-contain"
              />
            </article>

            <article className="bulk-print-card relative flex min-h-[210mm] w-full max-w-[148mm] flex-col items-center justify-center overflow-hidden bg-[#fbf8f0] px-[14mm] py-[13mm] text-center text-[#183328] shadow-2xl print:max-w-none print:shadow-none">
              <div className="pointer-events-none absolute inset-[7mm] border border-[#b99755]/35" aria-hidden="true" />
              <div className="pointer-events-none absolute left-1/2 top-[11mm] h-px w-[36mm] -translate-x-1/2 bg-[#b99755]/60" aria-hidden="true" />

              <div className="relative flex w-full flex-col items-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#9b7a3f]">DRIES &amp; VEROUSCHKA</p>
                <p className="mt-[8mm] text-[10px] uppercase tracking-[0.3em] text-[#183328]/50">Speciaal voor</p>
                <h2 className="mt-[3mm] max-w-full [overflow-wrap:anywhere] text-[12mm] leading-[0.95]" style={{ fontFamily: "var(--font-cormorant)" }}>{invite.familyName}</h2>

                <div className="mt-[8mm] bg-white p-[3mm] shadow-[0_5px_18px_rgba(24,51,40,0.08)]">
                  <Image src={invite.qrSource} alt={`QR-code voor de uitnodiging van ${invite.familyName}`} width={720} height={720} unoptimized className="h-auto w-[68mm] max-w-full" />
                </div>

                <p className="mt-[7mm] max-w-[98mm] text-[13px] leading-relaxed text-[#183328]/70">Scan om jullie persoonlijke uitnodiging te bekijken en te RSVP&apos;en.</p>
                <p className="mt-[4mm] border-t border-[#b99755]/30 px-[6mm] pt-[4mm] text-[12px] font-medium text-[#183328]">
                  Deze uitnodiging is geldig voor {invite.allowedGuests} {invite.allowedGuests === 1 ? "persoon" : "personen"}.
                </p>
                <p className="mt-[5mm] text-sm tracking-[0.12em] text-[#183328]/65">19 december 2026</p>
              </div>
            </article>
          </Fragment>
        ))}
      </div>
    </main>
  );
}

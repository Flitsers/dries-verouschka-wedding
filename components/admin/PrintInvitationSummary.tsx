"use client";

import { Printer } from "lucide-react";
import QRCodeCard from "@/components/admin/QRCodeCard";

type SummaryProps = {
  familyName: string;
  invitationType: string;
  allowedGuests: number;
  attendanceLabel: string;
  attendingGuests: number | null;
  email: string | null;
  code: string;
  publicUrl: string;
};

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm text-white/75 transition hover:border-white/50 hover:text-white"
    >
      <Printer size={17} aria-hidden="true" />
      Afdrukken
    </button>
  );
}

export default function PrintInvitationSummary({
  familyName,
  invitationType,
  allowedGuests,
  attendanceLabel,
  attendingGuests,
  email,
  code,
  publicUrl,
}: SummaryProps) {
  return (
    <article className="hidden bg-white text-[#17251f] print:block print:min-h-screen print:px-[16mm] print:py-[12mm]">
      <header className="border-b border-[#17251f]/20 pb-7 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#755f34]">Dries &amp; Verouschka</p>
        <p className="mt-2 text-sm text-[#17251f]/65">19 december 2026</p>
        <h1 className="mt-7 text-4xl font-semibold leading-tight">{familyName}</h1>
        <div className="mt-4 flex justify-center gap-2 text-sm">
          <span className="rounded-full border border-[#17251f]/25 px-3 py-1">{invitationType}</span>
          <span className="rounded-full border border-[#17251f]/25 px-3 py-1">{attendanceLabel}</span>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-[1fr_78mm] gap-10">
        <section aria-labelledby="print-details-heading">
          <h2 id="print-details-heading" className="text-xl font-semibold">Uitnodigingsgegevens</h2>
          <dl className="mt-5 divide-y divide-[#17251f]/15 border-y border-[#17251f]/15">
            <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-sm text-[#17251f]/60">Uitnodigingstype</dt><dd className="font-medium">{invitationType}</dd></div>
            <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-sm text-[#17251f]/60">Uitgenodigd</dt><dd className="font-medium">{allowedGuests} {allowedGuests === 1 ? "persoon" : "personen"}</dd></div>
            <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-sm text-[#17251f]/60">RSVP-status</dt><dd className="font-medium">{attendanceLabel}</dd></div>
            <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-sm text-[#17251f]/60">Aantal aanwezig</dt><dd className="font-medium">{attendingGuests === null ? "—" : attendingGuests}</dd></div>
            {email && <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-sm text-[#17251f]/60">E-mailadres</dt><dd className="break-all font-medium">{email}</dd></div>}
            <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-sm text-[#17251f]/60">Code</dt><dd className="font-mono font-semibold tracking-[0.12em]">{code}</dd></div>
          </dl>

          <div className="mt-7">
            <p className="text-sm text-[#17251f]/60">Persoonlijke uitnodigingslink</p>
            <p className="mt-2 break-all font-mono text-sm font-medium">{publicUrl}</p>
          </div>
        </section>

        <div className="[&_h2]:text-[#17251f] [&_p]:text-[#17251f]/60">
          <QRCodeCard invitationUrl={publicUrl} />
        </div>
      </div>

      <p className="mt-10 border-t border-[#17251f]/20 pt-5 text-center text-xs text-[#17251f]/50">
        Persoonlijk overzicht voor de voorbereiding van de uitnodiging
      </p>
    </article>
  );
}

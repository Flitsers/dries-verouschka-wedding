"use client";

import { Check, Copy, Music2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type {
  AdminSongRequestOverview,
  AdminSongRequestOverviewPerson,
} from "@/lib/admin/song-request-overview-types";

type Props = {
  overview: AdminSongRequestOverview;
};

function formatOverviewLine(person: AdminSongRequestOverviewPerson) {
  return `- ${person.name} — ${person.familyName} — ${person.songRequest}`;
}

function formatOverviewText(people: AdminSongRequestOverviewPerson[]) {
  return ["Verzoeknummers", "", ...people.map(formatOverviewLine)].join("\n");
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

export default function SongRequestOverviewSection({ overview }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyOverview() {
    const text = formatOverviewText(overview.people);
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

  return (
    <section
      className="mt-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#10261d]/55 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
      aria-labelledby="song-request-overview-title"
    >
      <div className="flex flex-col gap-5 border-b border-white/10 p-5 sm:flex-row sm:items-end sm:justify-between md:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4b06a]">
            Voor de DJ
          </p>
          <h2
            id="song-request-overview-title"
            className="mt-2 text-3xl"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Verzoeknummers
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/50">
            Muziekverzoeken van personen die aanwezig zijn.
          </p>
        </div>
        {overview.people.length > 0 && (
          <button
            type="button"
            onClick={copyOverview}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#d4b06a]/70 px-5 py-2.5 text-sm font-medium text-[#f5d998] transition hover:bg-[#d4b06a] hover:text-[#183328] sm:w-auto"
          >
            {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
            <span aria-live="polite">
              {copied ? "Gekopieerd!" : "Kopieer verzoeknummers"}
            </span>
          </button>
        )}
      </div>

      <div className="p-5 md:p-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/60">
          <Music2 size={17} className="text-[#d4b06a]" aria-hidden="true" />
          Verzoeknummers:
          <strong className="text-base text-[#f5d998]">{overview.count}</strong>
        </p>
      </div>

      {overview.people.length === 0 ? (
        <div className="border-t border-white/10 px-5 py-10 text-center md:px-6">
          <p className="text-sm text-white/55">
            Nog geen verzoeknummers doorgegeven.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden border-t border-white/10 lg:block">
            <table className="w-full table-fixed text-left">
              <thead className="bg-white/[0.025] text-xs uppercase tracking-[0.14em] text-white/45">
                <tr>
                  <th className="w-[28%] px-6 py-4 font-medium">Naam</th>
                  <th className="w-[30%] px-6 py-4 font-medium">Familie / uitnodiging</th>
                  <th className="w-[42%] px-6 py-4 font-medium">Verzoeknummer</th>
                </tr>
              </thead>
              <tbody>
                {overview.people.map((person) => (
                  <tr
                    key={`${person.inviteId}-${person.attendeePosition}`}
                    className="border-t border-white/[0.07] align-top"
                  >
                    <td className="break-words px-6 py-5 font-medium text-white">
                      {person.name}
                    </td>
                    <td className="break-words px-6 py-5">
                      <Link
                        href={`/admin/${person.inviteId}`}
                        className="text-sm text-white/75 transition hover:text-[#f5d998]"
                      >
                        {person.familyName}
                      </Link>
                    </td>
                    <td className="break-words px-6 py-5 text-sm leading-relaxed text-[#f5d998]">
                      {person.songRequest}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-2 lg:hidden md:p-6">
            {overview.people.map((person) => (
              <article
                key={`${person.inviteId}-${person.attendeePosition}`}
                className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <h3 className="break-words text-lg font-semibold text-white">
                  {person.name}
                </h3>
                <Link
                  href={`/admin/${person.inviteId}`}
                  className="mt-1 block break-words text-sm text-white/55 transition hover:text-[#f5d998]"
                >
                  {person.familyName}
                </Link>
                <div className="mt-4 border-t border-white/[0.07] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.13em] text-white/35">
                    Verzoeknummer
                  </p>
                  <p className="mt-1 break-words text-sm leading-relaxed text-[#f5d998]">
                    {person.songRequest}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

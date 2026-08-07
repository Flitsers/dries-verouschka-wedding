"use client";

import { Check, ChevronLeft, ChevronRight, Send, Users } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { submitRSVP } from "@/app/actions/rsvp";

type Props = {
  code: string;
  familyName: string;
  allowedGuests: number;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d4b06a] px-8 py-4 font-semibold text-[#183328] shadow-[0_12px_28px_rgba(212,176,106,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e2c17f] hover:shadow-[0_16px_34px_rgba(212,176,106,0.25)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 sm:w-auto"
    >
      <Send size={17} aria-hidden="true" />
      {pending ? "Even geduld..." : "RSVP bevestigen"}
    </button>
  );
}

export default function RSVPWizard({ code, familyName, allowedGuests }: Props) {
  const [step, setStep] = useState(1);
  const [attendingGuests, setAttendingGuests] = useState<number | null>(null);
  const [showAttendanceError, setShowAttendanceError] = useState(false);
  const attendanceOptions = allowedGuests === 1
    ? [
        { value: 1, title: "Ja, ik kom", description: "Ik vier deze dag graag met jullie mee." },
        { value: 0, title: "Nee, ik kom niet", description: "Helaas kan ik er niet bij zijn." },
      ]
    : [
        { value: 0, title: "Niemand komt", description: "Helaas kunnen we er niet bij zijn." },
        { value: 1, title: "1 persoon komt", description: "Eén van ons viert deze dag graag mee." },
        { value: 2, title: "2 personen komen", description: "We kijken ernaar uit om samen te vieren." },
      ];

  const nextStep = () => {
    if (step === 1 && attendingGuests === null) {
      setShowAttendanceError(true);
      return;
    }

    setStep((current) => Math.min(current + 1, 2));
  };

  const selectAttendance = (value: number) => {
    setAttendingGuests(value);
    setShowAttendanceError(false);
  };

  return (
    <form action={submitRSVP} className="mt-10 border-t border-white/10 pt-8 sm:mt-12 sm:pt-10">
      <input type="hidden" name="code" value={code} />
      <input type="hidden" name="attending_guests" value={attendingGuests ?? ""} />

      <div className="mb-10" aria-label={`Stap ${step} van 2`}>
        <div className="flex items-center gap-2">
          {[1, 2].map((item) => (
            <div key={item} className="flex flex-1 items-center gap-2">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${item <= step ? "bg-[#d4b06a] text-[#183328]" : "border border-white/15 text-white/45"}`}>
                {item < step ? <Check size={15} aria-hidden="true" /> : item}
              </span>
              {item === 1 && <span className={`h-px flex-1 transition-colors ${step > 1 ? "bg-[#d4b06a]" : "bg-white/15"}`} />}
            </div>
          ))}
        </div>
        <p className="mt-3 text-right text-xs text-white/45">Stap {step} van 2</p>
      </div>

      {step === 1 && (
        <section aria-labelledby="attendance-title">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4b06a]">Aanwezigheid</p>
          <h2 id="attendance-title" className="mt-3 text-4xl leading-none sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Zijn jullie erbij?
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-gray-300">Kies met hoeveel personen jullie aanwezig zullen zijn.</p>

          <div
            role="radiogroup"
            aria-labelledby="attendance-title"
            aria-describedby={showAttendanceError ? "attendance-error" : undefined}
            className={`mt-8 grid gap-4 ${allowedGuests === 1 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}
          >
            {attendanceOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={attendingGuests === option.value}
                onClick={() => selectAttendance(option.value)}
                className={`rounded-2xl border p-6 text-left transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#d4b06a] ${attendingGuests === option.value ? "border-[#d4b06a] bg-[#d4b06a]/15 shadow-[0_12px_28px_rgba(0,0,0,0.14)]" : "border-white/10 bg-black/10 hover:border-white/30 hover:bg-white/[0.04]"}`}
              >
                <Users className="text-[#d4b06a]" size={22} aria-hidden="true" />
                <p className="mt-5 text-xl font-medium text-white">{option.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">{option.description}</p>
              </button>
            ))}
          </div>
          {showAttendanceError && (
            <p id="attendance-error" role="alert" className="mt-4 rounded-xl border border-[#e2c17f]/25 bg-[#e2c17f]/10 px-4 py-3 text-sm text-[#f5d998]">
              Kies eerst hoeveel personen aanwezig zullen zijn.
            </p>
          )}
        </section>
      )}

      {step === 2 && attendingGuests !== null && (
        <section aria-labelledby="confirm-title">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4b06a]">Controle</p>
          <h2 id="confirm-title" className="mt-3 text-4xl leading-none sm:text-5xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Controleer jullie antwoord
          </h2>
          <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
            <div className="flex items-start justify-between gap-6 py-4"><dt className="text-white/55">Uitnodiging</dt><dd className="text-right text-white">{familyName}</dd></div>
            <div className="flex items-start justify-between gap-6 py-4"><dt className="text-white/55">Aantal genodigden</dt><dd className="text-right text-white">{allowedGuests}</dd></div>
            <div className="flex items-start justify-between gap-6 py-4"><dt className="text-white/55">Aanwezig</dt><dd className="text-right text-white">{attendingGuests === 0 ? "Niet aanwezig" : `${attendingGuests} ${attendingGuests === 1 ? "persoon" : "personen"} aanwezig`}</dd></div>
          </dl>
        </section>
      )}

      <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step > 1 ? (
          <button type="button" onClick={() => setStep(1)} className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm text-white/75 transition hover:text-[#d4b06a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#d4b06a]">
            <ChevronLeft size={17} aria-hidden="true" /> Wijzigen
          </button>
        ) : <span className="hidden sm:block" />}
        {step === 1 ? (
          <button type="button" onClick={nextStep} className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d4b06a] px-7 py-3.5 font-medium text-[#d4b06a] transition duration-300 hover:bg-[#d4b06a] hover:text-[#183328] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#d4b06a] sm:w-auto">
            Volgende stap <ChevronRight size={17} aria-hidden="true" />
          </button>
        ) : <SubmitButton />}
      </div>
    </form>
  );
}

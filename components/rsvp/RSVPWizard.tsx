"use client";

import { Check, ChevronLeft, ChevronRight, Send, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { startRSVPWizard } from "@/components/rsvp/rsvp-wizard-runtime";
import {
  dietaryPreferenceValues,
  getDietaryPreferenceLabel,
  isDietaryPreference,
  RSVP_ATTENDEE_NAME_MAX_LENGTH,
  RSVP_ATTENDEE_NOTES_MAX_LENGTH,
  type DietaryPreference,
  type StoredRsvpAttendee,
} from "@/lib/invitations/rsvp";

type Props = {
  formId: string;
  code: string;
  familyName: string;
  allowedGuests: number;
  includesStadhuis: boolean;
  initialAttendingGuests: number | null;
  initialStadhuisAttending: boolean | null;
  initialAttendees: StoredRsvpAttendee[];
  initialSubmitError: string | null;
};

type WizardStep = 1 | 2 | 3;

type AttendeeDraft = {
  position: 1 | 2;
  name: string;
  dietaryPreference: DietaryPreference;
  notes: string;
};

function getExistingForm(formId: string): HTMLFormElement | null {
  if (typeof document === "undefined") return null;

  const form = document.getElementById(formId);
  return form instanceof HTMLFormElement ? form : null;
}

function getInitialStep(formId: string): WizardStep {
  const step = Number(getExistingForm(formId)?.dataset.rsvpStep);
  return step === 2 || step === 3 ? step : 1;
}

function getInitialAttendance(
  formId: string,
  fallback: number | null,
): number | null {
  const field = getExistingForm(formId)?.elements.namedItem("attending_guests");

  if (
    typeof HTMLInputElement === "undefined" ||
    !(field instanceof HTMLInputElement) ||
    field.value === ""
  ) {
    return fallback;
  }

  const value = Number(field.value);
  return Number.isInteger(value) ? value : fallback;
}

function getInitialAttendanceError(formId: string): boolean {
  const error = getExistingForm(formId)?.querySelector<HTMLElement>(
    "[data-rsvp-attendance-error]",
  );
  return error ? !error.hidden : false;
}

function getInitialStadhuisAttendance(
  formId: string,
  fallback: boolean | null,
): boolean | null {
  const value = getExistingForm(formId)?.dataset.rsvpStadhuis;

  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function getInitialStadhuisError(formId: string): boolean {
  const error = getExistingForm(formId)?.querySelector<HTMLElement>(
    "[data-rsvp-stadhuis-error]",
  );
  return error ? !error.hidden : false;
}

function createAttendeeDrafts(
  initialAttendees: StoredRsvpAttendee[],
): AttendeeDraft[] {
  return ([1, 2] as const).map((position) => {
    const attendee = initialAttendees.find(
      (candidate) => candidate.position === position,
    );
    const completeAttendee = attendee?.detailsComplete ? attendee : null;

    return {
      position,
      name: completeAttendee?.name ?? "",
      dietaryPreference: completeAttendee?.dietaryPreference ?? "none",
      notes: completeAttendee?.notes ?? "",
    };
  });
}

function getInitialAttendees(
  formId: string,
  fallback: StoredRsvpAttendee[],
): AttendeeDraft[] {
  const form = getExistingForm(formId);
  if (!form) return createAttendeeDrafts(fallback);

  return ([1, 2] as const).map((position) => {
    const name = form.elements.namedItem(`attendee_${position}_name`);
    const dietaryPreference = form.elements.namedItem(
      `attendee_${position}_dietary_preference`,
    );
    const notes = form.elements.namedItem(`attendee_${position}_notes`);
    const fallbackAttendee = fallback.find(
      (candidate) => candidate.position === position,
    );
    const completeFallbackAttendee = fallbackAttendee?.detailsComplete
      ? fallbackAttendee
      : null;
    const storedDietaryPreference =
      dietaryPreference instanceof HTMLSelectElement &&
      isDietaryPreference(dietaryPreference.value)
        ? dietaryPreference.value
        : completeFallbackAttendee?.dietaryPreference ?? "none";

    return {
      position,
      name:
        name instanceof HTMLInputElement
          ? name.value
          : completeFallbackAttendee?.name ?? "",
      dietaryPreference: storedDietaryPreference,
      notes:
        notes instanceof HTMLTextAreaElement
          ? notes.value
          : completeFallbackAttendee?.notes ?? "",
    };
  });
}

function SubmitButton() {
  return (
    <button
      type="submit"
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d4b06a] px-8 py-4 font-semibold text-[#183328] shadow-[0_12px_28px_rgba(212,176,106,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e2c17f] hover:shadow-[0_16px_34px_rgba(212,176,106,0.25)] sm:w-auto"
    >
      <Send size={17} aria-hidden="true" />
      RSVP bevestigen
    </button>
  );
}

export default function RSVPWizard({
  formId,
  code,
  familyName,
  allowedGuests,
  includesStadhuis,
  initialAttendingGuests,
  initialStadhuisAttending,
  initialAttendees,
  initialSubmitError,
}: Props) {
  const [step, setStep] = useState<WizardStep>(() => getInitialStep(formId));
  const [attendingGuests, setAttendingGuests] = useState<number | null>(() =>
    getInitialAttendance(formId, initialAttendingGuests),
  );
  const [stadhuisAttending, setStadhuisAttending] = useState<boolean | null>(
    () =>
      getInitialStadhuisAttendance(
        formId,
        initialAttendingGuests === 0 ? null : initialStadhuisAttending,
      ),
  );
  const [attendees, setAttendees] = useState<AttendeeDraft[]>(() =>
    getInitialAttendees(formId, initialAttendees),
  );
  const [showAttendanceError, setShowAttendanceError] = useState(() =>
    getInitialAttendanceError(formId),
  );
  const [showStadhuisError, setShowStadhuisError] = useState(() =>
    getInitialStadhuisError(formId),
  );
  const hasUnresolvedInitialDetails = initialAttendees.some(
    (attendee) => !attendee.detailsComplete,
  );

  useEffect(() => startRSVPWizard(getExistingForm(formId)), [formId]);

  const attendanceOptions =
    allowedGuests === 1
      ? [
          {
            value: 1,
            title: "Ja, ik ben erbij",
            description: "Ik vier deze dag graag met jullie mee.",
          },
          {
            value: 0,
            title: "Nee, helaas niet",
            description: "Helaas kan ik er niet bij zijn.",
          },
        ]
      : [
          {
            value: 0,
            title: "Niemand",
            description: "Helaas kunnen we er niet bij zijn.",
          },
          {
            value: 1,
            title: "1 persoon",
            description: "Eén van ons viert deze dag graag mee.",
          },
          {
            value: 2,
            title: "2 personen",
            description: "We kijken ernaar uit om samen te vieren.",
          },
        ];

  const selectAttendance = (value: number) => {
    setAttendingGuests(value);
    setShowAttendanceError(false);
    if (value === 0) setShowStadhuisError(false);
  };

  const goFromAttendance = () => {
    if (attendingGuests === null) {
      setShowAttendanceError(true);
      return;
    }

    setStep(attendingGuests === 0 ? 3 : 2);
  };

  const goFromDetails = () => {
    if (
      includesStadhuis &&
      attendingGuests !== null &&
      attendingGuests > 0 &&
      stadhuisAttending === null
    ) {
      setShowStadhuisError(true);
      return;
    }

    const form = getExistingForm(formId);
    if (form && !form.reportValidity()) return;
    setStep(3);
  };

  const goBack = () => {
    setStep((current) =>
      current === 3 && attendingGuests !== 0 ? 2 : 1,
    );
  };

  const updateAttendee = (
    position: 1 | 2,
    values: Partial<Omit<AttendeeDraft, "position">>,
  ) => {
    setAttendees((current) =>
      current.map((attendee) =>
        attendee.position === position ? { ...attendee, ...values } : attendee,
      ),
    );
  };

  const activeAttendees = attendees.filter(
    (attendee) =>
      attendingGuests !== null && attendee.position <= attendingGuests,
  );
  const effectiveStadhuisAttendance =
    includesStadhuis && attendingGuests === 0 ? false : stadhuisAttending;

  return (
    <form
      id={formId}
      action={`/i/${encodeURIComponent(code)}/rsvp/submit`}
      method="post"
      data-rsvp-step={step}
      data-rsvp-attendance={
        attendingGuests === null ? "" : String(attendingGuests)
      }
      data-rsvp-includes-stadhuis={String(includesStadhuis)}
      data-rsvp-allowed-guests={allowedGuests}
      data-rsvp-stadhuis={
        stadhuisAttending === null ? "" : String(stadhuisAttending)
      }
      aria-label={`Stap ${step} van 3`}
      className="mt-10 border-t border-white/10 pt-8 sm:mt-12 sm:pt-10"
    >
      <style>{`
        .rsvp-attendance-option:has(input:checked) {
          border-color: #d4b06a;
          background-color: rgb(212 176 106 / 0.15);
          box-shadow: 0 12px 28px rgb(0 0 0 / 0.14);
        }
        .rsvp-attendance-option:has(input:checked) [data-rsvp-selection-indicator] {
          border-color: #d4b06a;
          background-color: #d4b06a;
        }
        .rsvp-attendance-option:has(input:checked) [data-rsvp-selection-check] {
          display: block;
        }
        .rsvp-stadhuis-option:has(input:checked) {
          border-color: #d4b06a;
          background-color: rgb(212 176 106 / 0.15);
        }
        [data-rsvp-panel] { display: none; }
        [data-rsvp-step="1"] [data-rsvp-panel="1"],
        [data-rsvp-step="2"] [data-rsvp-panel="2"],
        [data-rsvp-step="3"] [data-rsvp-panel="3"] { display: block; }
        [data-rsvp-back], [data-rsvp-details-next], [data-rsvp-submit] { display: none; }
        [data-rsvp-step="2"] [data-rsvp-back],
        [data-rsvp-step="3"] [data-rsvp-back],
        [data-rsvp-step="2"] [data-rsvp-details-next],
        [data-rsvp-step="3"] [data-rsvp-submit] { display: inline-flex; }
        [data-rsvp-step="2"] [data-rsvp-attendance-next],
        [data-rsvp-step="3"] [data-rsvp-attendance-next] { display: none; }
        [data-rsvp-step-circle] {
          border-color: rgb(255 255 255 / 0.15);
          color: rgb(255 255 255 / 0.45);
        }
        [data-rsvp-step="1"] [data-rsvp-step-circle="1"],
        [data-rsvp-step="2"] [data-rsvp-step-circle="1"],
        [data-rsvp-step="2"] [data-rsvp-step-circle="2"],
        [data-rsvp-step="3"] [data-rsvp-step-circle] {
          border-color: transparent;
          background-color: #d4b06a;
          color: #183328;
        }
        [data-rsvp-step-check] { display: none; }
        [data-rsvp-step="2"] [data-rsvp-step-circle="1"] [data-rsvp-step-number],
        [data-rsvp-step="3"] [data-rsvp-step-circle="1"] [data-rsvp-step-number],
        [data-rsvp-step="3"] [data-rsvp-step-circle="2"] [data-rsvp-step-number] { display: none; }
        [data-rsvp-step="2"] [data-rsvp-step-circle="1"] [data-rsvp-step-check],
        [data-rsvp-step="3"] [data-rsvp-step-circle="1"] [data-rsvp-step-check],
        [data-rsvp-step="3"] [data-rsvp-step-circle="2"] [data-rsvp-step-check] { display: block; }
        [data-rsvp-step="2"] [data-rsvp-step-connector="1"],
        [data-rsvp-step="3"] [data-rsvp-step-connector] { background-color: #d4b06a; }
      `}</style>

      <input type="hidden" name="code" value={code} />
      <input
        type="hidden"
        name="attending_guests"
        value={attendingGuests === null ? "" : String(attendingGuests)}
      />
      {includesStadhuis && (
        <input
          type="hidden"
          name="stadhuis_attending"
          value={
            effectiveStadhuisAttendance === null
              ? ""
              : String(effectiveStadhuisAttendance)
          }
        />
      )}

      <div className="mb-10">
        <div className="flex items-center gap-2">
          {([1, 2, 3] as const).map((position) => (
            <div key={position} className="flex flex-1 items-center gap-2">
              <span
                data-rsvp-step-circle={position}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors"
              >
                <span data-rsvp-step-number>{position}</span>
                <Check data-rsvp-step-check size={15} aria-hidden="true" />
              </span>
              {position < 3 && (
                <span
                  data-rsvp-step-connector={position}
                  className="h-px flex-1 bg-white/15 transition-colors"
                />
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-right text-xs text-white/45" data-rsvp-step-label>
          Stap {step} van 3
        </p>
      </div>

      <section
        data-rsvp-panel="1"
        aria-hidden={step !== 1}
        aria-labelledby="attendance-title"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4b06a]">
          Aanwezigheid
        </p>
        <h2
          id="attendance-title"
          className="mt-3 text-4xl leading-none sm:text-5xl"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {allowedGuests === 1
            ? "Kom je naar onze trouwdag?"
            : "Met hoeveel zijn jullie aanwezig?"}
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-gray-300">
          {allowedGuests === 1
            ? "Laat ons weten of je erbij kunt zijn."
            : "Kies hoeveel personen van deze uitnodiging aanwezig zullen zijn."}
        </p>

        <fieldset
          data-rsvp-attendance-fieldset
          aria-labelledby="attendance-title"
          aria-describedby={showAttendanceError ? "attendance-error" : undefined}
          className={`mt-8 grid gap-4 ${allowedGuests === 1 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}
        >
          {attendanceOptions.map((option) => (
            <label
              key={option.value}
              className="rsvp-attendance-option relative min-h-44 cursor-pointer rounded-2xl border border-white/10 bg-black/10 p-5 text-left transition duration-300 hover:border-white/30 hover:bg-white/[0.04] focus-within:outline focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-[#d4b06a] sm:p-6"
            >
              <input
                type="radio"
                name="attendance_option"
                value={option.value}
                checked={attendingGuests === option.value}
                onChange={() => selectAttendance(option.value)}
                className="sr-only"
              />
              <span
                data-rsvp-selection-indicator
                className="absolute right-5 top-5 flex h-5 w-5 items-center justify-center rounded-full border border-white/30"
                aria-hidden="true"
              >
                <Check
                  data-rsvp-selection-check
                  size={13}
                  className="hidden text-[#183328]"
                />
              </span>
              <Users className="text-[#d4b06a]" size={22} aria-hidden="true" />
              <p className="mt-5 text-xl font-medium text-white">{option.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">
                {option.description}
              </p>
            </label>
          ))}
        </fieldset>
        <p
          id="attendance-error"
          data-rsvp-attendance-error
          role="alert"
          hidden={!showAttendanceError}
          className="mt-4 rounded-xl border border-[#e2c17f]/25 bg-[#e2c17f]/10 px-4 py-3 text-sm text-[#f5d998]"
        >
          Kies eerst hoeveel personen aanwezig zullen zijn.
        </p>
      </section>

      <section
        data-rsvp-panel="2"
        aria-hidden={step !== 2}
        aria-labelledby="details-title"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4b06a]">
          Persoonsgegevens
        </p>
        <h2
          id="details-title"
          className="mt-3 text-4xl leading-none sm:text-5xl"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Wie mogen we verwelkomen?
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-gray-300">
          Vul voor iedere aanwezige persoon de gegevens afzonderlijk in.
        </p>
        {hasUnresolvedInitialDetails && (
          <p className="mt-5 rounded-xl border border-[#e2c17f]/25 bg-[#e2c17f]/10 px-4 py-3 text-sm text-[#f5d998]">
            Vul de gegevens van de aanwezige personen aan.
          </p>
        )}

        <div className="mt-8 space-y-5">
          {attendees.map((attendee) => {
            const active =
              attendingGuests !== null && attendee.position <= attendingGuests;

            return (
              <fieldset
                key={attendee.position}
                data-rsvp-attendee-block
                data-attendee-position={attendee.position}
                hidden={!active}
                className="rounded-2xl border border-white/10 bg-black/10 p-5 sm:p-6"
              >
                <legend className="px-2 text-xl text-[#d4b06a]">
                  Persoon {attendee.position}
                </legend>
                <div className="mt-2 grid gap-5 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="text-sm text-white/70">Naam</span>
                    <input
                      name={`attendee_${attendee.position}_name`}
                      value={attendee.name}
                      onChange={(event) =>
                        updateAttendee(attendee.position, {
                          name: event.target.value,
                        })
                      }
                      required
                      disabled={!active}
                      maxLength={RSVP_ATTENDEE_NAME_MAX_LENGTH}
                      autoComplete="name"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#10261d] px-4 py-3 text-white outline-none transition focus:border-[#d4b06a]"
                    />
                  </label>
                  <label>
                    <span className="text-sm text-white/70">Eetvoorkeur</span>
                    <select
                      name={`attendee_${attendee.position}_dietary_preference`}
                      value={attendee.dietaryPreference}
                      onChange={(event) => {
                        if (isDietaryPreference(event.target.value)) {
                          updateAttendee(attendee.position, {
                            dietaryPreference: event.target.value,
                          });
                        }
                      }}
                      disabled={!active}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#10261d] px-4 py-3 text-white outline-none transition focus:border-[#d4b06a]"
                    >
                      {dietaryPreferenceValues.map((value) => (
                        <option key={value} value={value}>
                          {getDietaryPreferenceLabel(value)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="sm:col-span-2">
                    <span className="text-sm text-white/70">Opmerkingen</span>
                    <textarea
                      name={`attendee_${attendee.position}_notes`}
                      value={attendee.notes}
                      onChange={(event) =>
                        updateAttendee(attendee.position, {
                          notes: event.target.value,
                        })
                      }
                      disabled={!active}
                      maxLength={RSVP_ATTENDEE_NOTES_MAX_LENGTH}
                      rows={3}
                      placeholder="Allergieën of andere zaken die we moeten weten"
                      className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#10261d] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#d4b06a]"
                    />
                    <span className="mt-1 block text-right text-xs text-white/35">
                      Maximaal 500 tekens
                    </span>
                  </label>
                </div>
              </fieldset>
            );
          })}
        </div>

        {includesStadhuis && (
          <fieldset
            data-rsvp-stadhuis-fieldset
            aria-labelledby="stadhuis-title"
            aria-describedby={
              showStadhuisError ? "stadhuis-error" : undefined
            }
            className="mt-8 border-t border-white/10 pt-8"
          >
            <legend
              id="stadhuis-title"
              className="text-3xl leading-none text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {allowedGuests === 1
                ? "Kom je mee naar het stadhuis?"
                : "Komen jullie mee naar het stadhuis?"}
            </legend>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { value: true, label: "Ja" },
                { value: false, label: "Nee" },
              ].map((option) => (
                <label
                  key={String(option.value)}
                  className="rsvp-stadhuis-option cursor-pointer rounded-2xl border border-white/10 bg-black/10 px-5 py-4 transition hover:border-white/30 focus-within:outline focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-[#d4b06a]"
                >
                  <input
                    type="radio"
                    name="stadhuis_option"
                    value={String(option.value)}
                    checked={stadhuisAttending === option.value}
                    onChange={() => {
                      setStadhuisAttending(option.value);
                      setShowStadhuisError(false);
                    }}
                    className="sr-only"
                  />
                  <span className="text-lg font-medium text-white">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            <p
              id="stadhuis-error"
              data-rsvp-stadhuis-error
              role="alert"
              hidden={!showStadhuisError}
              className="mt-4 rounded-xl border border-[#e2c17f]/25 bg-[#e2c17f]/10 px-4 py-3 text-sm text-[#f5d998]"
            >
              Kies of {allowedGuests === 1 ? "je" : "jullie"} mee naar het
              stadhuis {allowedGuests === 1 ? "komt" : "komen"}.
            </p>
          </fieldset>
        )}
      </section>

      <section
        data-rsvp-panel="3"
        aria-hidden={step !== 3}
        aria-labelledby="confirm-title"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4b06a]">
          Controle
        </p>
        <h2
          id="confirm-title"
          className="mt-3 text-4xl leading-none sm:text-5xl"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {allowedGuests === 1
            ? "Controleer je antwoord"
            : "Controleer jullie antwoord"}
        </h2>
        <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
          <div className="flex items-start justify-between gap-6 py-4">
            <dt className="text-white/55">Uitnodiging</dt>
            <dd className="text-right text-white">{familyName}</dd>
          </div>
          <div className="flex items-start justify-between gap-6 py-4">
            <dt className="text-white/55">Aanwezig</dt>
            <dd className="text-right text-white" data-rsvp-summary-attendance>
              {attendingGuests === 0
                ? "Niet aanwezig"
                : attendingGuests === null
                  ? "Nog niet gekozen"
                  : `${attendingGuests} ${attendingGuests === 1 ? "persoon" : "personen"} aanwezig`}
            </dd>
          </div>
          {includesStadhuis && (
            <div
              className="flex items-start justify-between gap-6 py-4"
              data-rsvp-summary-stadhuis-row
            >
              <dt className="text-white/55">Stadhuis</dt>
              <dd className="text-right text-white" data-rsvp-summary-stadhuis>
                {effectiveStadhuisAttendance === true
                  ? allowedGuests === 1
                    ? "Ja, ik ben erbij"
                    : "Ja, we zijn erbij"
                  : effectiveStadhuisAttendance === false
                    ? "Nee"
                    : "Nog niet gekozen"}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-6 space-y-4">
          {attendees.map((attendee) => {
            const active = activeAttendees.some(
              (candidate) => candidate.position === attendee.position,
            );

            return (
              <article
                key={attendee.position}
                data-rsvp-summary-attendee
                data-attendee-position={attendee.position}
                hidden={!active}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Persoon {attendee.position}
                </p>
                <p className="mt-2 text-xl text-white" data-rsvp-summary-name>
                  {attendee.name || `Persoon ${attendee.position}`}
                </p>
                <p className="mt-2 text-sm text-white/65">
                  Eetvoorkeur:{" "}
                  <span data-rsvp-summary-dietary-preference>
                    {getDietaryPreferenceLabel(attendee.dietaryPreference)}
                  </span>
                </p>
                <p
                  className="mt-2 text-sm leading-relaxed text-white/65"
                  data-rsvp-summary-notes-row
                  hidden={!attendee.notes.trim()}
                >
                  Opmerking: <span data-rsvp-summary-notes>{attendee.notes}</span>
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {initialSubmitError && (
        <p
          role="alert"
          className="mt-8 rounded-xl border border-rose-200/20 bg-rose-200/10 px-4 py-3 text-sm text-rose-100"
        >
          {initialSubmitError}
        </p>
      )}

      <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          data-rsvp-back
          type="button"
          onClick={goBack}
          className="items-center justify-center gap-2 rounded-full px-4 py-3 text-sm text-white/75 transition hover:text-[#d4b06a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#d4b06a]"
        >
          <ChevronLeft size={17} aria-hidden="true" /> Wijzigen
        </button>
        <span className="hidden sm:block" />
        <button
          data-rsvp-attendance-next
          type="button"
          onClick={goFromAttendance}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d4b06a] px-7 py-3.5 font-medium text-[#d4b06a] transition duration-300 hover:bg-[#d4b06a] hover:text-[#183328] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#d4b06a] sm:w-auto"
        >
          Volgende stap <ChevronRight size={17} aria-hidden="true" />
        </button>
        <button
          data-rsvp-details-next
          type="button"
          onClick={goFromDetails}
          className="w-full items-center justify-center gap-2 rounded-full border border-[#d4b06a] px-7 py-3.5 font-medium text-[#d4b06a] transition duration-300 hover:bg-[#d4b06a] hover:text-[#183328] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#d4b06a] sm:w-auto"
        >
          Controleer RSVP <ChevronRight size={17} aria-hidden="true" />
        </button>
        <div data-rsvp-submit className="w-full sm:w-auto">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}

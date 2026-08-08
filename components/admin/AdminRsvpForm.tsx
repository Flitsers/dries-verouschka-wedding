"use client";

import { useActionState } from "react";
import { updateRsvp } from "@/app/admin/[id]/actions";

type Props = {
  inviteId: string;
  allowedGuests: number;
  answered: boolean;
  attendingGuests: number | null;
};

const initialState = { error: null as string | null, success: null as string | null };

function currentValue(answered: boolean, attendingGuests: number | null) {
  if (!answered) return "pending";
  return attendingGuests === null ? "legacy" : String(attendingGuests);
}

function currentLabel(allowedGuests: number, answered: boolean, attendingGuests: number | null) {
  if (!answered) return "Nog niet geantwoord";
  if (attendingGuests === null) return "Historisch antwoord";
  if (attendingGuests === 0) return allowedGuests === 1 ? "Niet aanwezig" : "Niemand aanwezig";
  return `${attendingGuests} van ${allowedGuests} aanwezig`;
}

export default function AdminRsvpForm({ inviteId, allowedGuests, answered, attendingGuests }: Props) {
  const [state, formAction, pending] = useActionState(updateRsvp, initialState);

  function confirmReset(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    if (
      answered &&
      formData.get("rsvp_value") === "pending" &&
      !window.confirm("Ben je zeker dat je dit antwoord opnieuw op 'Nog niet geantwoord' wilt zetten?")
    ) {
      event.preventDefault();
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-6" aria-labelledby="rsvp-management-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="rsvp-management-heading" className="text-2xl" style={{ fontFamily: "var(--font-cormorant)" }}>RSVP beheren</h2>
          <p className="mt-2 text-sm text-white/50">{allowedGuests} {allowedGuests === 1 ? "persoon uitgenodigd" : "personen uitgenodigd"}</p>
        </div>
        <p className="text-sm text-white/70"><span className="text-white/40">Huidig:</span> {currentLabel(allowedGuests, answered, attendingGuests)}</p>
      </div>

      <form action={formAction} onSubmit={confirmReset} className="mt-5">
        <input type="hidden" name="invite_id" value={inviteId} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor={`rsvp-value-${inviteId}`}>RSVP-status</label>
          <select
            id={`rsvp-value-${inviteId}`}
            name="rsvp_value"
            defaultValue={currentValue(answered, attendingGuests)}
            className="w-full rounded-xl border border-white/10 bg-[#10261d] px-4 py-3 text-white outline-none focus:border-[#d4b06a] sm:max-w-xs"
          >
            {answered && attendingGuests === null && <option value="legacy" disabled>Historisch antwoord</option>}
            <option value="pending">Nog niet geantwoord</option>
            <option value="0">{allowedGuests === 1 ? "Niet aanwezig" : "Niemand aanwezig"}</option>
            <option value="1">{allowedGuests === 1 ? "Aanwezig" : "1 persoon aanwezig"}</option>
            {allowedGuests === 2 && <option value="2">2 personen aanwezig</option>}
          </select>
          <button type="submit" disabled={pending} className="w-full rounded-full border border-[#d4b06a] px-5 py-3 text-sm text-[#d4b06a] transition hover:bg-[#d4b06a] hover:text-[#183328] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {pending ? "Opslaan..." : "RSVP opslaan"}
          </button>
        </div>
        {state.error && <p role="alert" className="mt-3 text-sm text-rose-100">{state.error}</p>}
        {state.success && <p role="status" className="mt-3 text-sm text-emerald-200">{state.success}</p>}
      </form>
    </section>
  );
}

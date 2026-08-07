"use client";

import { useActionState, useState } from "react";
import { createInvite } from "@/app/admin/new/actions";

const initialCreateInviteState = { error: null as string | null };

export default function NewInviteForm() {
  const [state, formAction, pending] = useActionState(createInvite, initialCreateInviteState);
  const [allowedGuests, setAllowedGuests] = useState("2");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [invitationType, setInvitationType] = useState("full_day");
  return (
    <form action={formAction} className="mt-10 space-y-6" noValidate>
      <div>
        <label htmlFor="family_name">Familie</label>
        <input id="family_name" name="family_name" required value={familyName} onChange={(event) => setFamilyName(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4" />
      </div>

      <div>
        <label htmlFor="allowed_guests">Aantal personen</label>
        <select id="allowed_guests" name="allowed_guests" value={allowedGuests} onChange={(event) => setAllowedGuests(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white">
          <option value="1">1 persoon</option>
          <option value="2">2 personen</option>
        </select>
        <p className="mt-2 text-sm text-white/50">Elke uitnodiging is voor één of twee volwassenen.</p>
      </div>

      <div>
        <label htmlFor="invitation_type">Type uitnodiging</label>
        <select id="invitation_type" name="invitation_type" value={invitationType} onChange={(event) => setInvitationType(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white">
          <option value="full_day">Volledige dag</option>
          <option value="reception_plus">Vanaf receptie</option>
          <option value="evening_only">Enkel avondfeest</option>
        </select>
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4" />
      </div>

      {state.error && <p role="alert" className="rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">{state.error}</p>}

      <button disabled={pending} className="w-full rounded-full border border-[#d4b06a] px-10 py-4 transition hover:bg-[#d4b06a] hover:text-[#183328] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
        {pending ? "Uitnodiging maken..." : "Uitnodiging maken"}
      </button>
    </form>
  );
}

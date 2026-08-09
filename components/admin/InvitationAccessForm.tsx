"use client";

import { useState } from "react";

type InvitationType = "full_day" | "reception_plus" | "evening_only";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  inviteId: string;
  initialInvitationType: InvitationType;
  initialIncludesStadhuis: boolean;
};

export default function InvitationAccessForm({
  action,
  inviteId,
  initialInvitationType,
  initialIncludesStadhuis,
}: Props) {
  const [invitationType, setInvitationType] = useState(initialInvitationType);
  const [includesStadhuis, setIncludesStadhuis] = useState(
    initialInvitationType === "full_day" && initialIncludesStadhuis,
  );

  function handleInvitationTypeChange(value: InvitationType) {
    setInvitationType(value);

    if (value !== "full_day") {
      setIncludesStadhuis(false);
    }
  }

  return (
    <form action={action} className="mt-5 space-y-4">
      <input type="hidden" name="id" value={inviteId} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          name="invitation_type"
          value={invitationType}
          onChange={(event) => handleInvitationTypeChange(event.target.value as InvitationType)}
          className="w-full rounded-xl border border-white/10 bg-[#10261d] px-4 py-3 text-white outline-none focus:border-[#d4b06a] sm:max-w-xs"
        >
          <option value="full_day">Volledige dag</option>
          <option value="reception_plus">Vanaf receptie</option>
          <option value="evening_only">Enkel avondfeest</option>
        </select>
        <button className="w-full rounded-full border border-[#d4b06a] px-5 py-3 text-sm text-[#d4b06a] transition hover:bg-[#d4b06a] hover:text-[#183328] sm:w-auto">
          Opslaan
        </button>
      </div>

      <label className={`flex items-start gap-3 rounded-2xl border px-4 py-4 transition ${invitationType === "full_day" ? "border-white/10 bg-black/10" : "border-white/[0.06] bg-black/5 text-white/40"}`}>
        <input
          type="checkbox"
          name="includes_stadhuis"
          checked={includesStadhuis}
          disabled={invitationType !== "full_day"}
          onChange={(event) => setIncludesStadhuis(event.target.checked)}
          className="mt-1 h-4 w-4 accent-[#d4b06a]"
        />
        <span>
          <span className="block font-medium">Uitgenodigd voor het Stadhuis</span>
          <span className="mt-1 block text-sm text-white/50">Alleen beschikbaar voor uitnodigingen voor de volledige dag.</span>
        </span>
      </label>
    </form>
  );
}

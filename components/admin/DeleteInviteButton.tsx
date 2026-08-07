"use client";

import { useActionState } from "react";
import { deleteInvite } from "@/app/admin/actions";

const initialDeleteInviteState = { error: null as string | null };

type Props = {
  inviteId: string;
  familyName: string;
};

export default function DeleteInviteButton({ inviteId, familyName }: Props) {
  const [state, formAction, pending] = useActionState(deleteInvite, initialDeleteInviteState);

  const confirmDeletion = (event: React.FormEvent<HTMLFormElement>) => {
    if (!window.confirm(`Ben je zeker dat je de uitnodiging van ${familyName} wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) {
      event.preventDefault();
    }
  };

  return (
    <form action={formAction} onSubmit={confirmDeletion}>
      <input type="hidden" name="invite_id" value={inviteId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-rose-300/25 px-4 py-2 text-sm text-rose-100 transition hover:border-rose-200/60 hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Verwijderen..." : "Verwijderen"}
      </button>
      {state.error && <p role="alert" className="mt-2 max-w-52 text-right text-xs leading-relaxed text-rose-100">{state.error}</p>}
    </form>
  );
}

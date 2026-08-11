"use client";

import { useActionState, useSyncExternalStore } from "react";
import { login } from "@/app/admin/login/actions";

type Props = {
  initialError?: string | null;
};

const subscribeToHydration = () => () => undefined;

export default function LoginForm({ initialError = null }: Props) {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [state, formAction, pending] = useActionState(login, {
    error: initialError,
  });
  const useDevelopmentFallback =
    process.env.NODE_ENV === "development" && !hydrated;

  return (
    <form
      action={
        useDevelopmentFallback ? "/admin/login/submit" : formAction
      }
      method={useDevelopmentFallback ? "post" : undefined}
      className="mt-8 space-y-5"
    >
      <div>
        <label htmlFor="email" className="text-sm text-white/70">E-mailadres</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 outline-none focus:border-[#d4b06a]" />
      </div>
      <div>
        <label htmlFor="password" className="text-sm text-white/70">Wachtwoord</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 outline-none focus:border-[#d4b06a]" />
      </div>
      {state.error && <p role="alert" className="rounded-xl border border-rose-300/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{state.error}</p>}
      <button type="submit" disabled={pending} className="w-full rounded-full bg-[#d4b06a] px-6 py-3.5 font-semibold text-[#183328] disabled:opacity-60">
        {pending ? "Inloggen..." : "Inloggen"}
      </button>
    </form>
  );
}

"use client";

import { useSyncExternalStore } from "react";
import { logout } from "@/app/admin/login/actions";

const subscribeToHydration = () => () => undefined;

export default function LogoutButton() {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const useDevelopmentFallback =
    process.env.NODE_ENV === "development" && !hydrated;

  return (
    <form
      action={useDevelopmentFallback ? "/admin/logout" : logout}
      method={useDevelopmentFallback ? "post" : undefined}
    >
      <button type="submit" className="rounded-full border border-white/20 px-5 py-3 text-sm text-white/70 transition hover:border-white/50 hover:text-white">
        Uitloggen
      </button>
    </form>
  );
}

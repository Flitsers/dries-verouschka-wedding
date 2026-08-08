"use client";

import { logout } from "@/app/admin/login/actions";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="rounded-full border border-white/20 px-5 py-3 text-sm text-white/70 transition hover:border-white/50 hover:text-white">
        Uitloggen
      </button>
    </form>
  );
}

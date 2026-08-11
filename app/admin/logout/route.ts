import { logout } from "@/app/admin/login/actions";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  await logout();
  return new Response(null, { status: 204 });
}

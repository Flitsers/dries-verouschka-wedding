import { login, type LoginState } from "@/app/admin/login/actions";

const initialLoginState: LoginState = { error: null };

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  const result = await login(initialLoginState, await request.formData());
  const searchParams = new URLSearchParams();

  if (result.error) {
    searchParams.set("error", result.error);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: `/admin/login?${searchParams.toString()}`,
    },
  });
}

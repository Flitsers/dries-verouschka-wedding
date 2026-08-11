import {
  createInvite,
  type CreateInviteState,
} from "@/app/admin/new/actions";

const initialCreateInviteState: CreateInviteState = { error: null };

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  const result = await createInvite(
    initialCreateInviteState,
    await request.formData(),
  );
  const searchParams = new URLSearchParams();

  if (result.error) {
    searchParams.set("error", result.error);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: `/admin/new?${searchParams.toString()}`,
    },
  });
}

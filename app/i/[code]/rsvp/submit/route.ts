import { submitRSVP, type SubmitRsvpState } from "@/app/actions/rsvp";

type Context = {
  params: Promise<{
    code: string;
  }>;
};

const initialSubmitState: SubmitRsvpState = { error: null, code: null };

export async function POST(request: Request, { params }: Context) {
  const { code } = await params;
  const formData = await request.formData();

  formData.set("code", code);

  const result = await submitRSVP(initialSubmitState, formData);

  if (result.error || !result.code) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: `/i/${encodeURIComponent(code)}/rsvp?submission=failed`,
      },
    });
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: `/i/${encodeURIComponent(result.code)}`,
    },
  });
}

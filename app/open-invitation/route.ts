import { normalizeInvitationCode } from "@/lib/invitations/code";
import { getPublicInvitationByCode } from "@/lib/invitations/server";

function redirectTo(location: string) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: location,
    },
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const rawCode = formData.get("code");
  const normalizedCode =
    typeof rawCode === "string" ? normalizeInvitationCode(rawCode) : null;

  if (!normalizedCode) {
    return redirectTo("/?invitation=invalid#uitnodiging");
  }

  // This request boundary is the future rate-limiting seam. The browser never
  // receives database access or invitation details from this lookup.
  const invitation = await getPublicInvitationByCode(normalizedCode);

  if (!invitation) {
    return redirectTo("/?invitation=not-found#uitnodiging");
  }

  return redirectTo(`/i/${encodeURIComponent(invitation.code)}`);
}

import { headers } from "next/headers";
import Link from "next/link";
import QRCode from "qrcode";
import BulkInvitationPrint from "@/components/admin/BulkInvitationPrint";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type InvitationType = "full_day" | "reception_plus" | "evening_only";

function configuredSiteOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configuredUrl) return null;

  try {
    const url = new URL(configuredUrl);
    const isProduction = process.env.NODE_ENV === "production";
    const isLocalHost = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1";

    if (!['http:', 'https:'].includes(url.protocol) || (isProduction && (url.protocol !== "https:" || isLocalHost))) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

export default async function BulkPrintPage() {
  await requireAdmin();

  const requestHeaders = await headers();
  let siteOrigin = configuredSiteOrigin();

  if (!siteOrigin && process.env.NODE_ENV !== "production") {
    const forwardedHost = requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim();
    const host = forwardedHost || requestHeaders.get("host");
    const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const protocol = forwardedProtocol || (host?.startsWith("localhost") || host?.startsWith("127.0.0.1") ? "http" : "https");
    siteOrigin = host ? `${protocol}://${host}` : null;
  }

  if (!siteOrigin) {
    return (
      <main className="min-h-screen bg-[#183328] px-5 py-12 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-amber-300/20 bg-amber-300/[0.07] p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4b06a]">Configuratie vereist</p>
          <h1 className="mt-4 text-4xl" style={{ fontFamily: "var(--font-cormorant)" }}>Printlinks zijn niet geconfigureerd</h1>
          <p className="mt-5 leading-relaxed text-white/65">Configureer een geldige HTTPS-waarde voor <code className="text-amber-100">NEXT_PUBLIC_SITE_URL</code> voordat uitnodigingen in productie worden afgedrukt.</p>
          <Link href="/admin" className="mt-8 inline-flex rounded-full border border-[#d4b06a] px-5 py-3 text-sm text-[#d4b06a]">← Terug naar dashboard</Link>
        </div>
      </main>
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("invites")
    .select("code, family_name, allowed_guests, invitation_type");

  if (error) {
    console.error("Bulk print invitations could not be loaded", error);
    throw new Error("De uitnodigingen konden niet worden geladen.");
  }

  const sortedInvitations = (data ?? [])
    .map((invite) => ({
      code: String(invite.code),
      familyName: String(invite.family_name),
      allowedGuests: Number(invite.allowed_guests),
      invitationType: (invite.invitation_type === "reception_plus" || invite.invitation_type === "evening_only"
        ? invite.invitation_type
        : "full_day") as InvitationType,
    }))
    .sort((current, next) => current.familyName.localeCompare(next.familyName, "nl", { sensitivity: "base" }));
  const invitations = await Promise.all(sortedInvitations.map(async (invite) => ({
    ...invite,
    qrSource: await QRCode.toDataURL(`${siteOrigin}/i/${encodeURIComponent(invite.code)}`, {
      width: 720,
      margin: 2,
      errorCorrectionLevel: "M",
    }),
  })));

  return <BulkInvitationPrint invitations={invitations} />;
}

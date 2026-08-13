import type { NextRequest } from "next/server";
import {
  buildFoodNotesCsv,
  buildGuestListCsv,
} from "@/lib/admin/csv-export";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const exportDefinitions = {
  guests: {
    filename: "gastenlijst-dries-verouschka-2026-12-19.csv",
    build: buildGuestListCsv,
  },
  food: {
    filename: "eten-opmerkingen-dries-verouschka-2026-12-19.csv",
    build: buildFoodNotesCsv,
  },
} as const;

export async function GET(request: NextRequest) {
  await requireAdmin();

  const exportType = request.nextUrl.searchParams.get("type");
  if (exportType !== "guests" && exportType !== "food") {
    return new Response("Onbekend exporttype.", { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("invites")
    .select(`
      family_name,
      invitation_type,
      allowed_guests,
      answered,
      attending_guests,
      includes_stadhuis,
      stadhuis_attending,
      rsvp_attendees (
        attendee_position,
        name,
        dietary_preference,
        notes,
        song_request,
        details_complete
      )
    `)
    .order("family_name");

  if (error) {
    console.error("Failed to load data for the admin CSV export", error);
    throw new Error("De gastenlijst kon niet worden geëxporteerd.");
  }

  const definition = exportDefinitions[exportType];
  const csv = definition.build(data ?? []);

  return new Response(csv, {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Disposition": `attachment; filename="${definition.filename}"`,
      "Content-Type": "text/csv; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

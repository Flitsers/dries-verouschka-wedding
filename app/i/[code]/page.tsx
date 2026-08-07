import { notFound, redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Props = {
  params: Promise<{
    code: string;
  }>;
};

export default async function InvitePage({ params }: Props) {
  const { code } = await params;

  const { data, error } = await supabase
    .from("invites")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !data) {
    notFound();
  }

  if (data.answered) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#183328] px-6 text-white">
        <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-[#d4b06a]/5 blur-3xl" />

        <div className="relative max-w-xl rounded-[2rem] border border-[#d4b06a]/20 bg-gradient-to-br from-white/[0.09] to-white/[0.03] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl md:p-12">

          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#d4b06a]">
            RSVP ontvangen
          </p>

          <h1
            className="mt-4 text-5xl"
            style={{
              fontFamily: "var(--font-cormorant)",
            }}
          >
            Bedankt!
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-gray-300">
            We hebben jullie RSVP reeds ontvangen.
          </p>

        </div>

      </main>
    );
  }

  redirect(`/i/${code}/rsvp`);
}

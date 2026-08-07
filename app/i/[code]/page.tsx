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
      <main className="min-h-screen flex items-center justify-center bg-[#183328] px-6 text-white">

        <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur">

          <h1
            className="text-5xl"
            style={{
              fontFamily: "var(--font-cormorant)",
            }}
          >
            Bedankt!
          </h1>

          <p className="mt-8 text-lg text-gray-300">
            We hebben jullie RSVP reeds ontvangen.
          </p>

        </div>

      </main>
    );
  }

  redirect(`/i/${code}/rsvp`);
}
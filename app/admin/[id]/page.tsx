import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CopyLinkButton from "@/components/admin/CopyLinkButton";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InviteDetails({ params }: Props) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("invites")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#183328] px-8 py-16 text-white">

      <div className="mx-auto max-w-5xl">

        <Link
          href="/admin"
          className="text-[#d4b06a]"
        >
          ← Terug naar dashboard
        </Link>

        <h1
          className="mt-6 text-6xl"
          style={{
            fontFamily: "var(--font-cormorant)",
          }}
        >
          {data.family_name}
        </h1>

        <div className="mt-12 grid gap-6 md:grid-cols-2">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-gray-400">Code</p>
            <p className="mt-3 font-mono text-3xl">
              {data.code}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-gray-400">Aantal personen</p>
            <p className="mt-3 text-3xl">
              {data.allowed_guests}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-gray-400">Email</p>
            <p className="mt-3">
              {data.email || "-"}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-gray-400">Status</p>
            <p className="mt-3 text-xl">
              {data.answered ? "✅ Beantwoord" : "⌛ Wachtend"}
            </p>
          </div>

        </div>

        <div className="mt-12 flex flex-wrap gap-4">

          <a
            href={`/i/${data.code}`}
            target="_blank"
            className="rounded-full border border-[#d4b06a] px-8 py-3 hover:bg-[#d4b06a] hover:text-[#183328]"
          >
            Open uitnodiging
          </a>

          <CopyLinkButton code={data.code} />

          <button
            className="rounded-full border border-white/20 px-8 py-3"
          >
            QR-code (volgende stap)
          </button>

        </div>

      </div>

    </main>
  );
}
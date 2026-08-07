import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function AdminPage() {
  const { data } = await supabase
    .from("invites")
    .select("*")
    .order("family_name");

  const invites = data ?? [];

  const total = invites.length;
  const answered = invites.filter((i) => i.answered).length;
  const waiting = total - answered;

  return (
    <main className="min-h-screen bg-[#183328] px-8 py-16 text-white">

      <div className="mx-auto max-w-7xl">

        <h1
          className="text-6xl"
          style={{
            fontFamily: "var(--font-cormorant)",
          }}
        >
          Dashboard
        </h1>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-gray-300">Uitnodigingen</p>
            <p className="mt-4 text-5xl font-bold text-[#d4b06a]">
              {total}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-gray-300">Beantwoord</p>
            <p className="mt-4 text-5xl font-bold text-green-400">
              {answered}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-gray-300">Wachtend</p>
            <p className="mt-4 text-5xl font-bold text-orange-400">
              {waiting}
            </p>
          </div>

        </div>

        <div className="mt-10">

          <Link
            href="/admin/new"
            className="rounded-full border border-[#d4b06a] px-8 py-4 transition hover:bg-[#d4b06a] hover:text-[#183328]"
          >
            + Nieuwe uitnodiging
          </Link>

        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-white/10">

          <table className="w-full">

            <thead className="bg-white/5">

              <tr>
                <th className="px-6 py-4 text-left">Familie</th>
                <th className="px-6 py-4 text-left">Code</th>
                <th className="px-6 py-4 text-left">Personen</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Acties</th>
              </tr>

            </thead>

            <tbody>

              {invites.map((invite) => (

                <tr
                  key={invite.id}
                  className="border-t border-white/10"
                >

                  <td className="px-6 py-5">
                    {invite.family_name}
                  </td>

                  <td className="px-6 py-5 font-mono">
                    {invite.code}
                  </td>

                  <td className="px-6 py-5">
                    {invite.allowed_guests}
                  </td>

                  <td className="px-6 py-5">
                    {invite.answered ? "✅ Beantwoord" : "⌛ Wachtend"}
                  </td>

                  <td className="px-6 py-5">

                    <div className="flex justify-end gap-3">

                      <Link
                        href={`/admin/${invite.id}`}
                        className="rounded-full border border-[#d4b06a] px-5 py-2"
                      >
                        Open
                      </Link>

                      <a
                        href={`/i/${invite.code}`}
                        target="_blank"
                        className="rounded-full border border-white/20 px-5 py-2"
                      >
                        Uitnodiging
                      </a>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}
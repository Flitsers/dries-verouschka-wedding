import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { submitRSVP } from "@/app/actions/rsvp";

type Props = {
  params: Promise<{
    code: string;
  }>;
};

export default async function RSVPPage({ params }: Props) {
  const { code } = await params;

  const { data, error } = await supabase
    .from("invites")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#183328] px-6 py-24 text-white">

      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur">

        <p className="uppercase tracking-[0.5em] text-[#d4b06a]">
          RSVP
        </p>

        <h1
          className="mt-5 text-6xl"
          style={{
            fontFamily: "var(--font-cormorant)",
          }}
        >
          Welkom
        </h1>

        <h2
          className="mt-10 text-5xl"
          style={{
            fontFamily: "var(--font-cormorant)",
          }}
        >
          {data.family_name}
        </h2>

        <p className="mt-6 text-xl text-gray-300">
          Jullie zijn uitgenodigd met
        </p>

        <p className="mt-2 text-6xl font-bold text-[#d4b06a]">
          {data.allowed_guests}
        </p>

        <p className="text-xl text-gray-300">
          personen
        </p>

        <form
          action={submitRSVP}
          className="mt-12 space-y-6"
        >

          <input
            type="hidden"
            name="code"
            value={data.code}
          />

          <div>

            <label className="text-sm text-gray-300">
              Aanwezigheid
            </label>

            <select
              name="attending"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white"
            >
              <option value="Ja">
                Wij komen graag
              </option>

              <option value="Nee">
                Helaas kunnen wij niet komen
              </option>

            </select>

          </div>

          <div>

            <label className="text-sm text-gray-300">
              Bericht of dieetwensen
            </label>

            <textarea
              name="message"
              rows={5}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white"
              placeholder="Laat hier iets weten..."
            />

          </div>

          <button
            className="rounded-full border border-[#d4b06a] px-10 py-4 transition hover:bg-[#d4b06a] hover:text-[#183328]"
          >
            Bevestigen
          </button>

        </form>

      </div>

    </main>
  );
}
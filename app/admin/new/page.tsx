import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

async function createInvite(formData: FormData) {
  "use server";

  const family_name = formData.get("family_name") as string;

  const allowed_guests = Number(
    formData.get("allowed_guests")
  );

  const email = formData.get("email") as string;

  const code = randomUUID()
    .replace(/-/g, "")
    .substring(0, 8)
    .toUpperCase();

  const { data, error } = await supabase
    .from("invites")
    .insert({
      code,
      family_name,
      allowed_guests,
      email,
    })
    .select();

  console.log("========== SUPABASE ==========");
  console.log("DATA:");
  console.log(data);
  console.log("ERROR:");
  console.log(error);
  console.log("==============================");

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  redirect("/admin");
}

export default function NewInvitePage() {
  return (
    <main className="min-h-screen bg-[#183328] px-8 py-16 text-white">

      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-10">

        <h1
          className="text-5xl"
          style={{
            fontFamily: "var(--font-cormorant)",
          }}
        >
          Nieuwe uitnodiging
        </h1>

        <form
          action={createInvite}
          className="mt-10 space-y-6"
        >

          <div>

            <label>
              Familie
            </label>

            <input
              name="family_name"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4"
            />

          </div>

          <div>

            <label>
              Personen
            </label>

            <input
              name="allowed_guests"
              type="number"
              defaultValue={2}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4"
            />

          </div>

          <div>

            <label>
              Email
            </label>

            <input
              name="email"
              type="email"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4"
            />

          </div>

          <button
            className="rounded-full border border-[#d4b06a] px-10 py-4 transition hover:bg-[#d4b06a] hover:text-[#183328]"
          >
            Uitnodiging maken
          </button>

        </form>

      </div>

    </main>
  );
}
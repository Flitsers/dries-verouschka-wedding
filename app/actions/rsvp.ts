"use server";

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export async function submitRSVP(formData: FormData) {
  const code = formData.get("code") as string;

  const attending = formData.get("attending") as string;

  const message = formData.get("message") as string;

  const { error } = await supabase
    .from("guests")
    .update({
      attending,
      message,
    })
    .eq("invite_code", code);

  if (error) {
    console.error(error);
    throw new Error("RSVP opslaan mislukt");
  }

  const { error: inviteError } = await supabase
    .from("invites")
    .update({
      answered: true,
    })
    .eq("code", code);

  if (inviteError) {
    console.error(inviteError);
    throw new Error("Uitnodiging kon niet bijgewerkt worden.");
  }

  redirect(`/i/${code}`);
}